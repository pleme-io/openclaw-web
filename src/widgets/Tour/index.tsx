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

const STORAGE_KEY = 'openclaw-tour-seen-v1';
const START_EVENT = 'openclaw:start-tour';

// Step shape with route metadata. react-joyride forwards `data` through
// the event payload verbatim; this is how we coordinate cross-route
// navigation without coupling the Tour to the router's internals.
type TourStep = Step & { data?: { route?: string } };

const STEPS: TourStep[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Welcome to openclaw',
    content: (
      <>
        This 90-second tour walks you through cartorio&apos;s constructive proof chain — what the
        receipt is, how it&apos;s verified, and what tamper rejection looks like. Use{' '}
        <strong>Next</strong>, <strong>Back</strong>, or <strong>Skip</strong> at any time.
      </>
    ),
    skipBeacon: true,
    data: { route: '/' },
  },
  {
    target: '[data-tour="ledger-root"]',
    title: 'The ledger root',
    content: (
      <>
        Cartorio runs two merkle trees (state + event) that fold into one 32-byte{' '}
        <code>ledger_root</code>. Anyone can pin this hash and verify offline against it — no trust
        in the registry required.
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
    title: 'Verify in your browser',
    content: (
      <>
        Drop any file here. Your browser computes <code>sha256(bytes)</code> — no upload — looks the
        digest up in cartorio, fetches the merkle inclusion proof, and verifies the BLAKE3 path-up{' '}
        <em>locally</em>. If anyone tampered with anything, the verdict here flips to &ldquo;does
        not verify.&rdquo;
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
    title: 'Want the full philosophy?',
    content: (
      <>
        The Explain tab has 8 sections, each with an ELI5 lead and a &ldquo;dive deeper&rdquo;
        accordion. Diagrams, visuals, and code.
      </>
    ),
    data: { route: '/rejected' },
  },
  {
    target: '[data-tour="explain-toc"]',
    title: 'Jump anywhere',
    content: (
      <>
        Click any chip to jump to a section. That&apos;s the tour — explore freely now. You can
        replay anytime via <strong>Take tour</strong> in the top nav.
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
