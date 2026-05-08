/**
 * TanStack Query hooks over cartorio's REST surface.
 *
 * staleTime defaults are short (30s) so the demo feels live; cartorio
 * never returns rapidly-changing data so the network cost is fine.
 */
import { useQuery } from '@tanstack/react-query';
import { cartorio } from '@/shared/api/cartorio';

export const queryKeys = {
  merkleRoot: ['cartorio', 'merkle', 'root'] as const,
  artifacts: ['cartorio', 'artifacts'] as const,
  artifact: (id: string) => ['cartorio', 'artifact', id] as const,
  artifactByDigest: (digest: string) => ['cartorio', 'artifact-by-digest', digest] as const,
  auditConsistency: ['cartorio', 'audit-consistency'] as const,
};

export const useMerkleRoot = () =>
  useQuery({
    queryKey: queryKeys.merkleRoot,
    queryFn: cartorio.merkleRoot,
    refetchInterval: 30_000,
  });

export const useArtifacts = () =>
  useQuery({
    queryKey: queryKeys.artifacts,
    queryFn: cartorio.artifacts,
    refetchInterval: 30_000,
  });

export const useArtifact = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.artifact(id ?? ''),
    queryFn: () => cartorio.artifactById(id as string),
    enabled: !!id,
  });

export const useArtifactByDigest = (digest: string | undefined) =>
  useQuery({
    queryKey: queryKeys.artifactByDigest(digest ?? ''),
    // cartorio returns 404 if not present; React Query reports as error.
    queryFn: () => cartorio.artifactByDigest(digest as string),
    enabled: !!digest,
    retry: false,
  });

export const useAuditConsistency = () =>
  useQuery({
    queryKey: queryKeys.auditConsistency,
    queryFn: cartorio.auditConsistency,
    refetchInterval: 60_000,
  });
