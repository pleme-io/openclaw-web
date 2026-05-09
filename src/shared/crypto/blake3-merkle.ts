import type { InclusionProof } from '@/entities/artifact/model';
/**
 * In-browser BLAKE3 inclusion-proof verifier.
 *
 * Re-implements cartorio's `verify_inclusion_proof` (Rust) in TypeScript
 * so the SPA can verify locally — no trust in the registry's "this is in
 * the ledger" claim. This is the constructive-proof philosophy made
 * concrete: pin a root, fetch a proof, walk the path up, compare.
 *
 * Pair-hash semantics MUST match `tameshi::hash::Blake3Hash::combine`:
 * `parent = blake3(left.bytes || right.bytes)` where each side is 32 raw
 * bytes (NOT hex). The proof's `side` says where the sibling sits
 * relative to the running cursor.
 */
import { blake3 } from '@noble/hashes/blake3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export interface ProofVerification {
  ok: boolean;
  computedRoot: string;
  expectedRoot: string;
  steps: number;
  durationMicros: number;
}

/**
 * Verify that `proof` chains from its leaf up to `expectedRoot`.
 *
 * - Returns `{ ok: true, ... }` when the BLAKE3 path-up matches.
 * - Returns `{ ok: false, ... }` when the root differs (tampered or stale).
 *
 * Pure function: no I/O, no allocation past the proof length, no async.
 * Cost: O(log N) BLAKE3 pair-hashes; sub-millisecond at typical N.
 */
export function verifyInclusionProof(
  proof: InclusionProof,
  expectedRoot: string,
): ProofVerification {
  const start = performance.now();
  let cursor = hexToBytes(proof.leaf);
  for (const step of proof.steps) {
    const sibling = hexToBytes(step.sibling);
    cursor = step.side === 'left' ? combine(sibling, cursor) : combine(cursor, sibling);
  }
  const computedRoot = bytesToHex(cursor);
  return {
    ok: computedRoot === expectedRoot,
    computedRoot,
    expectedRoot,
    steps: proof.steps.length,
    durationMicros: Math.round((performance.now() - start) * 1000),
  };
}

function combine(left: Uint8Array, right: Uint8Array): Uint8Array {
  const buf = new Uint8Array(left.length + right.length);
  buf.set(left, 0);
  buf.set(right, left.length);
  return blake3(buf);
}
