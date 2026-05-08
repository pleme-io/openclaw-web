import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useArtifact } from '@/entities/artifact';
import { ProofChip } from '@/widgets/ProofChip';

export interface ArtifactDetailProps {
  id: string;
}

export function ArtifactDetail({ id }: ArtifactDetailProps) {
  const { data, isLoading, error } = useArtifact(id);

  if (isLoading) return <Typography color="text.secondary">Loading…</Typography>;
  if (error) return <Alert severity="error">{(error as Error).message}</Alert>;
  if (!data) return null;

  const c = data.attestation.compliance;
  const s = data.attestation.source;
  const b = data.attestation.build;
  const i = data.attestation.image;

  return (
    <Stack spacing={2}>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <Chip size="small" label={data.kind} color="primary" />
          <Chip
            size="small"
            label={data.status}
            color={data.status === 'active' ? 'success' : 'default'}
          />
        </Stack>
        <Typography variant="h4">
          {data.name}@{data.version}
        </Typography>
        <Typography color="text.secondary" mt={0.5}>
          published by {data.publisher_id} (org {data.org})
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Receipt
          </Typography>
          <Stack spacing={1.5} mt={1}>
            <Row label="digest" value={data.digest} />
            <Row label="composed_root" value={data.composed_root} />
            <Row label="signed_root" value={data.signed_root.root} />
            <Stack direction="row" justifyContent="space-between">
              <Typography>signature algorithm</Typography>
              <Typography fontFamily="monospace" variant="body2">
                {data.signed_root.algorithm}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>signer</Typography>
              <Typography fontFamily="monospace" variant="body2">
                {data.signed_root.signer_id}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {c ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Compliance proof
            </Typography>
            <Stack spacing={1.5} mt={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>framework / baseline</Typography>
                <Typography fontFamily="monospace" variant="body2">
                  {c.framework} / {c.baseline}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>profile</Typography>
                <Typography fontFamily="monospace" variant="body2">
                  {c.profile}
                </Typography>
              </Stack>
              <Row label="result_hash" value={c.result_hash} />
              <Stack direction="row" justifyContent="space-between">
                <Typography>status</Typography>
                <Chip
                  size="small"
                  label={c.status}
                  color={c.status === 'compliant' ? 'success' : 'error'}
                />
              </Stack>
              <Divider />
              <Typography variant="caption" color="text.secondary">
                Anyone with the public manifest bytes + the public{' '}
                <code>provas</code> pack code can re-derive <code>result_hash</code>{' '}
                and confirm it matches what cartorio holds. That's the
                transferable receipt.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {s || b || i ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Attestation pillars
            </Typography>
            <Stack spacing={2} mt={1} divider={<Divider flexItem />}>
              {s ? (
                <Stack spacing={1}>
                  <Typography fontWeight={600}>source</Typography>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>git_commit</Typography>
                    <Typography fontFamily="monospace" variant="body2">
                      {s.git_commit}
                    </Typography>
                  </Stack>
                  <Row label="tree_hash" value={s.tree_hash} />
                  <Row label="flake_lock_hash" value={s.flake_lock_hash} />
                </Stack>
              ) : null}
              {b ? (
                <Stack spacing={1}>
                  <Typography fontWeight={600}>build</Typography>
                  <Row label="closure_hash" value={b.closure_hash} />
                  <Row label="sbom_hash" value={b.sbom_hash} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>SLSA level</Typography>
                    <Typography fontFamily="monospace" variant="body2">
                      {b.slsa_level}
                    </Typography>
                  </Stack>
                </Stack>
              ) : null}
              {i ? (
                <Stack spacing={1}>
                  <Typography fontWeight={600}>image</Typography>
                  <Row label="oci_digest" value={i.oci_digest} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>cosign signature</Typography>
                    <Typography fontFamily="monospace" variant="body2">
                      {i.cosign_signature_ref}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>SLSA provenance</Typography>
                    <Typography fontFamily="monospace" variant="body2">
                      {i.slsa_provenance_ref}
                    </Typography>
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography>{label}</Typography>
      <ProofChip value={value} />
    </Stack>
  );
}
