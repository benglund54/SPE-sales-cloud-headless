import { useCallback, useEffect, useState } from 'react';

/**
 * Pure predicate for the presenter toggle chord: Alt(Option)+Shift+P.
 *
 * macOS mutates KeyboardEvent.key when Option is held (Option+Shift+P yields a
 * special glyph such as "Π"/"∏", NOT "P"). So we match on the PHYSICAL key via
 * `code === 'KeyP'` and the exact modifier state, with `key` only as a fallback
 * for environments that don't populate `code`. Exposed for unit testing.
 */
export function isPresenterToggleChord(e: {
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  key?: string;
  code?: string;
}): boolean {
  const modifiersOk = e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey;
  if (!modifiersOk) return false;
  // Primary: physical key, robust to Option-modified `key` on macOS.
  if (e.code === 'KeyP') return true;
  // Fallback only when `code` is unavailable (some synthetic events).
  if (!e.code && (e.key === 'P' || e.key === 'p')) return true;
  return false;
}

/**
 * Pure reducer for the presenter panel's open state given a keyboard event.
 * Decoupled from React so the "does this event open/close the dialog?" behavior
 * is unit-testable without a DOM. Returns the next open state.
 */
export function nextPresenterOpen(
  current: boolean,
  e: { altKey: boolean; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean; key?: string; code?: string }
): boolean {
  if (isPresenterToggleChord(e)) return !current;
  if (e.key === 'Escape') return false;
  return current;
}

/**
 * Hidden presenter panel state. Toggled ONLY by Alt(Option)+Shift+P; Escape
 * closes. There is no visible affordance — this is a presenter convenience,
 * explicitly not a security boundary. The listener is attached at window level
 * so it fires regardless of which scene or element has focus.
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
        // Prevent the default character/menu action (esp. Option+key on macOS).
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
