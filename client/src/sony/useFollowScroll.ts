import { useEffect, useRef } from 'react';

interface FollowScrollOptions {
  /** Smooth-animate the follow instead of jumping. Default false (instant). */
  smooth?: boolean;
  /** Reduced motion forces an instant jump even when `smooth` is set. */
  reducedMotion?: boolean;
}

/**
 * Keep a scroll container pinned to its newest content as `dep` changes
 * (e.g. progress stages / revealed sections). Scrolls ONLY the container's own
 * scrollTop — never `scrollIntoView`, which could move the whole browser
 * viewport. With `smooth`, the follow eases instead of snapping (Claude uses
 * this for a calm, contained downward follow); reduced motion always jumps.
 * Returns a ref to attach to the scrollable conversation element.
 */
export function useFollowScroll<T extends HTMLElement>(dep: unknown, opts: FollowScrollOptions = {}) {
  const { smooth = false, reducedMotion = false } = opts;
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (smooth && !reducedMotion && typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [dep]);
  return ref;
}
