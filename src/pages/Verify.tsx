import { useCallback, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useArtifactByDigest } from '@/entities/artifact';
import { ProofChip } from '@/widgets/ProofChip';

export function Verify() {
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [digest, setDigest] = useState<string | null>(null);
  const [hashing, setHashing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setHashing(true);
    setFilename(file.name);
    const buf = await file.arrayBuffer();
    const u8 = new Uint8Array(buf);
    setBytes(u8);
    const h = await crypto.subtle.digest('SHA-256', buf);
    const hex = Array.from(new Uint8Array(h))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setDigest(`sha256:${hex}`);
    setHashing(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) void handleFile(f);
    },
    [handleFile],
  );

  const { data: hit, isLoading: looking, error } = useArtifactByDigest(digest ?? undefined);
  const found = !!hit;
  const notFound = !!error;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Verify
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
          Drag a manifest file in. Your browser computes <code>sha256(bytes)</code>{' '}
          locally — no upload — and looks the digest up in cartorio. If the
          digest is in the ledger, you see the receipt; otherwise cartorio
          returns 404 and we show the mismatch.
        </Typography>
      </Box>

      <Card
        variant="outlined"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          borderStyle: 'dashed',
          borderWidth: 2,
          py: 4,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <UploadFileIcon fontSize="large" color="action" />
            <Typography variant="h6">Drop a manifest here</Typography>
            <Typography color="text.secondary">
              {filename ? `Loaded: ${filename}` : 'Or click to pick a file'}
            </Typography>
            <Button variant="outlined" component="label">
              Choose file
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {hashing ? <Alert severity="info">Hashing…</Alert> : null}

      {digest ? (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>file</Typography>
                <Typography fontFamily="monospace" variant="body2">
                  {filename} ({bytes?.length ?? 0} bytes)
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>browser-derived digest</Typography>
                <ProofChip value={digest} />
              </Stack>
              {looking ? (
                <Chip label="Looking up in cartorio…" />
              ) : found ? (
                <Stack spacing={1}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="match — admitted in cartorio"
                    color="success"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>name@version</Typography>
                    <Typography fontFamily="monospace">
                      {hit?.name}@{hit?.version}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>profile</Typography>
                    <Typography fontFamily="monospace">
                      {hit?.attestation.compliance?.profile ?? '—'}
                    </Typography>
                  </Stack>
                  {hit?.attestation.compliance?.result_hash ? (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography>result_hash</Typography>
                      <ProofChip value={hit.attestation.compliance.result_hash} />
                    </Stack>
                  ) : null}
                </Stack>
              ) : notFound ? (
                <Chip
                  icon={<ErrorIcon />}
                  label="not in ledger — digest unknown to cartorio"
                  color="error"
                  sx={{ alignSelf: 'flex-start' }}
                />
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
