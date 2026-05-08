# openclaw-web — agent context

> **★★★ CSE / Knowable Construction.** This repo operates under
> **Constructive Substrate Engineering** — canonical specification at
> [`pleme-io/theory/CONSTRUCTIVE-SUBSTRATE-ENGINEERING.md`](https://github.com/pleme-io/theory/blob/main/CONSTRUCTIVE-SUBSTRATE-ENGINEERING.md).
> The Compounding Directive (operational rules: solve once, load-bearing
> fixes only, idiom-first, models stay current, direction beats velocity)
> is in the org-level pleme-io/CLAUDE.md ★★★ section. Read both before
> non-trivial changes.

## Charter

Public, read-only browser view of the openclaw proof chain on
`pleme-dev` (and any future cluster carrying the openclaw-stack). The
single value claim:

> A `(digest, profile, result_hash)` triple anyone in the world can
> re-derive from public bytes + public pack source — that's the
> transferable receipt. This site renders the ledger holding those
> triples + lets a visitor verify one in their own browser.

## Established frontend space

This repo is the openclaw-specific **page consumer** in pleme-io's
typed-widget renderer ecosystem. The shared layer is *not* in this
repo:

| Layer | Owner |
|---|---|
| Typed widget gospel (no framework) | `pleme-widget-spec` |
| Atoms/molecules — TypeScript renderer | **`pleme-ui-components`** ← this repo's UI dep |
| Atoms/molecules — Leptos renderer | `pleme-mui` |
| Atoms/molecules — Dioxus renderer | `awase` (planned) |
| Domain types | `pleme-types`, `cartorio` wire types |
| Reference TS app | `lilitu/web/` |

**Don't author components here.** If a widget is missing
(e.g. `MerkleTreeView`, `ProofChip`), add it to `pleme-widget-spec`
first → materialize in all three sister renderers → consume here.
That's Pillar 12 (generation over composition).

## Pages (FSD)

- `pages/Overview.tsx` — `GET /api/v1/merkle/root` + audit-consistency.
- `pages/Artifacts.tsx` — `GET /api/v1/artifacts` table.
- `pages/ArtifactDetail.tsx` — full receipt; bundle members expand.
- `pages/Verify.tsx` — drag-drop manifest, browser sha256, fetch
  `/api/v1/artifacts/by-digest/{digest}`, match badge.

## Cluster surface (the data plane)

Cartorio's REST API is the sole upstream:

| Path | Purpose |
|---|---|
| `GET  /api/v1/merkle/root` | Headline root + counts. |
| `GET  /api/v1/artifacts` | Paged list. |
| `GET  /api/v1/artifacts/{id}` | Single record. |
| `GET  /api/v1/artifacts/by-digest/{digest}` | Verify-side lookup. |
| `POST /api/v1/admin/audit-consistency` | (read-only POST) — re-folds events, returns `healthy: bool`. |

**No auth on the public path** (read-only API). Admit / mutation
endpoints are protected by cartorio's verifier policy + signed_root
shape and are not exposed by this app's UI.

## Cluster prep before this app can live publicly

Tracked as gates outside this repo:

1. `cartorio` adds `tower-http::cors::CorsLayer` allowing
   `https://openclaw.dev.use1.quero.cloud`. Bumps cartorio.
2. `lareira-cartorio` chart grows `ingress.enabled` (and a
   `host: cartorio.dev.use1.quero.cloud` value).
3. `lareira-openclaw-web` chart (new) wraps `pleme-web` library
   chart, pulls this image, ingress at `openclaw.dev.use1.quero.cloud`.
4. `lareira-openclaw-stack` umbrella adds `web:` alias for the new
   chart.
5. pleme-dev's `helmrelease.yaml` consumes the new umbrella version.

DNS for both hostnames flows through Cloudflare → tunnel → cluster
ingress (saguão posture; vigia in front per cluster).

## Anti-patterns

- Authoring MUI wrappers / atoms here. Every new shape goes in
  `pleme-widget-spec` first.
- Reaching for cartorio via a BFF (hanabi). REST is fine; the data
  is public and read-only.
- Hard-coding cluster URLs. Read from runtime config (Vite env var
  + window-injected runtime config; see lilitu's
  web-runtime-configuration skill).
- Anything write-shaped in the UI (no admit, no mutation forms).
- Bundling a heavy SDK for cartorio when a typed `fetch` wrapper
  driven from the OpenAPI spec is one substrate-canonical
  `forge-gen` away.

## Forward path

See `README.md` § Tech stack + § Substrate-canonical posture for the
shape; see this file's § Cluster prep for the gates outside this repo.
First in-repo work after init: copy `lilitu/web`'s tooling
(package.json scripts, biome.json, eslint.config, vitest, vite
config) without lilitu's domain code, wire `pleme-ui-components` as
the only UI dep, scaffold the four pages with stub data, then loop
in the cartorio fetch hooks.
