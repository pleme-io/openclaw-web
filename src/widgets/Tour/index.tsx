/**
 * Guided tour over the openclaw proof-chain demo.
 *
 * Auto-starts on first visit (localStorage flag), and exposes a global
 * `start-tour` window event so any AppBar button (or other UI surface)
 * can replay the tour without binding to this component's state.
 *
 * Cross-route navigation: each step carries a `data.route`. On
 * step:after we (a) compute the next index, (b) navigate if the next
 * step's route differs from the current path, (c) restart the tour at
 * the new index after a tiny delay so the next step's target has time
 * to mount in the freshly-rendered route.
 *
 * Targets the v3 react-joyride API: named `Joyride` export, `onEvent`
 * handler, top-level `options` prop carrying `showProgress`/`buttons`/
 * `primaryColor`/`zIndex`/`skipBeacon`.
 */
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { EVENTS, type EventData, Joyride, STATUS, type Step } from 'react-joyride';

const STORAGE_KEY = 'openclaw-tour-seen-v5';
const START_EVENT = 'openclaw:start-tour';

// Step shape with route metadata. react-joyride forwards `data` through
// the event payload verbatim; this is how we coordinate cross-route
// navigation without coupling the Tour to the router's internals.
type TourStep = Step & { data?: { route?: string } };

const STEPS: TourStep[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Welcome — what you’re looking at',
    content: (
      <>
        Imagine the regulator calling: &ldquo;You had an incident. In 72 hours, tell me which
        version of which software was running and whether you&apos;d verified it was safe.&rdquo;
        Most companies scramble. This 90-second tour shows a system that answers those questions
        instantly, with cryptographic proof anyone can re-check themselves. The{' '}
        <strong>openclaw</strong> agent shown throughout is the demonstration artifact — the system
        being shown off is the proof chain that protects it. Use <strong>Next</strong>,{' '}
        <strong>Back</strong>, or <strong>Skip</strong> at any time.
      </>
    ),
    skipBeacon: true,
    data: { route: '/' },
  },
  {
    target: '[data-tour="ledger-root"]',
    title: 'The ledger root — your audit pin',
    content: (
      <>
        Cartorio runs two merkle trees (state + event) that fold into one 32-byte{' '}
        <code>ledger_root</code>. An auditor pins this 32 bytes once and uses it to verify any past
        compliance claim offline — no trust in the registry, no SIEM trawl, microsecond response.
      </>
    ),
    data: { route: '/' },
  },
  {
    target: '[data-tour="audit"]',
    title: 'Continuous audit',
    content: (
      <>
        Every 15 minutes, cartorio re-folds the event log into a derived state and compares to the
        live state. Divergence here = direct DB tamper attempt. The merkle proof is enforced even
        against the registry itself.
      </>
    ),
    data: { route: '/' },
  },
  {
    target: '[data-tour="nav-artifacts"]',
    title: 'Each artifact has a receipt',
    content: <>Let&apos;s look at what an admitted artifact actually carries.</>,
    data: { route: '/' },
  },
  {
    target: '[data-tour="artifacts-table"]',
    title: 'The three-field receipt',
    content: (
      <>
        The receipt is just three fields: <code>digest</code>, <code>profile</code>, and{' '}
        <code>result_hash</code>. Anyone with the public bytes and the public provas pack source can
        re-derive the result_hash. That&apos;s why we call the proof <em>constructive</em> — the
        verifier reproduces, doesn&apos;t trust.
      </>
    ),
    data: { route: '/artifacts' },
  },
  {
    target: '[data-tour="nav-verify"]',
    title: 'Try it yourself',
    content: (
      <>
        The Verify tab is where philosophy meets reality — your browser hashes a manifest, fetches
        the inclusion proof, and walks the BLAKE3 path-up locally.
      </>
    ),
    data: { route: '/artifacts' },
  },
  {
    target: '[data-tour="verify-drop"]',
    title: 'Verify, in your browser',
    content: (
      <>
        The page picks an admitted artifact and runs the full verification cycle automatically — no
        upload, no clicks. Step 1 confirms the digest is in cartorio&apos;s ledger; step 2 fetches
        the inclusion proof and walks the BLAKE3 path-up <em>locally in your browser</em> in
        microseconds. If anyone tampered with the artifact, the proof, or the registry, step 2 flips
        to &ldquo;does not verify.&rdquo;
      </>
    ),
    data: { route: '/verify' },
  },
  {
    target: '[data-tour="nav-rejected"]',
    title: 'Tamper attempts',
    content: (
      <>
        When the admission gate refuses something, the attempt lands on the Rejected tab — visible
        but never recorded as an admission.
      </>
    ),
    data: { route: '/verify' },
  },
  {
    target: '[data-tour="rejected-table"]',
    title: 'Visible but never admitted',
    content: (
      <>
        Each rejection carries a structured reason badge — <code>state-leaf-mismatch</code>,{' '}
        <code>compliance-attestation-mismatch</code>, etc. The merkle tree stays untouched; tamper
        attempts are surfaced, not silently dropped.
      </>
    ),
    data: { route: '/rejected' },
  },
  {
    target: '[data-tour="nav-explain"]',
    title: 'Want the full picture?',
    content: (
      <>
        The Explain tab walks through the whole story in plain language first (the problem, the
        solution, why we picked these data structures), then maps it onto <strong>CIRCIA</strong>,
        then dives into the technical detail with diagrams and code. 12 sections total, ELI5 lead,
        &ldquo;dive deeper&rdquo; accordions for the math.
      </>
    ),
    data: { route: '/rejected' },
  },
  {
    target: '[data-tour="value-prop"]',
    title: 'The regulatory pull',
    content: (
      <>
        This is why the system exists. CISA&apos;s CIRCIA final rule is expected May 2026 and will
        require covered entities to file incident reports within 72 hours, including specific data
        elements about the artifacts that were running and their compliance posture. Cartorio gives
        that evidence cryptographically, in microseconds.
      </>
    ),
    data: { route: '/explain' },
  },
  {
    target: '#s4',
    title: 'A concrete openclaw scenario',
    content: (
      <>
        AI agents like openclaw have wide attack surface, wide deployment, and frequent updates — so
        &ldquo;compliant before deployment&rdquo; has to be a cryptographic gate, not a procedural
        one. Section 4 walks through an end-to-end FedRAMP-High openclaw release: pack runs{' '}
        <em>before</em> publish, admit happens <em>before</em> the registry sees the bytes, lacre
        gates <em>before</em> the cluster pulls. There is no point at which someone says
        &ldquo;trust me.&rdquo;
      </>
    ),
    data: { route: '/explain' },
  },
  {
    target: '[data-tour="explain-toc"]',
    title: 'Jump anywhere',
    content: (
      <>
        Click any chip to jump to a section, or scroll all the way down for the &ldquo;where to go
        next&rdquo; box with links to the real openclaw and the pleme-io repos that secure it.
      </>
    ),
    data: { route: '/explain' },
  },
  {
    target: '[data-tour="next-stop"]',
    title: 'See the real openclaw',
    content: (
      <>
        The openclaw agent in this demo is a real, widely-deployed open-source AI assistant —{' '}
        <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noreferrer">
          github.com/openclaw/openclaw
        </a>
        . The pleme-io repos that secure it are linked here too: openclaw-scanner,
        openclaw-publisher-pki, tameshi-openclaw, plus the four-repo chain itself (cartorio, provas,
        tabeliao, lacre). Replay anytime via <strong>Take tour</strong> in the top nav.
      </>
    ),
    data: { route: '/explain' },
  },
];

