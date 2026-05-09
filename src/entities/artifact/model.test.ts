import { describe, expect, it } from 'vitest';
import { ArtifactSchema, MerkleRootSchema } from './model';

const REAL_ARTIFACT = {
  id: 'art-000000000000000018ad76998fdeb2d0-0000000000000000',
  kind: 'oci-image',
  name: 'alpine',
  version: '3.22.4',
  publisher_id: 'drzzln@protonmail.com',
  org: 'pleme-io',
  digest: 'sha256:f9b9f80a9486d6d3a6018ac615878b82fbcce7872dcadf38bf648e222920d822',
  attestation: {
    source: {
      git_commit: 'ce1b9f141bbd2d604064cae6a3f5309b4a2a40b9',
      tree_hash: '11111111111111111111111111111111111111111111111111111111111111aa',
      flake_lock_hash: '22222222222222222222222222222222222222222222222222222222222222bb',
    },
    build: {
      closure_hash: '33333333333333333333333333333333333333333333333333333333333333cc',
      sbom_hash: '44444444444444444444444444444444444444444444444444444444444444dd',
      slsa_level: 3,
    },
    image: {
      oci_digest: 'sha256:f9b9f80a9486d6d3a6018ac615878b82fbcce7872dcadf38bf648e222920d822',
      cosign_signature_ref: 'docker.io/library/alpine:3.22:sig',
      slsa_provenance_ref: 'docker.io/library/alpine:3.22@sha256:slsaref',
    },
    compliance: {
      framework: 'FedRAMP',
      baseline: 'high',
      profile: 'fedramp-high-openclaw-image@1',
      result_hash: '1de662ead313f454f400e5ac881764e06d0f6d1da573f0136d259baf0b1b0449',
      status: 'compliant',
    },
  },
  status: 'active',
  last_modified_at: '2026-05-08T02:37:09.786962Z',
  composed_root: '69949db523fed9077fb9ef0710a47783e675d534c284bcca6549a1d8de8d9d12',
  signed_root: {
    root: '69949db523fed9077fb9ef0710a47783e675d534c284bcca6549a1d8de8d9d12',
    signature: '3ea409d131cfd07297f6675ee5963353981490116ac80a57cf6ac311db7d4bd0',
    algorithm: 'blake3_keyed_hmac',
    signer_id: 'publisher:drzzln@protonmail.com',
    signed_at: '2026-05-08T02:37:09.786962Z',
  },
  admitted_at: '2026-05-08T02:37:09.786962Z',
};

describe('cartorio wire format', () => {
  it('parses a real ArtifactState response', () => {
    const parsed = ArtifactSchema.parse(REAL_ARTIFACT);
    expect(parsed.kind).toBe('oci-image');
    expect(parsed.attestation.compliance?.profile).toBe('fedramp-high-openclaw-image@1');
  });

  it('parses a merkle root response', () => {
    const parsed = MerkleRootSchema.parse({
      state_root: 'a'.repeat(64),
      event_root: 'b'.repeat(64),
      ledger_root: 'c'.repeat(64),
      artifact_count: 7,
      event_count: 9,
      computed_at: '2026-05-08T03:00:00Z',
    });
    expect(parsed.artifact_count).toBe(7);
  });

  it('rejects unknown artifact kinds', () => {
    expect(() => ArtifactSchema.parse({ ...REAL_ARTIFACT, kind: 'mystery' })).toThrow();
  });
});
