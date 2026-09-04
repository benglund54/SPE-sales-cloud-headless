import { useCallback, useEffect, useState } from 'react';

/**
 * Pure predicate for the presenter toggle chord: Alt+Shift+P.
 * Exposed for unit testing without a DOM.
 */
export function isPresenterToggleChord(e: {
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  key: string;
}): boolean {
  return (
    e.altKey &&
    e.shiftKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.key === 'P' || e.key === 'p')
  );
}

/**
 * Hidden presenter panel state. Toggled ONLY by Alt+Shift+P; Escape closes.
 * There is no visible affordance — this is a presenter convenience, explicitly
 * not a security boundary.
 */
export function usePresenterPanel(): {
  open: boolean;
  close: () => void;
  setOpen: (v: boolean) => void;
} {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPresenterToggleChord(e)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape') {
        setOpen((v) => (v ? false : v));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return { open, close, setOpen };
}
