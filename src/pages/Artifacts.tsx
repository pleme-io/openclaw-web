import {
  Alert,
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useArtifacts } from '@/entities/artifact';
import { ProofChip } from '@/widgets/ProofChip';

const KIND_COLOR: Record<string, 'primary' | 'secondary' | 'warning' | 'default'> = {
  'oci-image': 'primary',
  'helm-chart': 'secondary',
  bundle: 'warning',
  skill: 'default',
};

export function Artifacts() {
  const { data, isLoading, error } = useArtifacts();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Admitted artifacts
        </Typography>
        <Typography color="text.secondary">
          Each row is a row in cartorio's merkle tree. Click an entry to see the
          full receipt.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{(error as Error).message}</Alert> : null}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kind</TableCell>
              <TableCell>Name@Version</TableCell>
              <TableCell>Digest</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Result hash</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading || !data ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">Loading…</Typography>
                </TableCell>
              </TableRow>
            ) : data.artifacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">
                    Ledger is empty — admit something with tabeliao.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.artifacts.map((a) => (
                <TableRow
                  key={a.id}
                  hover
                  onClick={() => void navigate({ to: '/artifacts/$id', params: { id: a.id } })}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Chip
                      size="small"
                      label={a.kind}
                      color={KIND_COLOR[a.kind] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {a.name}@{a.version}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ProofChip value={a.digest} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {a.attestation.compliance?.profile ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {a.attestation.compliance?.result_hash ? (
                      <ProofChip value={a.attestation.compliance.result_hash} />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={a.status}
                      color={a.status === 'active' ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
