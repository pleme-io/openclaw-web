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

  outputs = inputs @ { flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "aarch64-darwin" "x86_64-linux" "aarch64-linux" "x86_64-darwin" ];

      perSystem = { pkgs, ... }: let
        node = pkgs.nodejs_20;
        webShell = pkgs.mkShell {
          packages = [ node pkgs.git ];
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "openclaw-web dev shell — node $(node --version), npm $(npm --version)"
          '';
        };

        # Per-Linux-arch image derivation. When this flake is evaluated
        # from darwin and a darwin user runs `nix build .#dockerImage-amd64`,
        # the derivation has system=x86_64-linux and nix dispatches it
        # to a registered builder via /etc/nix/machines (rio in our
        # cluster). Same shape as cartorio.
        mkImage = targetSystem: tagSuffix: let
          xpkgs = import nixpkgs { system = targetSystem; };
          xspa = xpkgs.buildNpmPackage {
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
          tag = tagSuffix;
          contents = [ xpkgs.cacert ];
          extraCommands = ''
            mkdir -p usr/share/nginx/html var/log/nginx var/cache/nginx tmp
            chmod 0777 var/log/nginx var/cache/nginx tmp
            cp -r ${xspa}/* usr/share/nginx/html/
            mkdir -p etc/nginx
            cat > etc/nginx/nginx.conf <<EOF
            worker_processes 1;
            error_log /dev/stderr info;
            pid /tmp/nginx.pid;
            events { worker_connections 1024; }
            http {
              # Use the mime.types shipped with the nixpkgs nginx
              # build (substitution happens at template render).
              include ${xpkgs.nginx}/conf/mime.types;
              default_type application/octet-stream;
              access_log /dev/stdout;
              client_body_temp_path /tmp/client_body 1 2;
              proxy_temp_path /tmp/proxy 1 2;
              fastcgi_temp_path /tmp/fastcgi 1 2;
              uwsgi_temp_path /tmp/uwsgi 1 2;
              scgi_temp_path /tmp/scgi 1 2;
              sendfile on; keepalive_timeout 65; gzip on;
              gzip_types text/css application/javascript application/json image/svg+xml;
              server {
                listen 80;
                root /usr/share/nginx/html;
                index index.html;
                location / { try_files \$uri \$uri/ /index.html; }
                # Chart ConfigMap mounts /config.js at runtime; serve
                # no-cache so a pod restart picks up value changes
                # without re-baking the image.
                location = /config.js { add_header Cache-Control "no-store" always; }
              }
            }
            EOF
          '';
          config = {
            Cmd = [ "${xpkgs.nginx}/bin/nginx" "-c" "/etc/nginx/nginx.conf" "-g" "daemon off;" ];
            ExposedPorts = { "80/tcp" = {}; };
          };
        };
      in {
        devShells.default = webShell;
        # Image packages — uniform across all systems. Each derivation
        # requires its own target system; nix.distributedBuilds dispatches
        # to the appropriate registered builder.
        packages.dockerImage-amd64 = mkImage "x86_64-linux"  "amd64-latest";
        packages.dockerImage-arm64 = mkImage "aarch64-linux" "arm64-latest";
      };
    };
}
