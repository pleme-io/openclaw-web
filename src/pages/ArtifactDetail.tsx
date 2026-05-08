import { Stack, Typography } from '@mui/material';

export interface ArtifactDetailProps {
  id: string;
}

export function ArtifactDetail({ id }: ArtifactDetailProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Artifact</Typography>
      <Typography color="text.secondary">Receipt for {id}</Typography>
      <Typography color="warning.main">
        Phase 3 stub — replaced with full receipt layout + bundle expansion tree.
      </Typography>
    </Stack>
  );
}
