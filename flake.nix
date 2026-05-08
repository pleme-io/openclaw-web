{
  description = "openclaw-web — public read-only browser view of the proof chain";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
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
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.fenix.follows = "fenix";
    };

    forge = {
      url = "github:pleme-io/forge";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.fenix.follows = "fenix";
      inputs.crate2nix.follows = "crate2nix";
      inputs.substrate.follows = "substrate";
    };

    # Pinned to the same rev lilitu/web is on. Hanabi exposes its full
    # service docker tarball (hanabi-service.tar.gz with WorkingDir
    # /app/static + Cmd /bin/hanabi). We layer our SPA on top of that
    # tarball — gets every passwd/SSL/SPA-fallback affordance hanabi
    # already proves out, without dragging hanabi's full source build
    # chain (200-line lilitu/web recipe with merged-src + musl crate2nix).
    hanabi = {
      url = "github:pleme-io/hanabi/7b8944b31396d15532aecdbd54100d7a4908fec5";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.fenix.follows = "fenix";
      inputs.crate2nix.follows = "crate2nix";
      inputs.substrate.follows = "substrate";
      inputs.forge.follows = "forge";
    };
  };

  outputs = inputs @ { flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "aarch64-darwin" "x86_64-linux" "aarch64-linux" "x86_64-darwin" ];

      perSystem = { pkgs, system, ... }: let
        node = pkgs.nodejs_20;
        webShell = pkgs.mkShell {
          packages = [ node pkgs.git ];
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "openclaw-web dev shell — node $(node --version), npm $(npm --version)"
          '';
        };

        mkImage = arch: let
          targetSystem = if arch == "amd64" then "x86_64-linux" else "aarch64-linux";
          xpkgs = import nixpkgs { system = targetSystem; };
          # The hanabi service tarball, used as our base layer. CMD =
          # /bin/hanabi, WorkingDir = /app/static, user `web`, SSL +
          # passwd already correct. We just drop our dist/ on top.
          hanabiBase = inputs.hanabi.packages.${targetSystem}."dockerImage-${arch}";
          spa = xpkgs.buildNpmPackage {
            pname = "openclaw-web";
            version = "0.1.0";
            src = pkgs.lib.cleanSource ./.;
            npmDepsHash = "sha256-6pYtu8pBjMHiweCFPTnlGdJawWroqUlkoddDyU5+uO4=";
            npmFlags = [ "--legacy-peer-deps" ];
            dontNpmPrune = true;
            installPhase = ''
              runHook preInstall
              mkdir -p $out
              cp -r dist/* $out/
              runHook postInstall
            '';
          };
        in xpkgs.dockerTools.buildLayeredImage {
          name = "openclaw-web";
          tag = "${arch}-latest";
          fromImage = hanabiBase;
          contents = [ ];
          extraCommands = ''
            mkdir -p app/static
            cp -r ${spa}/* app/static/
            chmod -R 755 app/static
          '';
          # Inherit fromImage's Cmd / WorkingDir / Env — hanabi already
          # has /bin/hanabi as CMD and /app/static as WorkingDir.
        };
      in {
        devShells.default = webShell;
        packages.dockerImage-amd64 = mkImage "amd64";
        packages.dockerImage-arm64 = mkImage "arm64";
      };
    };
}
