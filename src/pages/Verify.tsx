import { useArtifactByDigest, useArtifactProof, useMerkleRoot } from '@/entities/artifact';
import { verifyInclusionProof } from '@/shared/crypto/blake3-merkle';
import { ProofChip } from '@/widgets/ProofChip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';

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

  // Stage 2 — once we have a hit, fetch the inclusion proof + the
  // current merkle root and verify locally in the browser. This is what
  // "constructive proof" means in practice: we don't trust cartorio's
  // claim that the artifact is in the ledger; we recompute the BLAKE3
  // path-up ourselves and compare.
  const { data: proof, isLoading: loadingProof } = useArtifactProof(hit?.id);
  const { data: root } = useMerkleRoot();

  const localVerify = proof ? verifyInclusionProof(proof.proof, proof.root) : null;
  const rootDrift = !!proof && !!root && proof.root !== root.state_root;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Verify
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          Drag a manifest in. Your browser computes <code>sha256(bytes)</code> locally — no upload —
          looks up the digest in cartorio, fetches the merkle inclusion proof, and{' '}
          <strong>verifies the proof in your browser</strong> with BLAKE3. The last step is the
          &ldquo;constructive&rdquo; part: we don&apos;t trust cartorio&apos;s claim &mdash; we
          recompute the path-up and compare to the pinned root ourselves.
        </Typography>
      </Box>

      <Card
        variant="outlined"
        data-tour="verify-drop"
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
                    label="step 1 ✓ digest in cartorio's ledger"
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

      {found ? (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <VerifiedIcon color="primary" />
                <Typography variant="h6">
                  Step 2 — inclusion proof, verified in your browser
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Your browser fetches the artifact&apos;s inclusion proof, walks the BLAKE3 path-up
                locally, and compares to cartorio&apos;s current state-root. If anyone tampered with
                the leaf, the proof, or the registry, the verdict here is &ldquo;does not
                verify.&rdquo;
              </Typography>
              <Divider sx={{ my: 1 }} />
              {loadingProof || !proof ? (
                <Chip label="fetching proof…" />
              ) : !localVerify ? null : (
                <Stack spacing={1}>
                  <Chip
                    icon={localVerify.ok ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={
                      localVerify.ok
                        ? `step 2 ✓ proof verified locally in ${localVerify.durationMicros} µs`
                        : 'step 2 ✗ proof did not verify — registry tampered or proof stale'
                    }
                    color={localVerify.ok ? 'success' : 'error'}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>steps walked</Typography>
                    <Typography fontFamily="monospace">{localVerify.steps}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>tree size</Typography>
                    <Typography fontFamily="monospace">{proof.proof.tree_size}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>computed root</Typography>
                    <ProofChip value={localVerify.computedRoot} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>expected (proof) root</Typography>
                    <ProofChip value={localVerify.expectedRoot} />
                  </Stack>
                  {root ? (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography>current state_root</Typography>
                      <ProofChip value={root.state_root} />
                    </Stack>
                  ) : null}
                  {rootDrift ? (
                    <Alert severity="warning">
                      The registry&apos;s current state_root has advanced past the root this proof
                      verifies against. Re-pin and refetch if you need a current proof.
                    </Alert>
                  ) : null}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
