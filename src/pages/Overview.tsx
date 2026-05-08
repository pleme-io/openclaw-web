import { Stack, Typography } from '@mui/material';

export function Overview() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Overview</Typography>
      <Typography color="text.secondary">
        Cartorio merkle root, audit-consistency, and totals.
      </Typography>
      <Typography color="warning.main">
        Phase 3 stub — replaced by MerkleSummaryCard + audit badge.
      </Typography>
    </Stack>
  );
}
