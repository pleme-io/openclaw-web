import { Stack, Typography } from '@mui/material';

export function Artifacts() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Artifacts</Typography>
      <Typography color="text.secondary">
        Every admitted artifact with its (digest, profile, result_hash) triple.
      </Typography>
      <Typography color="warning.main">
        Phase 3 stub — replaced by an MUI DataGrid backed by useArtifacts().
      </Typography>
    </Stack>
  );
}
