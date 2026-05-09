import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BlockIcon from '@mui/icons-material/Block';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import HubIcon from '@mui/icons-material/Hub';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
import { Link } from '@tanstack/react-router';

interface SectionProps {
  n: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ n, icon, title, children }: SectionProps) {
  return (
    <Card variant="outlined" id={`s${n}`}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '1rem' }}>
            {n}
          </Avatar>
          {icon}
          <Typography variant="h5" component="h2" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function ELI5({ children }: { children: React.ReactNode }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        my: 2,
        bgcolor: 'warning.50',
        borderColor: 'warning.light',
        borderLeftWidth: 4,
        borderLeftColor: 'warning.main',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <LightbulbIcon sx={{ color: 'warning.dark', mt: 0.3 }} />
        <Box>
          <Typography variant="overline" color="warning.dark" sx={{ fontWeight: 700 }}>
            ELI5
          </Typography>
          <Typography sx={{ mt: 0.5 }}>{children}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function Diagram({ children }: { children: string }) {
  return (
    <Box
      component="pre"
      sx={{
        fontFamily: 'monospace',
        fontSize: '0.78rem',
        lineHeight: 1.45,
        bgcolor: 'grey.100',
        color: 'text.primary',
        p: 2,
        borderRadius: 1,
        overflow: 'auto',
        my: 2,
      }}
    >
      {children}
    </Box>
  );
}

interface DeeperProps {
  title: string;
  children: React.ReactNode;
}

function Deeper({ title, children }: DeeperProps) {
  return (
    <Accordion variant="outlined" disableGutters sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="dive deeper" size="small" color="primary" variant="outlined" />
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <Typography sx={{ mb: 2 }}>{children}</Typography>;
}

function MerkleSvg() {
  // Tiny pedagogical merkle tree: 4 leaves → 2 inner nodes → 1 root.
  // Same shape as cartorio's state tree (binary, BLAKE3-pair-hashed,
  // odd-leaf-out promoted unchanged — not shown here for clarity).
  const leafFill = '#bbdefb';
  const innerFill = '#42a5f5';
  const rootFill = '#1565c0';
  const stroke = '#90a4ae';
  return (
    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
      <Box component="svg" viewBox="0 0 380 220" sx={{ width: '100%', maxWidth: 480 }}>
        <title>Merkle tree with 4 leaves</title>
        {/* connectors */}
        <line x1="190" y1="40" x2="105" y2="80" stroke={stroke} strokeWidth="1.5" />
        <line x1="190" y1="40" x2="275" y2="80" stroke={stroke} strokeWidth="1.5" />
        <line x1="105" y1="110" x2="50" y2="150" stroke={stroke} strokeWidth="1.5" />
        <line x1="105" y1="110" x2="160" y2="150" stroke={stroke} strokeWidth="1.5" />
        <line x1="275" y1="110" x2="220" y2="150" stroke={stroke} strokeWidth="1.5" />
        <line x1="275" y1="110" x2="330" y2="150" stroke={stroke} strokeWidth="1.5" />
        {/* root */}
        <rect x="160" y="10" width="60" height="32" rx="6" fill={rootFill} />
        <text x="190" y="31" textAnchor="middle" fontSize="13" fill="white" fontFamily="monospace">
          root
        </text>
        {/* level 1 (inner nodes) */}
        <rect x="75" y="80" width="60" height="32" rx="6" fill={innerFill} />
        <text x="105" y="101" textAnchor="middle" fontSize="13" fill="white" fontFamily="monospace">
          h(AB)
        </text>
        <rect x="245" y="80" width="60" height="32" rx="6" fill={innerFill} />
        <text x="275" y="101" textAnchor="middle" fontSize="13" fill="white" fontFamily="monospace">
          h(CD)
        </text>
        {/* leaves */}
        {[
          { x: 20, y: 150, label: 'h(A)' },
          { x: 130, y: 150, label: 'h(B)' },
          { x: 190, y: 150, label: 'h(C)' },
          { x: 300, y: 150, label: 'h(D)' },
        ].map((l) => (
          <g key={l.label}>
            <rect x={l.x} y={l.y} width="60" height="32" rx="6" fill={leafFill} />
            <text
              x={l.x + 30}
              y={l.y + 21}
              textAnchor="middle"
              fontSize="13"
              fill="#0d47a1"
              fontFamily="monospace"
            >
              {l.label}
            </text>
          </g>
        ))}
        {/* leaf labels */}
        {[
          { x: 50, y: 200, label: 'leaf A' },
          { x: 160, y: 200, label: 'leaf B' },
          { x: 220, y: 200, label: 'leaf C' },
          { x: 330, y: 200, label: 'leaf D' },
        ].map((l) => (
          <text key={l.label} x={l.x} y={l.y} textAnchor="middle" fontSize="11" fill="#546e7a">
            {l.label}
          </text>
        ))}
      </Box>
    </Box>
  );
}

function DualTreeSvg() {
  // Two trees converging into one ledger_root. Visual shorthand for
  // cartorio's state-tree (mutable, "what IS") + event-tree (append-
  // only, "what HAPPENED") shape.
  return (
    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
      <Box component="svg" viewBox="0 0 460 230" sx={{ width: '100%', maxWidth: 540 }}>
        <title>Dual-tree shape: state tree + event tree → ledger root</title>
        {/* state tree (left triangle) */}
        <polygon points="20,150 110,150 65,70" fill="#bbdefb" stroke="#1565c0" strokeWidth="1.5" />
        <text x="65" y="115" textAnchor="middle" fontSize="11" fill="#0d47a1">
          state
        </text>
        <text x="65" y="130" textAnchor="middle" fontSize="11" fill="#0d47a1">
          tree
        </text>
        <text x="65" y="60" textAnchor="middle" fontSize="11" fill="#0d47a1" fontWeight="700">
          state_root
        </text>
        {/* event tree (right triangle) */}
        <polygon
          points="180,150 270,150 225,70"
          fill="#c8e6c9"
          stroke="#2e7d32"
          strokeWidth="1.5"
        />
        <text x="225" y="115" textAnchor="middle" fontSize="11" fill="#1b5e20">
          event
        </text>
        <text x="225" y="130" textAnchor="middle" fontSize="11" fill="#1b5e20">
          tree
        </text>
        <text x="225" y="60" textAnchor="middle" fontSize="11" fill="#1b5e20" fontWeight="700">
          event_root
        </text>
        {/* converge arrows */}
        <line x1="65" y1="55" x2="350" y2="105" stroke="#666" strokeWidth="1.5" />
        <line x1="225" y1="55" x2="350" y2="105" stroke="#666" strokeWidth="1.5" />
        {/* ledger root */}
        <rect x="305" y="100" width="120" height="42" rx="8" fill="#6a1b9a" />
        <text
          x="365"
          y="120"
          textAnchor="middle"
          fontSize="13"
          fill="white"
          fontWeight="700"
          fontFamily="monospace"
        >
          ledger_root
        </text>
        <text
          x="365"
          y="135"
          textAnchor="middle"
          fontSize="10"
          fill="#e1bee7"
          fontFamily="monospace"
        >
          BLAKE3(state || event)
        </text>
        {/* leaf annotations */}
        <text x="65" y="170" textAnchor="middle" fontSize="11" fill="#37474f">
          one leaf per artifact
        </text>
        <text x="65" y="184" textAnchor="middle" fontSize="11" fill="#37474f">
          (mutable, gated)
        </text>
        <text x="225" y="170" textAnchor="middle" fontSize="11" fill="#37474f">
          one leaf per state change
        </text>
        <text x="225" y="184" textAnchor="middle" fontSize="11" fill="#37474f">
          (append-only)
        </text>
        <text x="365" y="170" textAnchor="middle" fontSize="11" fill="#37474f">
          this is what
        </text>
        <text x="365" y="184" textAnchor="middle" fontSize="11" fill="#37474f">
          consumers pin
        </text>
      </Box>
    </Box>
  );
}

const TOC: Array<{ n: number; title: string }> = [
  { n: 1, title: 'The receipt' },
  { n: 2, title: 'What a merkle tree is' },
  { n: 3, title: 'Cartorio’s dual-tree shape' },
  { n: 4, title: 'Modifier matrix' },
  { n: 5, title: 'Flow A — admit' },
  { n: 6, title: 'Flow B — verify offline' },
  { n: 7, title: 'Flow C — tamper rejection' },
  { n: 8, title: 'The four-repo chain' },
];

const MODIFIERS: Array<{
  modifier: string;
  transitions: string;
  rationale: string;
  color: 'primary' | 'error' | 'warning' | 'success';
}> = [
  {
    modifier: 'Publisher',
    transitions: 'Admit · Supersede',
    rationale: 'Owns the artifact: introduces it, replaces own versions.',
    color: 'primary',
  },
  {
    modifier: 'PKI',
    transitions: 'Revoke',
    rationale: 'Cascades a publisher cert revocation into the ledger.',
    color: 'error',
  },
  {
    modifier: 'Scanner',
    transitions: 'Quarantine · Reattest',
    rationale: 'Detects post-admit drift, or confirms continued validity.',
    color: 'warning',
  },
  {
    modifier: 'Operator',
    transitions: 'Reactivate',
    rationale: 'Restores a quarantined artifact — needs scanner cosignature.',
    color: 'success',
  },
];

const TAMPER_VECTORS: Array<{ vector: string; caught_by: string }> = [
  {
    vector: 'Manifest bytes change after publish',
    caught_by: 'sha256(bytes) → digest changes → cartorio has no record at the new digest',
  },
  {
    vector: 'Pack source code changes',
    caught_by: 'Same target produces a different pack_hash → recompute mismatch',
  },
  {
    vector: 'Attestation field flipped in storage',
    caught_by: 'state-leaf composed_root recompute differs → consistency check fails',
  },
  {
    vector: 'Signed root re-signed with a forged key',
    caught_by: 'Per-modifier-class Ed25519 allow-list rejects the signature',
  },
  {
    vector: 'Bundle member swapped',
    caught_by: 'Bundle’s evidence carries member digest:pack_hash → bundle pack_hash differs',
  },
  {
    vector: 'Tag-spoof at registry gate (push evil bytes claiming a known digest)',
    caught_by: 'lacre hashes the body, not the URL → 403',
  },
  {
    vector: 'Direct DB row mutation (bypassing the API)',
    caught_by: 'Periodic state-vs-events audit re-folds the event log → divergence alarm',
  },
];

const GLOSSARY: Array<{ term: string; def: string }> = [
  {
    term: 'BLAKE3',
    def: 'Modern cryptographic hash function. Fast, parallel, 256-bit output. Used everywhere in cartorio for content-addressing and pair-hashing tree levels.',
  },
  {
    term: 'composed_root',
    def: 'BLAKE3 over the canonical, domain-separated stream of an ArtifactState’s fields. Recomputed on every read; a mismatch = tamper.',
  },
  {
    term: 'digest',
    def: 'sha256(artifact bytes). The artifact’s content-address. Used by lacre + cartorio to identify "this exact byte sequence."',
  },
  {
    term: 'event_root',
    def: 'Merkle root over all LedgerEvents (admissions, revocations, etc.) — the “what HAPPENED” tree.',
  },
  {
    term: 'inclusion proof',
    def: 'O(log N) list of (sibling_hash, side) pairs that lets a verifier hash up from a leaf to a root, proving membership without scanning the tree.',
  },
  {
    term: 'ledger_root',
    def: 'BLAKE3(state_root || event_root). The single value consumers pin to compare future proofs against.',
  },
  {
    term: 'pack_hash',
    def: 'BLAKE3 over the deterministic test-outcome stream of running a provas pack against a target. Stored as `compliance.result_hash`.',
  },
  {
    term: 'profile',
    def: 'String of the form `<pack_id>@<pack_version>` — names which provas pack was run.',
  },
  {
    term: 'signed_root',
    def: 'A pair of (composed_root, Ed25519 signature). The publisher / PKI / scanner / operator signs the *recomposed* root, not free text.',
  },
  {
    term: 'state_root',
    def: 'Merkle root over current ArtifactStates — the “what IS” tree.',
  },
];

export function Explain() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          How the proof chain works
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          A guided tour through cartorio&apos;s merkle ledger — what the receipt looks like, why
          it&apos;s transferable, and how every flow that touches it stays tamper-evident. Each
          section opens with an <strong>ELI5</strong> framing; click <em>dive deeper</em> wherever
          you want the technical detail.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }} data-tour="explain-toc">
        <Typography variant="overline" color="text.secondary">
          Sections
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
          {TOC.map((t) => (
            <Chip
              key={t.n}
              label={`${t.n}. ${t.title}`}
              component="a"
              href={`#s${t.n}`}
              clickable
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      </Paper>

      {/* ─── 1. The receipt ────────────────────────────────────────── */}
      <Section
        n={1}
        icon={<VerifiedIcon color="primary" />}
        title="The receipt — three fields, no trust required"
      >
        <ELI5>
          Imagine handing someone a museum receipt. They don&apos;t trust the museum — they take a
          flashlight and the painting itself, do their own check, and confirm the receipt matches
          reality. Cartorio&apos;s receipt is just three fields, and anyone can do that same check.
        </ELI5>
        <Diagram>{`digest                              ─── sha256 of the artifact bytes
attestation.compliance.profile      ─── "<pack_id>@<pack_version>"
attestation.compliance.result_hash  ─── BLAKE3 over the deterministic
                                          test-outcome stream produced
                                          by running the named pack`}</Diagram>
        <P>
          To verify: fetch the bytes by digest, run the named pack, compare the computed pack_hash
          to the stored result_hash. Match → publisher actually ran those tests against those bytes.
          Differ → something has been tampered with. There is no third option.
        </P>
        <Deeper title="Why this beats trust-me attestations">
          <P>
            Every other compliance assertion in industry is signed: &ldquo;I ran tests, here is my
            signature.&rdquo; Verifying it requires trusting the signer. Cartorio&apos;s receipt is{' '}
            <strong>constructive</strong> — the verifier re-derives the result and concludes{' '}
            <em>identity</em>, not <em>authenticity</em>.
          </P>
          <P>
            Three properties follow:
            <ul>
              <li>
                <strong>Tamper-evident across all three legs.</strong> Change the artifact, the
                pack, or any individual test, and the recomputed hash differs. There is no way to
                forge &ldquo;tests ran&rdquo; without actually running them.
              </li>
              <li>
                <strong>Composable up the deployable hierarchy.</strong> A bundle artifact composes
                its members&apos; pack_hashes into a bundle pack_hash. Bundle proof inherits from
                member proofs.
              </li>
              <li>
                <strong>Gate-checkable in production.</strong> lacre, the OCI gate, queries cartorio
                by digest before forwarding a push. No proof on file → 403. The receipt is
                load-bearing, not advisory.
              </li>
            </ul>
          </P>
        </Deeper>
      </Section>

      {/* ─── 2. What a merkle tree is ──────────────────────────────── */}
      <Section
        n={2}
        icon={<AccountTreeIcon color="primary" />}
        title="What a merkle tree is — pairwise hashing, all the way up"
      >
        <ELI5>
          Picture a tournament bracket. Two players play, the winner moves up. A merkle tree does
          the same with hashes: two child hashes get BLAKE3-paired into a parent hash, and the
          &ldquo;champion&rdquo; at the very top is one hash that depends on every leaf below.
        </ELI5>
        <MerkleSvg />
        <P>
          <strong>Single rule</strong>: <code>parent = BLAKE3(left_bytes || right_bytes)</code>.
          Change any single bit in any leaf, and the root changes. The root is a mathematical
          fingerprint of the whole list.
        </P>
        <Deeper title="Inclusion proof — proving one leaf without scanning the rest">
          <P>
            To prove leaf B is in the tree, the prover hands over two hashes: <code>h(A)</code> and{' '}
            <code>h(CD)</code>. The verifier already has leaf B (so they compute <code>h(B)</code>{' '}
            themselves), then:
          </P>
          <Diagram>{`step 1:  parent_left = BLAKE3( h(A) || h(B) )    // = h(AB)
step 2:  root        = BLAKE3( h(AB) || h(CD) )  // expected
compare: root == pinned_root  →  proof verifies`}</Diagram>
          <P>
            That&apos;s O(log N) sibling hashes. Verification is a pure function — no I/O, no
            allocation past the proof length. At cartorio scale (≤ 10⁴ artifacts) it runs in
            microseconds.
          </P>
          <P>
            <strong>Try it:</strong> the{' '}
            <Button component={Link} to="/verify" size="small" variant="outlined">
              Verify
            </Button>{' '}
            tab does this in your browser — fetches a real proof from cartorio and walks the path up
            locally with BLAKE3.
          </P>
        </Deeper>
      </Section>

      {/* ─── 3. Cartorio's dual-tree shape ─────────────────────────── */}
      <Section
        n={3}
        icon={<HubIcon color="primary" />}
        title="Cartorio's dual-tree shape — what IS, plus what HAPPENED"
      >
        <ELI5>
          Two filing cabinets. The first has a clipboard listing{' '}
          <em>everyone currently in the building</em> (the state tree); the second has the
          time-ordered <em>guest log</em> with every entry and exit (the event tree). Combine the
          two cabinets&apos; fingerprints into one master fingerprint and you&apos;ve got
          cartorio&apos;s <code>ledger_root</code>.
        </ELI5>
        <DualTreeSvg />
        <P>
          Mutation IS allowed in the state tree (artifacts get revoked, quarantined, reactivated),
          but every mutation goes through the verification gate. A side-channel mutation that
          bypasses the gate fails the next consistency check because the state-leaf composed_root
          won&apos;t match the recomputed value.
        </P>
        <Deeper title="Why two trees, not one">
          <TableContainer component={Paper} variant="outlined" sx={{ my: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tree</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>What is the current state of artifact X?</TableCell>
                  <TableCell>state tree</TableCell>
                  <TableCell>O(log N)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>What happened to artifact X over time?</TableCell>
                  <TableCell>event tree (filtered by id)</TableCell>
                  <TableCell>O(log M) per event</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Did artifact X exist on date D?</TableCell>
                  <TableCell>event tree (with timestamp)</TableCell>
                  <TableCell>O(M) walk</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Is the registry tampered?</TableCell>
                  <TableCell>both — re-fold events into state, compare</TableCell>
                  <TableCell>O(N + M)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <P>
            The audit loop in section 7 (last row above) runs continuously in cartorio. Background
            task interval is 900s by default — see the Overview tab&apos;s &ldquo;Audit
            consistency&rdquo; card.
          </P>
        </Deeper>
      </Section>

      {/* ─── 4. Modifier matrix ────────────────────────────────────── */}
      <Section
        n={4}
        icon={<GavelIcon color="primary" />}
        title="Modifier matrix — who is allowed to do what"
      >
        <ELI5>
          Like a club&apos;s role list. The bouncer at each turnstile checks your card: a Publisher
          pass opens &ldquo;Admit&rdquo; and &ldquo;Supersede&rdquo; only — never
          &ldquo;Revoke.&rdquo; Even with a valid card, the wrong door doesn&apos;t open.
        </ELI5>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Modifier</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Allowed transitions</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rationale</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MODIFIERS.map((m) => (
                <TableRow key={m.modifier}>
                  <TableCell>
                    <Chip label={m.modifier} color={m.color} size="small" />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {m.transitions}
                  </TableCell>
                  <TableCell>{m.rationale}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Deeper title="Cryptographic hardening — Ed25519 allow-lists per class">
          <P>
            Beyond the role-table: each modifier class carries an Ed25519 public-key allow-list. The
            signed_root must verify against <em>at least one</em> key configured for that class.
          </P>
          <P>
            Empty allow-list = permissive (back-compat with v0.4.x); non-empty = strict
            cryptographic check. Keys come from the registry config; rotation is a config update,
            not a code change. This closed THREAT-MODEL G3 in v0.5.
          </P>
          <P>
            The 24-cell exhaustive test in <code>tests/authz_matrix.rs</code> covers every (modifier
            × transition) cell — the matrix above is literally the test matrix.
          </P>
        </Deeper>
      </Section>

      {/* ─── 5. Flow A — admit ─────────────────────────────────────── */}
      <Section
        n={5}
        icon={<UploadIcon color="primary" />}
        title="Flow A — admit (publisher → cartorio)"
      >
        <ELI5>
          Like passport control. The publisher hands over papers (a signed root plus the artifact
          bytes); cartorio re-derives every field and checks the seal. Stamp it in, OR refuse — and
          the refusal lands on the <strong>Rejected</strong> tab, never in the ledger.
        </ELI5>
        <Diagram>{`┌──────────────────┐
│   tabeliao       │  1. compute sha256(bytes) → digest
│  (publisher)     │  2. run provas pack → pack_hash
│                  │  3. build AdmitArtifactInput { digest, profile,
│                  │     compliance.result_hash, ... }
│                  │  4. sign over composed_root → signed_root
└────────┬─────────┘
         │ POST /api/v1/artifacts
         ▼
┌──────────────────┐
│   cartorio       │  ✓ shape validation (digest format, names, org)
│   admission      │  ✓ verify_signed_root_against_policy (Ed25519)
│   gate           │  ✓ verify_modifier_authorized(Publisher, Admit)
│                  │  ✓ idempotency: digest not already admitted
│                  │  ✓ recompose state-leaf composed_root from
│                  │     declared fields → MUST equal signed_root.root
│                  │  ✓ verify_state_invariants
│                  │  ✓ verify_event_invariants
│                  │
│                  │  ATOMIC: state.insert + events.append
│                  │
│                  │  state_root advances · event_root advances
│                  │  ledger_root = BLAKE3(state_root || event_root)
└──────────────────┘

  Any failed check → 4xx response, row in the rejection log,
                    no leaf added to either tree.`}</Diagram>
        <Deeper title="Each gate check explained">
          <P>
            <strong>Shape validation</strong>: digest is a sha256 prefix, names are bounded, org
            matches the registry config — early reject for malformed inputs.
            <br />
            <strong>verify_signed_root_against_policy</strong>: Ed25519 verify against the
            per-modifier-class allow-list, or skip if list is empty (back-compat).
            <br />
            <strong>verify_modifier_authorized</strong>: the matrix from section 4 — Publisher
            cannot Revoke, Scanner cannot Reactivate.
            <br />
            <strong>Idempotency by digest</strong>: a duplicate admit returns HTTP 409, no leaf
            added (replays go nowhere).
            <br />
            <strong>composed_root recompose</strong>: cartorio rebuilds the BLAKE3 over the declared
            fields and compares to the signed root. Tampered request body → mismatch → 4xx.
            <br />
            <strong>verify_state_invariants / verify_event_invariants</strong>: internal pair checks
            (status implies pillars present, attestation field bounds, etc.).
            <br />
            <strong>Atomic dual-write</strong>: state.insert + event.append commit together. No
            half-state on partial failure.
          </P>
        </Deeper>
      </Section>

      {/* ─── 6. Flow B — verify offline ─────────────────────────────── */}
      <Section
        n={6}
        icon={<SearchIcon color="primary" />}
        title="Flow B — verify offline (consumer → cartorio → pure function)"
      >
        <ELI5>
          You don&apos;t ask the bank if your check cleared. You have a signed receipt; you can
          verify the math yourself. Cartorio works the same way — pin a root, fetch a proof, hash up
          the path locally, decide. The registry can be offline, lying, or compromised, and you
          still get the right answer.
        </ELI5>
        <Diagram>{`Consumer flow (~30 LOC, no extra dependencies)
══════════════════════════════════════════════════════════

1. Pin a root (do this once, or every N minutes)
   ──────────────────────────────────────────────────────
   GET /api/v1/merkle/root
   → { state_root, event_root, ledger_root, computed_at }
   pinned_state_root := state_root

2. Fetch a proof for one specific artifact
   ──────────────────────────────────────────────────────
   GET /api/v1/artifacts/{id}/proof
   → { proof: { leaf, steps[], leaf_index, tree_size },
       root: <state_root_at_proof_time>,
       computed_at }

3. Verify offline (pure function — no I/O, no allocation)
   ──────────────────────────────────────────────────────
   if proof.root == pinned_state_root and
      verify_inclusion_proof(&proof, &pinned_state_root):
       trust the artifact → it IS in the ledger
   else:
       refuse → either the proof is stale, or the registry
       has drifted/been tampered with

  Cost: O(log N) BLAKE3 hashes ≈ < 2 µs per verification.`}</Diagram>
        <Stack direction="row" spacing={2} sx={{ my: 2 }}>
          <Button component={Link} to="/verify" variant="contained" startIcon={<VerifiedIcon />}>
            Try it now → /verify
          </Button>
          <Typography color="text.secondary" sx={{ alignSelf: 'center' }} variant="body2">
            The <em>Verify</em> tab runs all three steps in your browser, including the BLAKE3
            path-up.
          </Typography>
        </Stack>
        <Deeper title="The full verifier in ~30 lines">
          <P>
            This is the actual Rust-side reference implementation. Cartorio ships{' '}
            <code>verify_inclusion_proof</code> as a public function; this SPA also ships a
            TypeScript port that runs in your browser (see{' '}
            <code>src/shared/crypto/blake3-merkle.ts</code>).
          </P>
          <Diagram>{`use cartorio::merkle_tree::{InclusionProof, verify_inclusion_proof};
use tameshi::hash::Blake3Hash;
use anyhow::{Result, bail};

async fn check_artifact_admitted(
    artifact_id: &str,
    cartorio_url: &str,
    pinned_state_root: &Blake3Hash,
    client: &reqwest::Client,
) -> Result<()> {
    #[derive(serde::Deserialize)]
    struct ProofResponse {
        proof: InclusionProof,
        root: Blake3Hash,
    }
    let url = format!("{cartorio_url}/api/v1/artifacts/{artifact_id}/proof");
    let resp: ProofResponse = client.get(url).send().await?.json().await?;

    if &resp.root != pinned_state_root {
        bail!("registry root drifted from pinned root");
    }
    if !verify_inclusion_proof(&resp.proof, pinned_state_root) {
        bail!("inclusion proof did not verify");
    }
    Ok(())
}`}</Diagram>
          <P>
            Historical roots are pinned snapshot-by-snapshot in <code>state_root_history</code>. Old
            proofs that pinned an earlier root remain verifiable indefinitely via{' '}
            <code>GET /api/v1/merkle/root?at=&lt;rfc3339&gt;</code>.
          </P>
        </Deeper>
      </Section>

      {/* ─── 7. Flow C — tamper rejection ────────────────────────── */}
      <Section
        n={7}
        icon={<BlockIcon color="primary" />}
        title="Flow C — tamper rejection (the table that pays the rent)"
      >
        <ELI5>
          Every protected surface has a sensor. Try to flip one bit anywhere — the manifest, the
          attestation, the signature, even a database row — and at least one check trips. The{' '}
          <strong>Rejected</strong> tab shows live attempts in real time.
        </ELI5>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Tamper vector</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>How it&apos;s caught</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TAMPER_VECTORS.map((t) => (
                <TableRow key={t.vector}>
                  <TableCell>{t.vector}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{t.caught_by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button component={Link} to="/rejected" variant="outlined" color="error">
            See live rejections → /rejected
          </Button>
        </Stack>
        <Deeper title="Defense-in-depth chain (eight layers)">
          <Diagram>{`Attacker tries something
       │
       ▼
[1] HTTP shape validation     (rejects most malformed)
       │
       ▼
[2] modifier-identity authz   (rejects wrong-actor transitions)
       │
       ▼
[3] signed_root.root recheck  (rejects tampered request bodies)
       │
       ▼
[4] verify_state_invariants   (rejects pillar gaps + non-Compliant)
       │
       ▼
[5] verify_event_invariants   (rejects tampered events)
       │
       ▼
[6] state stored, event appended atomically
       │
       ▼
[7] inclusion proof available  (consumers verify offline against
                                pinned root)
       │
       ▼
[8] periodic state-vs-events  (catches storage-layer tampering — the
    consistency check          one attack vector that bypasses 1-5)`}</Diagram>
          <P>
            Layers 1-5 are synchronous on every admission. Layers 6-7 are non-blocking. Layer 8 is
            asynchronous and is the catch-net for attacks that bypass the API entirely (direct DB
            row mutation).
          </P>
        </Deeper>
      </Section>

      {/* ─── 8. Four-repo chain ──────────────────────────────────── */}
      <Section
        n={8}
        icon={<LinkIcon color="primary" />}
        title="The four-repo chain — provas / tabeliao / cartorio / lacre"
      >
        <ELI5>
          An assembly line where each station does one thing well. Provas defines the tests.
          Tabeliao runs them and submits the result. Cartorio remembers them in the merkle ledger.
          Lacre enforces them at the registry door — anything without a receipt gets a 403.
        </ELI5>
        <Diagram>{`        ┌──────────────┐
        │   provas     │  Typed ComplianceTest + Pack + deterministic
        │              │  Runner. pack_hash = BLAKE3(test_id || version
        │              │  || outcome | evidence) — same input → same hash.
        │              │
        │              │  Curated FedRAMP-High packs for image / helm /
        │              │  bundle live here, public source, NIST 800-53
        │              │  Rev 5 mapping baked in.
        └──────┬───────┘
               │ tabeliao imports the pack
               ▼
        ┌──────────────┐
        │  tabeliao    │  Publisher CLI. Runs the pack pre-publish (fail-
        │ (publisher)  │  closed), bakes pack_hash into AdmitArtifactInput,
        │              │  signs over composed_root, submits to cartorio,
        │              │  pushes through lacre.
        └──────┬───────┘
               │ POST AdmitArtifactInput
               ▼
        ┌──────────────┐
        │   cartorio   │  Merkle ledger. Stores (digest, profile, result_
        │              │  hash) plus the rest of the attestation chain.
        │              │  Two trees, one ledger_root, offline-verifiable
        │              │  inclusion proofs.
        └──────┬───────┘
               │ GET /api/v1/artifacts/by-digest/{d}
               ▼
        ┌──────────────┐
        │    lacre     │  OCI registry gate. On every PUT manifest:
        │  (OCI gate)  │     hash the body → ask cartorio by digest →
        │              │     if (Active + org match) forward upstream
        │              │     else 403.
        │              │  Tag-spoof can’t bypass: lacre hashes the body,
        │              │  not the URL.
        └──────────────┘`}</Diagram>
        <Deeper title="The contract — replace any one of them">
          <P>
            Each repo is independently auditable. Replace any one of them with a contract-conforming
            reimplementation and the chain still composes. The contract is small: deterministic{' '}
            <code>pack_hash</code> (provas), content-addressed <code>digest</code> (any OCI
            registry), and composable BLAKE3 roots (tameshi&apos;s <code>combine</code>).
          </P>
          <P>
            The single value the chain delivers is a transferable, mechanically-verifiable receipt
            that named compliance tests ran successfully against a specific artifact — anyone with
            the public pack source code and the artifact&apos;s public bytes can re-derive the
            receipt with no trust in pleme-io required. That&apos;s what makes the proof{' '}
            <em>constructive</em>, not <em>declarative</em>.
          </P>
        </Deeper>
      </Section>

      {/* ─── Glossary ────────────────────────────────────────────── */}
      <Accordion variant="outlined" disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Glossary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }}>Term</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Meaning</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {GLOSSARY.map((g) => (
                  <TableRow key={g.term}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {g.term}
                    </TableCell>
                    <TableCell>{g.def}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
