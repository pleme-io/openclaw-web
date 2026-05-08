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

## Verification

```bash
curl -I https://cartorio.dev.use1.quero.cloud/health           # 200 ok
curl -sS https://cartorio.dev.use1.quero.cloud/api/v1/merkle/root | jq

# In a browser:
open https://openclaw.dev.use1.quero.cloud
```
