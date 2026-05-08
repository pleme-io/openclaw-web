# openclaw-web — implementation plan

> Drives the next session. Each phase is one focused half-day, in
> order. Demo-ready at the end of Phase 4. Phases 5+ are nice-to-have.

## Phase 0 — repo scaffold (~30 min)

- `gh repo create pleme-io/openclaw-web --public --push` (currently
  rate-limited; retry).
- Copy tooling shape from `lilitu/web/`:
  - `package.json` (drop lilitu-specific scripts; keep dev/build/test/lint/codegen)
  - `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.node.json`
  - `biome.json`, `eslint.config.js`, `eslint-rules/`
  - `index.html` (title + favicon)
  - `public/`
- Initial deps:
  - `react@18`, `react-dom@18`
  - `@mui/material@^7`, `@mui/icons-material@^7`, `@emotion/{react,styled}`
  - `@pleme-io/observability`, `@pleme-io/error-boundary`
  - `@tanstack/react-query`, `@tanstack/react-router`
  - `zod`
  - `pleme-ui-components` (path or git dep)
- `bun install` → commit `bun.lockb`.

## Phase 1 — flake + dev shell (~30 min)

- `flake.nix` mirroring `lilitu/web/`'s shape, but consuming
  `substrate.lib.web-service-flake` (verify availability; fall back
  to lilitu's pattern if absent — the substrate module is the
  long-term home).
- Outputs: `packages.<sys>.dockerImage-amd64`, `apps.<sys>.dev`,
  `apps.<sys>.push-image-amd64`, `devShells.<sys>.default`.
- `nix flake update` + commit lock.
- `nix run .#dev` proves the dev server boots.

## Phase 2 — typed cartorio client + entities (~1 hr)

- `shared/api/cartorio.ts` — typed `fetch` wrapper. Inputs: base URL
  (from runtime config). Returns `Promise<T>` with zod-parsed body.
- `entities/artifact/{model.ts,api.ts,index.ts}`:
  - `model.ts` — Zod schemas mirroring cartorio's
    `ArtifactState` + `AttestationChain` + `ComplianceAttestation`
    + `BundleMember`. Mirror is the substrate-canonical move; run
    `forge-gen` against cartorio's OpenAPI spec at the end of the
    session and replace with generated types (TODO marker).
  - `api.ts` — TanStack Query hooks: `useMerkleRoot`,
    `useArtifacts`, `useArtifact(id)`, `useArtifactByDigest(d)`.
- One smoke test: render a hardcoded `ArtifactState` from a
  fixture, snapshot via vitest.

## Phase 3 — pages (~2-3 hr)

Routes via TanStack Router (file-based):

| File | Route | Source data |
|---|---|---|
| `pages/Overview.tsx` | `/` | `useMerkleRoot()` + `audit-consistency` POST |
| `pages/Artifacts.tsx` | `/artifacts` | `useArtifacts()` table |
| `pages/ArtifactDetail.tsx` | `/artifacts/$id` | `useArtifact($id)`; bundle expands member tree |
| `pages/Verify.tsx` | `/verify` | drag-drop → `crypto.subtle.digest` → `useArtifactByDigest()` |

Widgets needed (none authored here — gaps go in `pleme-widget-spec`):

- `MerkleSummaryCard` — root + count + audit healthy badge
- `ProofChip` — copyable hash with truncation + tooltip
- `BundleMemberTree` — recursive view, each member is a `ProofChip` + click-through link
- `VerifyDrop` — file drop + sha256 + match/mismatch badge

If any are missing in `pleme-ui-components`, file an issue against
`pleme-widget-spec` first; ship a thin in-app fallback only as a
named TODO.

## Phase 4 — cluster surface + public deploy (~1-2 hr)

Outside this repo:

1. **Cartorio CORS** — bump cartorio:
   - Add `tower-http`'s `CorsLayer` permitting
     `https://openclaw.dev.use1.quero.cloud` (read-only methods only).
   - Cut a 0.6.x release.
2. **Cartorio ingress** — bump `lareira-cartorio`:
   - Add `ingress.enabled: bool` and `ingress.host: string` values.
   - Default off; pleme-dev sets enabled + `cartorio.dev.use1.quero.cloud`.
3. **`lareira-openclaw-web` chart** (new):
   - Wraps `pleme-web` library chart.
   - Pulls `ghcr.io/pleme-io/openclaw-web:amd64-…`.
   - `ingress.host: openclaw.dev.use1.quero.cloud`.
   - Config injection via `ConfigMap` → `window.__OPENCLAW_CARTORIO_URL__`
     (lilitu's web-runtime-configuration pattern).
4. **Umbrella update** — `lareira-openclaw-stack`:
   - Add `web:` aliased dep on `lareira-openclaw-web`.
   - Bump to 0.5.0.
5. **pleme-dev helmrelease.yaml** — consume new umbrella version,
   set `web.enabled: true`.
6. **DNS** — Cloudflare records for the two hostnames flow through
   the existing tunnel (saguão Phase 4 hostname rule).

## Phase 5 — polish (nice to have)

- Skeleton loading, dark theme toggle, copy-with-checkmark on chips.
- A "client-side replay" mode for the Verify page: in addition to
  fetching cartorio's stored `result_hash`, run the pack code in
  Wasm against the dropped manifest bytes and compare. Requires
  shipping a Wasm build of `provas`. Maximally substrate-aligned
  but probably out of demo scope.
- `forge-gen` the cartorio TS types from its OpenAPI spec; replace
  the hand-mirrored zod schemas in `entities/artifact/model.ts`.
- Add OpenTelemetry traces via `@pleme-io/observability` so each
  cartorio fetch shows up in Sentry.

## Done definition

A judge visiting `https://openclaw.dev.use1.quero.cloud` can:
- See the merkle root + 7+ artifacts + audit-consistency = healthy.
- Click into the bundle, see its 2 members + their pack_hashes.
- Drag the alpine manifest file in; the page rehashes it client-side
  and shows the green match badge with the receipt.
- Inspect the source on GitHub; every assertion is mechanical.
