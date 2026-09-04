import { useEffect, useState } from 'react';

export type RevealPhase = 'preparing' | 'revealed';

/** Hold duration (ms) for the "preparing" phase. Kept well under 2s total. */
export const PREPARE_HOLD_MS = 750;

/**
 * Pure helper: given whether reduced motion is preferred, return the phase the
 * brief should START in. Reduced motion → reveal immediately; otherwise show
 * the preparing state first. Separated from timing so it can be unit-tested.
 */
export function initialRevealPhase(prefersReducedMotion: boolean): RevealPhase {
  return prefersReducedMotion ? 'revealed' : 'preparing';
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Deterministic reveal: show "Preparing executive brief from governed context…"
 * for ~PREPARE_HOLD_MS, then reveal the complete brief at once (no token
 * streaming). Under prefers-reduced-motion the brief is shown immediately.
 *
 * This is purely a local UI animation — it performs NO network call and does
 * NOT imply a live Claude request.
 */
export function useBriefReveal(): RevealPhase {
  const reduced = prefersReducedMotion();
  const [phase, setPhase] = useState<RevealPhase>(() => initialRevealPhase(reduced));

  useEffect(() => {
    if (reduced) {
      setPhase('revealed');
      return;
    }
    setPhase('preparing');
    const t = window.setTimeout(() => setPhase('revealed'), PREPARE_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return phase;
}
