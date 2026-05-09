import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BlockIcon from '@mui/icons-material/Block';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import HubIcon from '@mui/icons-material/Hub';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
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
  { n: 1, title: 'The problem (plain language)' },
  { n: 2, title: 'The solution (plain language)' },
  { n: 3, title: 'Why these data structures' },
  { n: 4, title: 'Why openclaw needs this — the FedRAMP-High scenario' },
  { n: 5, title: 'CIRCIA — the regulatory frame' },
  { n: 6, title: 'The receipt' },
  { n: 7, title: 'What a merkle tree is' },
  { n: 8, title: 'Cartorio’s dual-tree shape' },
  { n: 9, title: 'Modifier matrix' },
  { n: 10, title: 'Flow A — admit' },
  { n: 11, title: 'Flow B — verify offline' },
  { n: 12, title: 'Flow C — tamper rejection' },
  { n: 13, title: 'The four-repo chain' },
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

// CIRCIA — Cyber Incident Reporting for Critical Infrastructure Act of
// 2022. NPRM published April 2024; CISA's final rule expected May 2026.
// Each row maps a concrete CIRCIA-required incident-report data element
// (per the NPRM) to the cartorio capability that delivers it. This is
// the table that earns the "constructive compliance" claim — each cell
// names a regulator-facing artifact cartorio produces today, not a
// roadmap promise.
const CIRCIA_MAP: Array<{
  requirement: string;
  cartorio_capability: string;
}> = [
  {
    requirement:
      'Vulnerabilities exploited (which version of which artifact was running at the time of the incident)',
    cartorio_capability:
      'Per-artifact `digest` + `last_modified_at` + the full event chain in the merkle ledger answer "what was deployed and since when" with cryptographic proof.',
  },
  {
    requirement:
      'Security protocols in place at the time of the incident (proof of compliance posture)',
    cartorio_capability:
      '`compliance.profile` + `result_hash` per artifact, plus reattest events with timestamps, give a continuous chain of "this pack was passing for this artifact at each moment."',
  },
  {
    requirement: 'Supply-chain compromise — proof of which third-party components were running',
    cartorio_capability:
      'Bundle artifacts compose member pack_hashes into evidence; bundle proof inherits from member proofs, so member-level provenance is reconstructible at any past root.',
  },
  {
    requirement: '2-year retention of the underlying data — IOCs, log entries, vulnerability info',
    cartorio_capability:
      'Cartorio is append-only by construction. Sqlite/Postgres backends are durable; merkle root can be pinned externally for tamper-proof retention longer than any database TTL.',
  },
  {
    requirement: '72-hour reporting window — assemble the report fast',
    cartorio_capability:
      '"When was artifact X last verified compliant?" answers in O(log N) via inclusion proof — sub-millisecond at fleet scale, no SIEM trawl required.',
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
          How this works — start here
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          The first three sections explain the problem, the solution, and the ideas behind them in
          plain language — no jargon. The technical terms only show up later, once you have the
          picture. Each section opens with an <strong>ELI5</strong> framing; click{' '}
          <em>dive deeper</em> wherever you want the detail.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderLeftWidth: 4,
          borderLeftColor: 'primary.main',
          bgcolor: 'primary.50',
        }}
        data-tour="value-prop"
      >
        <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 700 }}>
          The short version
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
          An always-honest notebook of every compliance check, that nobody (not even us) can quietly
          edit.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          When something on your network gets compromised, regulators are going to ask in a hurry:
          which version of which software was running, when was it last verified safe, and where did
          its parts come from? Most companies can&apos;t answer that quickly, and what they do
          answer is hard to trust. We built a notebook that records every compliance check in a way
          where any tampering instantly changes a single 32-byte fingerprint that you (or an
          auditor) can pin and re-check anytime.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The <strong>system</strong> shown here is the notebook keeper and its supporting tools
          (cartorio + provas + tabeliao + lacre). The <strong>artifact</strong> being proven
          compliant — the openclaw agent image and its helm-expressed architecture — is the
          demonstration target, not the system itself. The same proof chain works for any artifact
          identified by its bytes.
        </Typography>
      </Paper>

      <Section n={1} icon={<GavelIcon color="primary" />} title="The problem (plain language)">
        <ELI5>
          Imagine your company runs important software. One day, attackers break in through it. The
          regulator calls and says: &ldquo;Tell me which version of which software was on your
          machines, when you last verified it was safe, and where every piece of code came from. You
          have 72 hours.&rdquo; Most companies cannot answer those questions quickly. The few that
          can, can&apos;t prove their answers weren&apos;t edited after the fact.
        </ELI5>
        <P>Three concrete things go wrong when an incident happens:</P>
        <Typography component="ul" sx={{ mb: 2, pl: 3 }}>
          <li>
            <strong>The clock starts immediately.</strong> Reporting windows are now measured in
            hours, not days. Trawling CI logs and SBOM exports is too slow.
          </li>
          <li>
            <strong>The evidence is scattered.</strong> Image registry over here, scanner reports
            over there, deployment manifests in git, compliance reports in a wiki. Reconstructing
            &ldquo;what was running on this machine yesterday&rdquo; takes engineering hours or
            days.
          </li>
          <li>
            <strong>The evidence is editable.</strong> Anyone with database access could in
            principle have changed the records after the fact. The regulator can&apos;t fully trust
            your answers, which means more questions, more evidence requests, more time.
          </li>
        </Typography>
        <P>
          The honest version of the problem: you need a record that is
          <em> fast to query</em>, <em>complete</em>, and <em>impossible to retroactively edit</em>{' '}
          — even by you. None of the off-the-shelf pieces (registry, scanner, CI) deliver all three.
        </P>
      </Section>

      <Section n={2} icon={<HubIcon color="primary" />} title="The solution (plain language)">
        <ELI5>
          We built a notebook with a magic property: every page has a fingerprint, and the front
          cover has the fingerprint of all the pages combined. If anyone tries to change so much as
          a comma on any page, the cover&apos;s fingerprint changes too. So we (and anyone we send
          the cover fingerprint to) can spot tampering instantly, without flipping through the
          notebook.
        </ELI5>
        <P>
          Whenever a piece of software is approved as compliant, we add an entry. Whenever something
          changes (it&apos;s revoked, re-checked, or replaced), we add another entry. Entries are{' '}
          <strong>never deleted</strong> and <strong>never edited</strong>.
        </P>
        <P>Three things follow from this design:</P>
        <Typography component="ul" sx={{ mb: 2, pl: 3 }}>
          <li>
            <strong>
              You can ask &ldquo;was X compliant on day D?&rdquo; and get a confident answer.
            </strong>{' '}
            The notebook tells you what was true at any past moment, because nothing has been
            overwritten.
          </li>
          <li>
            <strong>Anyone can verify the answer.</strong> An auditor pins the cover fingerprint,
            asks for proof a particular entry exists, and checks it themselves. The math says
            &ldquo;yes&rdquo; or &ldquo;no&rdquo; — they don&apos;t have to trust us.
          </li>
          <li>
            <strong>Tampering is instantly visible.</strong> Even if someone with full database
            access edits a record, the cover fingerprint shifts. We notice within minutes.
          </li>
        </Typography>
        <P>
          When the regulator calls, you point at the notebook and say: &ldquo;Here&apos;s the entry
          for the software that was running. Here&apos;s the cryptographic proof it&apos;s
          authentic. Here&apos;s the timestamp it was last verified. Here&apos;s the test result
          showing it passed our compliance pack.&rdquo; They verify all of it themselves in
          microseconds.
        </P>
      </Section>

      <Section n={3} icon={<AccountTreeIcon color="primary" />} title="Why these data structures">
        <ELI5>
          The &ldquo;notebook with the magic fingerprint&rdquo; isn&apos;t a metaphor — there&apos;s
          a specific, well-understood math trick behind it. This section explains in plain language
          why we picked each piece of math, before we name it.
        </ELI5>
        <P>
          <strong>Why a fingerprint that changes when anything changes?</strong> Because you need to
          detect tampering without reading the whole notebook. The trick: every entry has a small
          fingerprint; pairs of fingerprints get combined into a parent fingerprint; pairs of
          parents combine again; all the way up to one root fingerprint. Change any single bit
          anywhere, and the root changes. (The technical name for this is a <em>merkle tree</em>.)
        </P>
        <P>
          <strong>Why proofs that don&apos;t require sending the whole notebook?</strong> Because an
          auditor verifying &ldquo;X is in the ledger&rdquo; should not have to download a million
          entries. The trick: you can prove a single entry is in the tree by sending just a handful
          of fingerprints (about 20 for a million entries). The auditor combines them step by step
          and lands on the root they already pinned. (Technical name: <em>inclusion proof</em>.)
        </P>
        <P>
          <strong>
            Why a name that <em>is</em> the contents?
          </strong>{' '}
          Because if the name of a piece of software is just a label (&ldquo;openclaw
          v1.2.3&rdquo;), someone could swap the bytes underneath the label. But if the name is a
          fingerprint of the actual bytes, swapping the bytes changes the name — there&apos;s no way
          to lie. (Technical name: <em>content addressing</em> or <em>digest</em>.)
        </P>
        <P>
          <strong>Why two parallel records (state + events)?</strong> Because you have two different
          audit questions: <em>&ldquo;What is true right now?&rdquo;</em> (current state of every
          artifact) and <em>&ldquo;What happened to artifact X over time?&rdquo;</em> (full history
          of admissions, revocations, re-checks). One is a snapshot; the other is a journal. We keep
          both, and combine their root fingerprints into a single audit pin.
        </P>
        <P>
          <strong>Why an append-only journal?</strong> Because the regulator wants{' '}
          <strong>2 years</strong> of underlying data preserved. If entries can be edited,
          &ldquo;preserved&rdquo; means nothing — you need physical impossibility, not a policy. The
          journal is append-only by construction; combined with the root fingerprint, an editor
          would have to forge a 32-byte cryptographic value that is mathematically infeasible to
          forge.
        </P>
        <P>
          The next eight sections walk through each of these pieces in detail, with diagrams, code,
          and the technical names. If you want the technical names now: merkle tree, BLAKE3,
          inclusion proof, content-addressed digest, append-only event log, dual-tree shape.
          They&apos;re all just names for what we just described in plain language.
        </P>
      </Section>

      <Section
        n={4}
        icon={<SmartToyIcon color="primary" />}
        title="Why openclaw needs this — the FedRAMP-High scenario"
      >
        <ELI5>
          Openclaw is an AI agent. AI agents read your files, run your code, reach out to your
          network, and adapt their behavior on every update. They&apos;re also <em>everywhere</em> —
          when an agent ships a new version, it can be on tens of thousands of machines within
          hours. So if a tampered version slips through, the blast radius is much bigger than for
          ordinary software. Now imagine a regulated environment (a hospital, a defense contractor,
          a federal agency) where openclaw can&apos;t deploy unless it&apos;s formally proven to
          meet a baseline like <strong>FedRAMP High</strong>. That proof can&apos;t be a sticker —
          it has to be a receipt anyone can re- derive, attached to the bytes themselves, before the
          bytes ever reach the registry.
        </ELI5>
        <P>
          Three things about openclaw (and any agent in its class) make ungated, trust-me compliance
          unsafe:
        </P>
        <Typography component="ul" sx={{ mb: 2, pl: 3 }}>
          <li>
            <strong>Wide attack surface.</strong> The agent can read files, execute commands,
            install dependencies, fetch model outputs, mount MCP servers, and call out to APIs.
            Every capability is a blast vector if the bytes are tampered.
          </li>
          <li>
            <strong>Wide deployment.</strong> One image runs across many tenants. A single
            compromised tag means a single compromise point reaches all of them at once. Most update
            channels propagate in minutes.
          </li>
          <li>
            <strong>Frequent updates.</strong> Models change, prompts change, tool catalogs change,
            MCP servers change. Each update is a fresh opportunity for a supply-chain compromise —
            or simply for an update to drift out of compliance without anyone noticing.
          </li>
        </Typography>
        <P>
          So &ldquo;was openclaw v2.0 FedRAMP-High compliant when it was deployed?&rdquo; isn&apos;t
          an audit-time question — it&apos;s a deployment-time gate. The chain below shows how the
          four-repo system makes that gate cryptographic, not procedural.
        </P>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          The end-to-end story for an openclaw v2.0 release
        </Typography>
        <Diagram>{`Goal: openclaw v2.0 must be provably FedRAMP-High compliant
       BEFORE it ever reaches the registry — so a non-compliant
       version cannot be pulled, even by accident.

═══════════════════════════════════════════════════════════════

[1] PRE-PUBLISH (publisher's machine, fail-closed)
    ───────────────────────────────────────────────────────────
    tabeliao runs the curated provas pack
       fedramp-high-openclaw-image@2
    against the freshly-built bytes:

      ✓ NIST 800-53 SR-4   (provenance: nix closure hash)
      ✓ NIST 800-53 SI-7   (software/firmware integrity: BLAKE3)
      ✓ NIST 800-53 CM-6   (configuration settings)
      ✓ NIST 800-53 AU-2/3 (audit log capture)
      ✓ image-level CIS    (rootless, no setuid, sealed FS)
      ✓ openclaw-specific  (allowed-tools manifest, MCP allowlist,
                            no plaintext secret env vars, etc.)

    pack_hash = BLAKE3(test_id || version || outcome || evidence)

    Any test fails  →  publish ABORTED on this machine.
    No bytes leave the workstation.

[2] ADMIT  (POST /api/v1/artifacts to cartorio)
    ───────────────────────────────────────────────────────────
    tabeliao bakes the pack_hash into an AdmitArtifactInput:
       digest      = sha256(image bytes)
       profile     = "fedramp-high-openclaw-image@2"
       result_hash = pack_hash
       signed_root = Ed25519(composed_root)

    cartorio recomputes composed_root from the declared fields
    and refuses if anything doesn't match — if the publisher
    declared "compliant" but the recomputed root differs, the
    request is REJECTED and lands on the /rejected tab.

    Successful admit ⇒ a row in the merkle ledger that says:
       "openclaw v2.0 (sha256:...) was admitted at 2026-05-08T...
        with FedRAMP-High pack v2 result_hash X, signed by Y."

[3] REGISTRY GATE  (lacre, on every PUT manifest)
    ───────────────────────────────────────────────────────────
    The OCI registry sits behind lacre. On any push:
       lacre hashes the manifest body (tag-spoof can't bypass)
       lacre asks cartorio: "is this digest Active?"
       if NO  → 403, image cannot enter the registry
       if YES → forward upstream

    Result: there is no way to land openclaw v2.0 in the
    registry without a valid FedRAMP-High admit on file.
    "Pushed but not admitted" is structurally impossible.

[4] DEPLOY-TIME  (production cluster, on pull)
    ───────────────────────────────────────────────────────────
    Ops asks cartorio: "is digest sha256:... still Active and
    FedRAMP-High compliant?" — answers in microseconds with an
    inclusion proof anyone can verify offline. Continuous
    re-attestation by the scanner emits Reattest events; if a
    new vulnerability lands, the scanner emits Quarantine and
    the next deploy is BLOCKED at the gate.

[5] INCIDENT  (months later, regulator calls)
    ───────────────────────────────────────────────────────────
    "Which openclaw was running, when was it last verified, with
    which pack?" — cartorio answers in microseconds with a
    receipt the regulator can re-derive themselves. No SIEM
    trawl, no engineering hours, no trust required.`}</Diagram>

        <P>
          The load-bearing word above is <strong>BEFORE</strong>: pack runs BEFORE publish, admit
          happens BEFORE the registry sees the bytes, lacre gates BEFORE the cluster pulls. Every
          step is a fail-closed cryptographic check. There is no point at which someone can say
          &ldquo;trust me, it&apos;s compliant&rdquo; — at every step the system either has the
          receipt or it refuses.
        </P>

        <Deeper title="NIST 800-53 Rev 5 control mapping (FedRAMP-High baseline)">
          <P>
            FedRAMP High inherits the NIST 800-53 Rev 5 High baseline (about 410 controls). The
            cartorio + provas + tabeliao + lacre stack speaks directly to a load-bearing subset for
            any agent in openclaw&apos;s class:
          </P>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Control family / ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Requirement</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Where it&apos;s satisfied</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>SR-4</TableCell>
                  <TableCell>Provenance of supply-chain elements</TableCell>
                  <TableCell>
                    Nix closure hash bound to digest in the AdmitArtifactInput state-leaf
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SI-7</TableCell>
                  <TableCell>Software, firmware &amp; information integrity</TableCell>
                  <TableCell>
                    BLAKE3 composed_root + Ed25519 signed_root + lacre push gate
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CM-2 / CM-3 / CM-6 / CM-8</TableCell>
                  <TableCell>Baseline configuration, change control, settings, inventory</TableCell>
                  <TableCell>
                    Every artifact + every transition is a leaf in the event tree; inventory
                    derivable from current state tree
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AU-2 / AU-3 / AU-6 / AU-9 / AU-10</TableCell>
                  <TableCell>
                    Auditable events, content, review, protection, non- repudiation
                  </TableCell>
                  <TableCell>
                    Append-only event log + merkle root + Ed25519 signatures per modifier class
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SC-12</TableCell>
                  <TableCell>Cryptographic key establishment &amp; management</TableCell>
                  <TableCell>
                    Per-modifier-class Ed25519 allow-list (publisher / PKI / scanner / operator)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AC-3 / AC-6</TableCell>
                  <TableCell>Access enforcement, least privilege</TableCell>
                  <TableCell>
                    24-cell modifier × transition matrix (publisher cannot revoke; scanner cannot
                    reactivate; etc.)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography sx={{ mt: 2, mb: 2 }}>
            The same primitives also map cleanly to <strong>CMMC Level 3</strong> (DFARS
            252.204-7012 + 800-171), <strong>EO 14028</strong> / <strong>OMB M-22-18</strong>{' '}
            (federal supply-chain attestation), and <strong>SOC 2 Type II</strong> CC7 / CC8 (change
            management + integrity). The provas pack is the policy; cartorio is the evidence; lacre
            is the enforcement.
          </Typography>
        </Deeper>

        <Deeper title="Why this is structurally different from sign-and-pray">
          <P>
            Today&apos;s common pattern is &ldquo;sign the image with cosign, verify the signature
            at admission, trust the rest.&rdquo; That says <em>who</em> built the image, but not{' '}
            <em>whether the image passes any specific compliance check</em>. The signature can be
            valid and the image still non-compliant — because cosign attestations are free-text and
            carry no re-derivable test outcome.
          </P>
          <P>
            The provas <code>result_hash</code> is different: it&apos;s the BLAKE3 of the
            deterministic test-outcome stream. Same input (bytes + pack source) → same output. An
            auditor can re-run the pack against the bytes and confirm the hash matches. There is no
            fudging — the test either runs or it doesn&apos;t.
          </P>
          <P>
            Combine that with lacre at the registry door (&ldquo;no admit, no push&rdquo;), and the
            chain becomes structurally fail-closed: non-compliant openclaw cannot enter the
            registry, cannot be pulled, cannot run.
          </P>
        </Deeper>
      </Section>

      <Section n={5} icon={<GavelIcon color="primary" />} title="CIRCIA — the regulatory frame">
        <ELI5>
          Imagine the regulator calling at 3 AM: &ldquo;You had an incident. Tell me, in 72 hours,
          exactly which version of which thing was running, whether it was passing your compliance
          checks, and where the supply-chain provenance came from.&rdquo; Today most companies would
          scramble through CI logs and SBOMs for days. Cartorio answers each question in
          microseconds — with a receipt the regulator can re-verify themselves.
        </ELI5>
        <Typography sx={{ mb: 2 }}>
          CIRCIA (the Cyber Incident Reporting for Critical Infrastructure Act of 2022) requires
          covered entities to report covered cyber incidents to CISA within 72 hours, including
          specific data elements about the affected systems, vulnerabilities, and security posture.
          The cells below are the load-bearing claim: each row names a CIRCIA-required element and
          the cartorio primitive that delivers it today, not on a roadmap.
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '40%' }}>
                  CIRCIA report-data requirement
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cartorio capability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CIRCIA_MAP.map((c) => (
                <TableRow key={c.requirement}>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{c.requirement}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{c.cartorio_capability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Deeper title="The regulatory anchor (citations)">
          <P>
            Reporting requirement and data elements are codified in the CISA Notice of Proposed
            Rulemaking published in the Federal Register on <strong>April 4, 2024</strong>. The
            2-year retention rule, the inclusion of supply-chain compromises as covered incidents,
            and the &ldquo;security protocols in place&rdquo; data element are all in the NPRM text.
            Final rule expected <strong>May 2026</strong>. Live status:{' '}
            <a
              href="https://www.cisa.gov/topics/cyber-threats-and-advisories/information-sharing/cyber-incident-reporting-critical-infrastructure-act-2022-circia"
              target="_blank"
              rel="noreferrer"
            >
              cisa.gov/CIRCIA
            </a>
            .
          </P>
          <P>
            <strong>Adjacent frameworks the same primitives satisfy:</strong> EO 14028 + OMB M-22-18
            (federal supply-chain attestation), NIST 800-53 Rev 5 SI-7 (software, firmware, and
            information integrity), CM-2/CM-3/CM-6/CM-8 (configuration management + inventory), AU-2
            through AU-10 (audit + tamper-evident logs), SR-4 (provenance). Each maps onto the same{' '}
            <code>(digest, profile, result_hash)</code> receipt the rest of this page walks through.
          </P>
        </Deeper>
      </Section>

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
        n={6}
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
        n={7}
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
        n={8}
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
        n={9}
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
        n={10}
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
        n={11}
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
        n={12}
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
        n={13}
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

      {/* ─── Where to go next ─────────────────────────────────────── */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderLeftWidth: 4,
          borderLeftColor: 'success.main',
          bgcolor: 'success.50',
        }}
        data-tour="next-stop"
      >
        <Typography variant="overline" color="success.dark" sx={{ fontWeight: 700 }}>
          Where to go next
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
          See the real openclaw — and the pleme-io repos that secure it.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          The openclaw agent shown throughout this demo is a real, widely-deployed open-source AI
          assistant. Below are the actual public repositories: the agent itself, plus the pleme-io
          components that make the proof chain you just walked through.
        </Typography>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="The artifact" size="small" color="primary" />
            <Box>
              <Typography fontWeight={600}>
                <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noreferrer">
                  openclaw/openclaw
                </a>{' '}
                — the AI agent itself (
                <a href="https://openclaw.ai" target="_blank" rel="noreferrer">
                  openclaw.ai
                </a>
                )
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your own personal AI assistant. Any OS. Any Platform. The lobster way. Wide
                deployment + frequent updates is exactly why a cryptographic compliance gate
                matters.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="The scanner" size="small" color="warning" />
            <Box>
              <Typography fontWeight={600}>
                <a
                  href="https://github.com/pleme-io/openclaw-scanner"
                  target="_blank"
                  rel="noreferrer"
                >
                  pleme-io/openclaw-scanner
                </a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The continuous-compliance daemon. Re-runs the provas pack on a schedule against
                every admitted openclaw image; emits Reattest events on success, Quarantine on
                failure. The modifier-matrix &ldquo;Scanner&rdquo; row in section 9 is literally
                this repo.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="The PKI" size="small" color="error" />
            <Box>
              <Typography fontWeight={600}>
                <a
                  href="https://github.com/pleme-io/openclaw-publisher-pki"
                  target="_blank"
                  rel="noreferrer"
                >
                  pleme-io/openclaw-publisher-pki
                </a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publisher enrollment + signed CRL for the openclaw skill-store ecosystem. Cascades
                publisher cert revocations into cartorio via the modifier-matrix &ldquo;PKI&rdquo;
                row.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="The integration" size="small" color="success" />
            <Box>
              <Typography fontWeight={600}>
                <a
                  href="https://github.com/pleme-io/tameshi-openclaw"
                  target="_blank"
                  rel="noreferrer"
                >
                  pleme-io/tameshi-openclaw
                </a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The integration crate that wires openclaw into the tameshi
                deterministic-integrity-attestation ecosystem. The compose- state-leaf-root
                primitive cartorio uses lives upstream in tameshi.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="The ledger" size="small" color="primary" variant="outlined" />
            <Box>
              <Typography fontWeight={600}>
                <a href="https://github.com/pleme-io/cartorio" target="_blank" rel="noreferrer">
                  pleme-io/cartorio
                </a>{' '}
                ·{' '}
                <a href="https://github.com/pleme-io/provas" target="_blank" rel="noreferrer">
                  provas
                </a>{' '}
                ·{' '}
                <a href="https://github.com/pleme-io/tabeliao" target="_blank" rel="noreferrer">
                  tabeliao
                </a>{' '}
                ·{' '}
                <a href="https://github.com/pleme-io/lacre" target="_blank" rel="noreferrer">
                  lacre
                </a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The four-repo chain itself — the system this whole tour was about. Open-source; you
                can run cartorio against your own artifact stream tomorrow.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

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
