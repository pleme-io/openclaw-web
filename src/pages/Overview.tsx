import { useAuditConsistency, useMerkleRoot } from '@/entities/artifact';
import { ProofChip } from '@/widgets/ProofChip';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Alert, Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

export function Overview() {
  const { data: root, isLoading: rootLoading, error: rootErr } = useMerkleRoot();
  const { data: audit } = useAuditConsistency();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          A notebook that proves what was running, when it was last checked, and that nobody quietly
          edited the record.
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760, mb: 1 }}>
          When something on your network gets compromised, regulators want to know — within hours —
          which version of which software was running, when you last verified it was safe, and where
          its parts came from. This system records every compliance check so those questions answer
          themselves, instantly and verifiably. Built for the incident-response timescales coming
          with <strong>CIRCIA</strong> (the Cyber Incident Reporting for Critical Infrastructure Act
          of 2022; CISA&apos;s final rule expected May 2026).
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
          The <strong>system</strong> shown here is the notebook keeper and its supporting tools
          (cartorio + provas + tabeliao + lacre). The <strong>artifact</strong> being proven
          compliant — the <strong>openclaw</strong> agent image and its helm-expressed architecture
          — is just the demonstration target. The same proof chain works for anything identified by
          its bytes.
        </Typography>
      </Box>

      {rootErr ? (
        <Alert severity="error">Could not reach cartorio: {(rootErr as Error).message}</Alert>
      ) : null}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" data-tour="ledger-root">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Merkle ledger
              </Typography>
              {rootLoading || !root ? (
                <Typography color="text.secondary">Loading…</Typography>
              ) : (
                <Stack spacing={1.5} mt={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>artifacts</Typography>
                    <Typography fontWeight={700}>{root.artifact_count}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>events</Typography>
                    <Typography fontWeight={700}>{root.event_count}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>state_root</Typography>
                    <ProofChip value={root.state_root} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>event_root</Typography>
                    <ProofChip value={root.event_root} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>ledger_root</Typography>
                    <ProofChip value={root.ledger_root} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    computed at {new Date(root.computed_at).toLocaleString()}
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" data-tour="audit">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Audit consistency
              </Typography>
              {audit ? (
                <Stack spacing={1} mt={1}>
                  <Chip
                    icon={<HealthAndSafetyIcon />}
                    color={audit.healthy ? 'success' : 'error'}
                    label={audit.healthy ? 'healthy' : 'divergence detected'}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Typography variant="body2">
                    Re-folded {audit.events_replayed} events; checked {audit.artifacts_checked}{' '}
                    artifacts; {audit.divergences.length} divergences.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    last check {new Date(audit.checked_at).toLocaleString()}
                  </Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary">Loading…</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
