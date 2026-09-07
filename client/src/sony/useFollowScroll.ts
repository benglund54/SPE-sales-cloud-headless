import { useEffect, useRef } from 'react';

interface FollowScrollOptions {
  /** Smooth-animate the follow instead of jumping. Default false (instant). */
  smooth?: boolean;
  /** Reduced motion forces an instant jump even when `smooth` is set. */
  reducedMotion?: boolean;
  /**
   * 'bottom' (default) pins to the very bottom of the container. 'frontier'
   * scrolls only enough to keep the newest content visible above the composer
   * (a calmer follow that does not slam past several sections at once, and lets
   * the audience read each block before the next adjustment).
   */
  mode?: 'bottom' | 'frontier';
}

/**
 * Keep a scroll container following its newest content as `dep` changes (e.g.
 * progress stages / revealed sections). Scrolls ONLY the container's own
 * scrollTop — never `scrollIntoView`, which could move the whole browser
 * viewport. With `smooth`, the follow eases instead of snapping; reduced motion
 * always jumps. Returns a ref to attach to the scrollable conversation element.
 */
export function useFollowScroll<T extends HTMLElement>(dep: unknown, opts: FollowScrollOptions = {}) {
  const { smooth = false, reducedMotion = false, mode = 'bottom' } = opts;
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let top = el.scrollHeight;
    if (mode === 'frontier') {
      // Reveal just enough for the newest child's bottom to clear the fold —
      // never overscroll past content the audience hasn't read yet.
      const last = el.lastElementChild as HTMLElement | null;
      const newestBottom = last ? last.offsetTop + last.offsetHeight : el.scrollHeight;
      const target = newestBottom - el.clientHeight + 24; // small breathing room
      top = Math.max(el.scrollTop, Math.min(target, el.scrollHeight));
    }
    if (smooth && !reducedMotion && typeof el.scrollTo === 'function') {
      el.scrollTo({ top, behavior: 'smooth' });
    } else {
      el.scrollTop = top;
    }
  }, [dep]);
  return ref;
}
