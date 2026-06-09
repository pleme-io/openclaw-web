{
  description = "openclaw-web — public read-only browser view of the proof chain";

  inputs = {
    nixpkgs.follows = "substrate/nixpkgs";
    flake-parts.url = "github:hercules-ci/flake-parts";

    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    crate2nix = {
      url = "github:nix-community/crate2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    substrate = {
      url = "github:pleme-io/substrate";
      inputs.fenix.follows = "fenix";
    };

    forge = {
      url = "github:pleme-io/forge";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.fenix.follows = "fenix";
      inputs.crate2nix.follows = "crate2nix";
      inputs.substrate.follows = "substrate";
    };

    # Hanabi BFF + libraries — pinned to the same revs lilitu/web uses.
    # Hanabi's Cargo.nix references ../../libraries/rust/crates/... so
    # we materialize a merged source tree (mergedHanabiSrc) before
    # running crate2nix. Lilitu's web-services.nix is the reference.
    hanabi = {
      url = "github:pleme-io/hanabi";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.fenix.follows = "fenix";
      inputs.crate2nix.follows = "crate2nix";
      inputs.substrate.follows = "substrate";
      inputs.forge.follows = "forge";
    };

    libraries = {
      url = "github:pleme-io/libraries";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ { flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "aarch64-darwin" "x86_64-linux" "aarch64-linux" "x86_64-darwin" ];

      perSystem = { pkgs, system, ... }: let
        node = pkgs.nodejs_20;

        nixLibHost = inputs.substrate.libFor {
          inherit pkgs system;
        };

        # Target pkgs factory with Rust overlay (crate2nix needs it).
        mkTargetPkgs = targetSystem:
          import nixpkgs {
            system = targetSystem;
            overlays = [
              (nixLibHost.mkRustOverlay {
                fenix = inputs.fenix;
                system = targetSystem;
              })
            ];
          };

        archTag = {
          "x86_64-linux" = "amd64";
          "aarch64-linux" = "arm64";
        };

        # Merged hanabi source: hanabi's Cargo.nix references workspace
        # paths like ../../libraries/rust/crates/... — recreate that
        # layout under one $out so crate2nix can resolve everything.
        mergedHanabiSrc = pkgs.runCommand "hanabi-merged-src" {} ''
          mkdir -p $out/pkgs/platform
          ln -s ${inputs.hanabi} $out/pkgs/platform/hanabi
          ln -s ${inputs.libraries} $out/pkgs/libraries
        '';

        # Per-arch hanabi binary via crate2nix (musl static link).
        mkHanabi = targetSystem: let
          targetPkgs = mkTargetPkgs targetSystem;
          arch = archTag.${targetSystem};
          muslTarget =
            if arch == "arm64" then "aarch64-unknown-linux-musl"
            else "x86_64-unknown-linux-musl";
          envUpper =
            if arch == "arm64" then "AARCH64_UNKNOWN_LINUX_MUSL"
            else "X86_64_UNKNOWN_LINUX_MUSL";
          cargoNix = mergedHanabiSrc + "/pkgs/platform/hanabi/Cargo.nix";
          project = import cargoNix {
            pkgs = targetPkgs;
            defaultCrateOverrides = targetPkgs.defaultCrateOverrides // {
              hanabi = oldAttrs: {
                nativeBuildInputs = (oldAttrs.nativeBuildInputs or [])
                  ++ (with targetPkgs; [ cmake perl git ]);
                CARGO_BUILD_TARGET = muslTarget;
                "CARGO_TARGET_${envUpper}_RUSTFLAGS" =
                  "-C target-feature=+crt-static -C link-arg=-s";
              };
            };
          };
        in
          if project ? workspaceMembers
          then project.workspaceMembers.hanabi.build
          else project.rootCrate.build;

        # SPA — vite-built dist/. Arch-independent (pure JS).
        mkSpa = targetPkgs: targetPkgs.buildNpmPackage {
          pname = "openclaw-web";
          version = "0.1.0";
          src = pkgs.lib.cleanSource ./.;
          npmDepsHash = "sha256-wt+0UXUTYU4MVnN1/XBmuRIC1ilEktrBQs6TmuY6uNc=";
          npmFlags = [ "--legacy-peer-deps" ];
          dontNpmPrune = true;
          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r dist/* $out/
            runHook postInstall
          '';
        };

        # Final image: substrate's mkNodeDockerImage with the
        # crate2nix-built hanabi binary + spa. Same recipe as lilitu/web.
        mkImage = targetSystem: let
          targetPkgs = mkTargetPkgs targetSystem;
          nixLibTarget = inputs.substrate.libFor {
            pkgs = targetPkgs;
            system = targetSystem;
          };
        in nixLibTarget.mkNodeDockerImage {
          appName = "openclaw-web";
          builtApp = mkSpa targetPkgs;
          webServer = mkHanabi targetSystem;
          architecture = archTag.${targetSystem};
          tag = "${archTag.${targetSystem}}-latest";
        };

        webShell = pkgs.mkShell {
          packages = [ node pkgs.git ];
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "openclaw-web dev shell — node $(node --version), npm $(npm --version)"
          '';
        };
      in {
        devShells.default = webShell;
        packages.dockerImage-amd64 = mkImage "x86_64-linux";
        packages.dockerImage-arm64 = mkImage "aarch64-linux";
      };
    };
}
