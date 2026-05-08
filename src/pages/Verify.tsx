import { Stack, Typography } from '@mui/material';

export function Verify() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Verify</Typography>
      <Typography color="text.secondary">
        Drag a manifest file in. The browser computes sha256 client-side and
        looks the digest up in cartorio &mdash; nothing leaves your machine.
      </Typography>
      <Typography color="warning.main">
        Phase 3 stub — replaced with file-drop + crypto.subtle.digest +
        useArtifactByDigest match badge.
      </Typography>
    </Stack>
  );
}
