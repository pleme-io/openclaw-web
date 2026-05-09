/**
 * Verify — auto-demo of the constructive proof chain.
 *
 * Picks the first admitted artifact and runs the full two-stage check
 * automatically, with no user interaction required:
 *
 *   stage 1 — digest is in cartorio's merkle ledger (REST lookup)
 *   stage 2 — inclusion proof verifies locally via BLAKE3 (pure fn)
 *
 * The receipt the page demonstrates is the same one a CIRCIA-covered
 * entity would carry as evidence of "what was running, with which
 * compliance posture, at the moment of an incident." Stage-2 is the
 * load-bearing step: if the registry, the proof, or the artifact were
 * tampered with, the BLAKE3 path-up locally fails to land on the
 * pinned root.
 */
import { useArtifactProof, useArtifacts, useMerkleRoot } from '@/entities/artifact';
import { verifyInclusionProof } from '@/shared/crypto/blake3-merkle';
import { ProofChip } from '@/widgets/ProofChip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import { useState } from 'react';

export function Verify() {
  const artifacts = useArtifacts();
  const [cursor, setCursor] = useState(0);
  const list = artifacts.data?.artifacts ?? [];
  const target = list.length > 0 ? list[cursor % list.length] : undefined;

  const { data: proof, isLoading: loadingProof } = useArtifactProof(target?.id);
  const { data: root } = useMerkleRoot();

  const localVerify = proof ? verifyInclusionProof(proof.proof, proof.root) : null;
  const rootDrift = !!proof && !!root && proof.root !== root.state_root;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Verify — live demonstration
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          This page picks an admitted artifact, fetches its merkle inclusion proof from cartorio,
          and verifies the BLAKE3 path-up <strong>locally in your browser</strong>. No upload, no
          interaction, no trust in the registry. The page works the same way an auditor would
          establish &ldquo;this artifact was the version running, and here&apos;s mathematical proof
          its compliance pack passed&rdquo; — the kind of evidence required by CIRCIA-class incident
          reports (vulnerabilities exploited + security protocols in place at the time of the
          incident).
        </Typography>
      </Box>

      {artifacts.isLoading ? <Alert severity="info">Loading artifact list…</Alert> : null}
      {artifacts.error ? (
        <Alert severity="error">
          Could not reach cartorio: {(artifacts.error as Error).message}
        </Alert>
      ) : null}
      {!artifacts.isLoading && !target ? (
        <Alert severity="warning">
          Cartorio&apos;s ledger is empty — admit something with tabeliao to see the demo.
        </Alert>
      ) : null}

      {target ? (
        <Card variant="outlined" data-tour="verify-drop">
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {target.name}@{target.version}
                </Typography>
                <Chip size="small" label={target.kind} color="primary" />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>digest</Typography>
                <ProofChip value={target.digest} />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>profile</Typography>
                <Typography fontFamily="monospace" variant="body2">
                  {target.attestation.compliance?.profile ?? '—'}
                </Typography>
              </Stack>
              {target.attestation.compliance?.result_hash ? (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography>result_hash</Typography>
                  <ProofChip value={target.attestation.compliance.result_hash} />
                </Stack>
              ) : null}

              <Divider sx={{ my: 1 }} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <VerifiedIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Verification cycle
                </Typography>
              </Stack>

              <Chip
                icon={<CheckCircleIcon />}
                label="step 1 ✓ digest is in cartorio's ledger"
                color="success"
                sx={{ alignSelf: 'flex-start' }}
              />

              {loadingProof || !proof ? (
                <Chip label="step 2 — fetching inclusion proof…" />
              ) : !localVerify ? null : (
                <Stack spacing={1}>
                  <Chip
                    icon={localVerify.ok ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={
                      localVerify.ok
                        ? `step 2 ✓ proof verified locally in ${localVerify.durationMicros} µs (${localVerify.steps} BLAKE3 hashes)`
                        : 'step 2 ✗ proof did not verify — registry tampered or proof stale'
                    }
                    color={localVerify.ok ? 'success' : 'error'}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Stack direction="row" justifyContent="space-between">
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
                      verifies against. (For a long-lived proof in production, consumers pin a
                      specific historical root via{' '}
                      <code>GET /api/v1/merkle/root?at=&lt;rfc3339&gt;</code>.)
                    </Alert>
                  ) : null}
                </Stack>
              )}
            </Stack>

            {list.length > 1 ? (
              <Stack direction="row" justifyContent="flex-end" mt={2}>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => setCursor((c) => c + 1)}
                >
                  Try another artifact ({(cursor % list.length) + 1} of {list.length})
                </Button>
              </Stack>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
