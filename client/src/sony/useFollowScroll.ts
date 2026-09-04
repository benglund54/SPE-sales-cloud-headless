import { useEffect, useRef } from 'react';

/**
 * Keep a scroll container pinned to its newest content as `dep` changes
 * (e.g. progress stages / revealed sections). Scrolls ONLY the container's own
 * scrollTop — never `scrollIntoView`, which could move the whole browser
 * viewport. Returns a ref to attach to the scrollable conversation element.
 */
export function useFollowScroll<T extends HTMLElement>(dep: unknown) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [dep]);
  return ref;
}
