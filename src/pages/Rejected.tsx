import { useArtifacts, useRejections } from '@/entities/artifact';
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

const KIND_COLOR: Record<string, 'primary' | 'secondary' | 'warning' | 'default'> = {
  'oci-image': 'primary',
  'helm-chart': 'secondary',
  bundle: 'warning',
  skill: 'default',
};

// Truncated-digest column width — tuned to fit on a typical desktop
// breakpoint without wrapping. Same value used in the slice + the
// length check below.
const DIGEST_DISPLAY_LEN = 24;

// Map a cartorio rejection message to a one-line "why blocked" badge.
// Substring-matched against cartorio's free-text ApiError.message.
// cartorio v0.7+ will surface a structured `reason_code` on the
// rejection record; this function is the bridge until then.
function reasonBadge(message: string): { label: string; color: 'error' | 'warning' } {
  if (message.includes('recomposed') || message.includes('signed_root.root')) {
    return { label: 'state-leaf-mismatch', color: 'error' };
  }
  if (message.includes('signature')) {
    return { label: 'signature-rejected', color: 'error' };
  }
  if (message.includes('result_hash')) {
    return { label: 'compliance-attestation-mismatch', color: 'error' };
  }
  if (message.includes('clock skew')) {
    return { label: 'clock-skew', color: 'warning' };
  }
  if (message.includes('already admitted')) {
    return { label: 'duplicate-digest', color: 'warning' };
  }
  return { label: 'rejected', color: 'error' };
}

function truncateDigest(d: string | null): string {
  if (!d) return '—';
  return d.length > DIGEST_DISPLAY_LEN ? `${d.slice(0, DIGEST_DISPLAY_LEN)}…` : d;
}

export function Rejected() {
  const rejections = useRejections();
  const artifacts = useArtifacts();

  const admittedCount = artifacts.data?.total ?? 0;
  const rejectedCount = rejections.data?.total ?? 0;

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Rejected admissions
        </Typography>
        <Typography color="text.secondary">
          Cartorio refused these admit requests at the gate. The merkle ledger remains untouched —
          tamper attempts are visible but never recorded as admissions.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Box>
            <Typography variant="h3" color="success.main">
              ✓ {admittedCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              admitted
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" color="error.main">
              ✗ {rejectedCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              rejected (tamper-evident)
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            log capacity {rejections.data?.capacity ?? '—'}
          </Typography>
        </Stack>
      </Paper>

      {rejections.error ? (
        <Alert severity="error">{(rejections.error as Error).message}</Alert>
      ) : null}

      {rejections.isLoading ? (
        <Alert severity="info">loading…</Alert>
      ) : rejectedCount === 0 ? (
        <Alert severity="success">
          No rejected admissions in the log. The cartorio admission gate hasn't turned away any
          attempts since the last restart.
        </Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined" data-tour="rejected-table">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Kind</TableCell>
                <TableCell>Attempted name</TableCell>
                <TableCell>Attempted digest</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Recorded at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejections.data?.rejections.map((r) => {
                const reason = reasonBadge(r.message);
                return (
                  <TableRow
                    key={`${r.recorded_at}-${r.attempted_digest ?? ''}`}
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Chip
                        label={r.kind ?? 'unknown'}
                        color={KIND_COLOR[r.kind ?? ''] ?? 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{r.attempted_name ?? '—'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {truncateDigest(r.attempted_digest)}
                    </TableCell>
                    <TableCell>
                      <Chip label={r.status} color="error" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={reason.label}
                        color={reason.color}
                        size="small"
                        sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {new Date(r.recorded_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
