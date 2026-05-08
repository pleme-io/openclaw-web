/**
 * Typed cartorio HTTP client.
 *
 * No SDK; cartorio's REST surface is small enough that a typed
 * `fetch` wrapper + per-endpoint zod parse is the substrate-canonical
 * minimum. Replace with `forge-gen` output once that pipeline
 * targets cartorio's OpenAPI spec.
 */
import type { z } from 'zod';
import { runtimeConfig } from '@/shared/config';

export class CartorioError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = 'CartorioError';
  }
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const url = `${runtimeConfig.cartorioUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new CartorioError(`cartorio ${res.status} on ${path}`, res.status, path);
  }
  const json = (await res.json()) as unknown;
  return schema.parse(json);
}

import {
  ArtifactSchema,
  ArtifactsResponseSchema,
  AuditConsistencyResponseSchema,
  MerkleRootSchema,
  RejectionsResponseSchema,
  type Artifact,
  type ArtifactsResponse,
  type AuditConsistencyResponse,
  type MerkleRoot,
  type RejectionsResponse,
} from '@/entities/artifact/model';

export const cartorio = {
  merkleRoot: (): Promise<MerkleRoot> => request('/api/v1/merkle/root', MerkleRootSchema),

  artifacts: (): Promise<ArtifactsResponse> =>
    request('/api/v1/artifacts', ArtifactsResponseSchema),

  artifactById: (id: string): Promise<Artifact> =>
    request(`/api/v1/artifacts/${encodeURIComponent(id)}`, ArtifactSchema),

  artifactByDigest: (digest: string): Promise<Artifact> =>
    request(`/api/v1/artifacts/by-digest/${encodeURIComponent(digest)}`, ArtifactSchema),

  auditConsistency: (): Promise<AuditConsistencyResponse> =>
    request('/api/v1/admin/audit-consistency', AuditConsistencyResponseSchema, {
      method: 'POST',
    }),

  rejections: (): Promise<RejectionsResponse> =>
    request('/api/v1/admin/rejections', RejectionsResponseSchema),
};
