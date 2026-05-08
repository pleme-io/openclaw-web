# openclaw-web

> Public, read-only web view of the openclaw proof chain. Demos cartorio's
> merkle ledger, lacre's gating, and the **transferable receipt** for
> compliant artifacts (image / helm-chart / bundle).

## What it shows

A visitor at `https://openclaw-dev.quero.cloud` sees:

1. **Merkle root** — `state_root`, `event_root`, `ledger_root`, artifact count, audit-consistency badge.
2. **Artifact ledger** — every admitted artifact with its `(digest, profile, result_hash)` triple. Image / helm / bundle entries side by side.
3. **Bundle expansion** — for any `kind: bundle` row, a tree view of its members + each member's `pack_hash`. The bundle's receipt is mechanically inheritable from member proofs.
4. **Verify** — drag-drop a manifest file. The browser computes `sha256(bytes)` (no upload), fetches cartorio's record by digest, renders match / mismatch + the full receipt.

That's the value: anyone with public bytes + the public `provas` pack
source can re-derive every `result_hash` and confirm cartorio's claim.

## Tech stack

Mirrors `lilitu/web` (the canonical TS frontend in pleme-io):

| Layer | Choice |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Components | **`pleme-ui-components`** (atoms/molecules from the typed widget catalog) + MUI v7 + Emotion |
| Domain types | **`pleme-types`** + `cartorio` wire types via OpenAPI codegen |
| Data fetching | TanStack Query |
| Routing | TanStack Router (file-based, codegen `routeTree.gen.ts`) |
| Validation | Zod |
| Lockfile | bun |
| Observability | Sentry + `@pleme-io/observability` |
| Layout | FSD: `src/{app,pages,features,widgets,entities,shared}` |
| Build | flake → vite build → nginx OCI image → ghcr |
| Deploy | `lareira-openclaw-web` Helm chart (wraps `pleme-web` lib) → flux |

## Substrate-canonical posture

- **Atoms/molecules belong in `pleme-ui-components`.** This repo authors
  pages + the verify-drag-drop feature only. Missing widgets get added
  to `pleme-widget-spec` first → then materialized in all three sister
  renderers (`pleme-ui-components` TS, `pleme-mui` Leptos, `awase`
  Dioxus). No bespoke MUI wrappers here.
- **No GraphQL / no BFF.** Cartorio's REST API is the source of truth.
  This is read-only public data; no value in a hanabi shim.
- **No publish action exposed.** Demo is read-only end-to-end.
- **Hostname** via `nix/lib/fleet-domains.nix::mkHostname`:
  `openclaw-dev.quero.cloud` (4-part shape per fleet rule).

## Sibling repos in the proof chain

| Repo | Role |
|---|---|
| [`provas`](https://github.com/pleme-io/provas) | typed compliance packs (image / helm / bundle / helm-content / helm-rendered) |
| [`tabeliao`](https://github.com/pleme-io/tabeliao) | publisher CLI: pack → admit → push |
| [`cartorio`](https://github.com/pleme-io/cartorio) | merkle ledger / source of truth (REST API consumed by this app) |
| [`lacre`](https://github.com/pleme-io/lacre) | wire-level OCI gate |
| `openclaw-web` (this repo) | public, read-only browser view |

## Build + run

`nix run .#dev` — vite dev server pointed at a local cartorio.
`nix build .#dockerImage-amd64` — production OCI image.
`nix run .#push-image-amd64` — push to ghcr.

(Both follow the substrate `web-service-flake` pattern; see
`pleme-io/substrate/lib/build/web/service-flake.nix` once the module
is available — until then this repo bootstraps from `lilitu/web`'s
flake shape.)
