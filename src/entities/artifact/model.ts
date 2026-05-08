/**
 * Cartorio wire-format mirror.
 *
 * Hand-mirrored Zod schemas matching cartorio v0.5.x's JSON shape
 * (pleme-io/cartorio/src/core/types.rs). Replace with `forge-gen`
 * output once that pipeline targets cartorio's OpenAPI spec
 * (Phase 5 in PLAN.md). Until then, parity is enforced by tests.
 */
import { z } from 'zod';

export const ArtifactKindSchema = z.enum(['oci-image', 'helm-chart', 'skill', 'bundle']);
export type ArtifactKind = z.infer<typeof ArtifactKindSchema>;

export const ArtifactStatusSchema = z.enum(['active', 'quarantined', 'revoked']);
export type ArtifactStatus = z.infer<typeof ArtifactStatusSchema>;

export const ComplianceStatusSchema = z.enum(['compliant', 'non-compliant', 'unknown']);
export type ComplianceStatus = z.infer<typeof ComplianceStatusSchema>;

export const SourceAttestationSchema = z.object({
  git_commit: z.string(),
  tree_hash: z.string(),
  flake_lock_hash: z.string(),
});

export const BuildAttestationSchema = z.object({
  closure_hash: z.string(),
  sbom_hash: z.string(),
  slsa_level: z.number().int().min(0).max(4),
});

export const ImageAttestationSchema = z.object({
  oci_digest: z.string(),
  cosign_signature_ref: z.string(),
  slsa_provenance_ref: z.string(),
});

export const ComplianceAttestationSchema = z.object({
  framework: z.string(),
  baseline: z.string(),
  profile: z.string(),
  result_hash: z.string(),
  status: ComplianceStatusSchema,
});

export const AttestationChainSchema = z.object({
  source: SourceAttestationSchema.nullable().optional(),
  build: BuildAttestationSchema.nullable().optional(),
  image: ImageAttestationSchema.nullable().optional(),
  compliance: ComplianceAttestationSchema.nullable().optional(),
});

export const SignedRootSchema = z.object({
  root: z.string(),
  signature: z.string(),
  algorithm: z.string(),
  signer_id: z.string(),
  signed_at: z.string(),
});

export const ArtifactSchema = z.object({
  id: z.string(),
  kind: ArtifactKindSchema,
  name: z.string(),
  version: z.string(),
  publisher_id: z.string(),
  org: z.string(),
  digest: z.string(),
  attestation: AttestationChainSchema,
  status: ArtifactStatusSchema,
  last_modified_at: z.string(),
  composed_root: z.string(),
  signed_root: SignedRootSchema,
  admitted_at: z.string().optional(),
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const ArtifactsResponseSchema = z.object({
  artifacts: z.array(ArtifactSchema),
  total: z.number().int().nonnegative(),
});
export type ArtifactsResponse = z.infer<typeof ArtifactsResponseSchema>;

export const MerkleRootSchema = z.object({
  state_root: z.string(),
  event_root: z.string(),
  ledger_root: z.string(),
  artifact_count: z.number().int().nonnegative(),
  event_count: z.number().int().nonnegative(),
  computed_at: z.string(),
});
export type MerkleRoot = z.infer<typeof MerkleRootSchema>;

export const AuditConsistencyResponseSchema = z.object({
  checked_at: z.string(),
  artifacts_checked: z.number().int().nonnegative(),
  events_replayed: z.number().int().nonnegative(),
  divergences: z.array(z.unknown()),
  missing_in_live: z.array(z.unknown()),
  missing_in_derived: z.array(z.unknown()),
  healthy: z.boolean(),
});
export type AuditConsistencyResponse = z.infer<typeof AuditConsistencyResponseSchema>;
