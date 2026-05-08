# Deploying openclaw-web publicly on pleme-dev

End-to-end: hackathon visitor lands at `https://openclaw.dev.use1.quero.cloud`,
sees cartorio's merkle ledger, drag-drops a manifest in the Verify tab.

```
Cloudflare Edge ─TLS─▶ openclaw-pleme-dev tunnel
                       │
                       ▼  cloudflared (k8s pod in `cloudflared` ns)
                       │
                       ├─▶ openclaw.dev.use1.quero.cloud
                       │      → openclaw-stack-openclaw-web.openclaw.svc:80  (the SPA)
                       │
                       └─▶ cartorio.dev.use1.quero.cloud
                              → openclaw-stack-cartorio.openclaw.svc:8082  (REST API)
```

## What's already in place (committed)

| Layer | Repo | State |
|---|---|---|
| SPA scaffold + 4 pages | `openclaw-web` | live on `main` |
| amd64 OCI image | `ghcr.io/pleme-io/openclaw-web` | tag `amd64-latest` |
| Cartorio CORS support | `cartorio@v0.6.0` | live on ghcr |
| Cartorio + openclaw-web Helm charts | `helmworks/charts/{lareira-cartorio,lareira-openclaw-web}` | published to `oci://ghcr.io/pleme-io/charts` |
| Pleme-dev helmrelease consumes both | `k8s/clusters/pleme-dev/apps/openclaw/helmrelease.yaml` | committed |
| Pangea tunnel workspace | `pangea-architectures/workspaces/cloudflare-pleme-dev-tunnel/` | committed |
| Cloudflared k8s deployment | `k8s/clusters/pleme-dev/apps/openclaw-tunnel/` | committed |

## What you need to do once (3 manual steps)

### 1. Apply the pangea tunnel workspace

```bash
cd ~/code/github/pleme-io/pangea-architectures/workspaces/cloudflare-pleme-dev-tunnel
PLATFORM=pleme nix run .#deploy
```

This creates the `openclaw-pleme-dev` Cloudflare tunnel + ingress
config + the two CNAME records pointing at it.

### 2. Capture the tunnel token + write back to account.yaml

```bash
TID=$(tofu -chdir=$HOME/.pangea/workspaces/production/cloudflare-pleme-dev-tunnel output -raw tunnel_id)
TOKEN=$(tofu -chdir=$HOME/.pangea/workspaces/production/cloudflare-pleme-dev-tunnel output -raw tunnel_token)

# Update account.yaml so subsequent applies are stable
sed -i '' "s/^tunnel_id: .*/tunnel_id: \"$TID\"/" account.yaml
git add account.yaml && git commit -m "cloudflare-pleme-dev-tunnel: persist tunnel_id from first apply"
```

### 3. Materialize the cloudflared token Secret (SOPS-encrypted)

```bash
cd ~/code/github/pleme-io/k8s

cat > /tmp/cloudflared-token.yaml <<EOF
apiVersion: v1
kind: Secret
metadata: { name: cloudflared-token, namespace: cloudflared }
type: Opaque
stringData:
  token: "$TOKEN"
EOF

sops --encrypt /tmp/cloudflared-token.yaml \
  > clusters/pleme-dev/apps/openclaw-tunnel/cloudflared-token.sops.yaml
rm /tmp/cloudflared-token.yaml

# Wire it into the kustomization (uncomment the line):
sed -i '' 's|# - cloudflared-token.sops.yaml|- cloudflared-token.sops.yaml|' \
  clusters/pleme-dev/apps/openclaw-tunnel/kustomization.yaml

# Drop the placeholder
rm clusters/pleme-dev/apps/openclaw-tunnel/cloudflared-token.sops.yaml.placeholder

git add -A && git commit -m "openclaw-tunnel: materialize cloudflared-token from pangea apply" && git push
```

### 4. Force flux reconcile

```bash
kubectl --context pleme-dev -n flux-system annotate gitrepository/flux-system \
  reconcile.fluxcd.io/requestedAt="$(date -u +%FT%TZ)" --overwrite
```

Cloudflared rolls; ~30 seconds later the two hostnames serve.

### 5. Seed cartorio with demo content

Cartorio in pleme-dev runs `--backend memory` (the published image was
not built with `--features sqlite`; substrate's `rust-service-flake.nix`
needs a `cargoFeatures` arg to thread that through — tracked separately).
Memory backend wipes on every pod restart, so right after a Helm
upgrade or pod evict, the SPA renders an empty ledger.

Re-seed by running tabeliao against the live cartorio:

```bash
# port-forward into the cluster
kubectl --context pleme-dev -n openclaw port-forward svc/openclaw-stack-cartorio 8082:8082 &
kubectl --context pleme-dev -n openclaw port-forward svc/openclaw-stack-lacre 8083:8083 &
kubectl --context pleme-dev -n openclaw port-forward svc/openclaw-stack-backing-registry 5000:5000 &

cd ~/code/github/pleme-io/tabeliao
# real demo recipe — alpine image into bundled zot, helm chart from
# ghcr, bundle binding both. See tests/real_openclaw_e2e.rs.
cargo test --release --test real_openclaw_e2e -- --nocapture
```

After this completes, `GET /api/v1/artifacts` against cartorio returns
non-empty content and the SPA shows real proofs.

## Verification

```bash
curl -I https://cartorio.dev.use1.quero.cloud/health           # 200 ok
curl -sS https://cartorio.dev.use1.quero.cloud/api/v1/merkle/root | jq

# In a browser:
open https://openclaw.dev.use1.quero.cloud
```

## Outstanding architectural debt

| Item | Where | Why it matters |
|---|---|---|
| `cargoFeatures` arg in `rust-service-flake.nix` | `pleme-io/substrate` | Lets cartorio's published image ship with `--features sqlite` so the merkle ledger survives pod restarts. Today's demo wipes on any reconcile. |
| Cloudflare-pleme-dev-tunnel as a flake flow | `pleme-io/pangea-architectures` `flake.nix` | Currently unregistered; `nix run .#deploy-cloudflare-pleme-dev-tunnel` doesn't exist. Operator has to invoke pangea via bundle exec instead of the canonical `nix run` entry point. |
| Backing-registry is `auth.backend: none` | helmrelease values | Anonymous pulls work; production hardening would wire OIDC + lacre-only writes. Fine for the demo. |
| No ingress controller on pleme-dev k3s | n/a | Cloudflare Tunnel routes directly to k8s Services so this is moot for the demo, but makes the chart's `Ingress` resources orphans. |