/**
 * Imperatively start the tour from anywhere in the app (e.g. an AppBar
 * button). Decoupled from the Tour component via a window event — no
 * direct dependency, no context wiring.
 */
export function startTour(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(START_EVENT));
}

export function Tour() {
  const navigate = useNavigate();
  const router = useRouterState();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Auto-start on first visit. 800 ms gives the AppBar + Overview cards
  // time to render before the first beacon paints.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (localStorage.getItem(STORAGE_KEY)) return undefined;
    const t = setTimeout(() => setRun(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Imperative replay handler.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handler = () => {
      setStepIndex(0);
      setRun(false);
      // Toggle run:true → false → true so joyride observes a fresh
      // start instead of resuming mid-tour.
      setTimeout(() => setRun(true), 50);
    };
    window.addEventListener(START_EVENT, handler);
    return () => window.removeEventListener(START_EVENT, handler);
  }, []);

  const onEvent = (data: EventData) => {
    const { type, status, index, action } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem(STORAGE_KEY, '1');
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const next = index + (action === 'prev' ? -1 : 1);
      if (next < 0 || next >= STEPS.length) {
        setRun(false);
        localStorage.setItem(STORAGE_KEY, '1');
        return;
      }
      const nextStep = STEPS[next];
      const nextRoute = nextStep?.data?.route;
      if (nextRoute && router.location.pathname !== nextRoute) {
        // Pause + navigate + restart so the target has time to mount.
        setRun(false);
        navigate({ to: nextRoute as '/' });
        setStepIndex(next);
        setTimeout(() => setRun(true), 250);
      } else {
        setStepIndex(next);
      }
    }
  };

  return (
    <Joyride
      steps={STEPS}
      run={run}
      stepIndex={stepIndex}
      continuous
      onEvent={onEvent}
      options={{
        primaryColor: '#1976d2',
        zIndex: 10000,
        showProgress: true,
        // Default is ['back', 'close', 'primary']. We want skip + back
        // + primary (no close button — skip ends the tour outright).
        buttons: ['skip', 'back', 'primary'],
        // Permanent end-of-tour state lives in localStorage; pressing
        // skip ends the tour rather than just closing the current step.
        closeButtonAction: 'skip',
      }}
      styles={{
        tooltip: {
          fontSize: 14,
          borderRadius: 8,
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: 600,
        },
        buttonPrimary: { borderRadius: 6 },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Done',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  );
}
