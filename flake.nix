{
  description = "openclaw-web — public read-only browser view of the proof chain";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-parts.url = "github:hercules-ci/flake-parts";
    substrate = {
      url = "github:pleme-io/substrate";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ { flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "aarch64-darwin" "x86_64-linux" "aarch64-linux" "x86_64-darwin" ];

      perSystem = { pkgs, ... }: let
        node = pkgs.nodejs_20;
        # Minimal dev shell. M0 of the build chain: dev + type-check
        # + vite build all run from inside this shell. M1 (Phase 4 of
        # PLAN.md) wires substrate's mkViteBuild + mkNodeDockerImage
        # for the production OCI image.
        webShell = pkgs.mkShell {
          packages = [ node pkgs.git ];
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "openclaw-web dev shell — node $(node --version), npm $(npm --version)"
          '';
        };
      in {
        devShells.default = webShell;

        apps.dev = {
          type = "app";
          program = "${pkgs.writeShellScript "openclaw-web-dev" ''
            export PATH="${node}/bin:$PATH"
            cd "''${PWD}"
            if [ ! -d node_modules ]; then
              echo "→ installing dependencies"
              ${node}/bin/npm install
            fi
            exec ${node}/bin/npm run dev
          ''}";
        };

        apps.build = {
          type = "app";
          program = "${pkgs.writeShellScript "openclaw-web-build" ''
            export PATH="${node}/bin:$PATH"
            cd "''${PWD}"
            ${node}/bin/npm install
            exec ${node}/bin/npm run build
          ''}";
        };

        apps.type-check = {
          type = "app";
          program = "${pkgs.writeShellScript "openclaw-web-tc" ''
            export PATH="${node}/bin:$PATH"
            cd "''${PWD}"
            ${node}/bin/npm install
            exec ${node}/bin/npm run type-check
          ''}";
        };
      };
    };
}
