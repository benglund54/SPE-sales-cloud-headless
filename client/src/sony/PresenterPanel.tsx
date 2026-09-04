import { useEffect, useRef, useState } from 'react';
import { type SceneId, SCENE_ORDER } from './scenes';

interface Props {
  open: boolean;
  onClose: () => void;
  onJump: (id: SceneId) => void;
  onReset: () => void;
}

type LiveStatus = 'checking' | 'unavailable';

/**
 * Hidden presenter panel. Opened only via Alt+Shift+P (see usePresenterPanel);
 * Escape closes. Not discoverable through ordinary UI, and explicitly a
 * presenter convenience — NOT a security boundary. Keyboard-accessible and
 * focus-managed. Absent from the DOM entirely when closed, so it cannot appear
 * in screenshots unless opened.
 */
export function PresenterPanel({ open, onClose, onJump, onReset }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('checking');

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) {
      firstBtnRef.current?.focus();
    }
  }, [open]);

  // Probe the (optional) live-brief capability. When the flag is off the route
  // does not exist, so this fails and we show the disabled state. Off by default.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLiveStatus('checking');
    fetch('/api/executive-brief/capability')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => {
        // Even when the route exists, the live option stays OFF by default; we
        // only note availability. Presenter must opt in (future phase).
        if (!cancelled) setLiveStatus('unavailable');
      })
      .catch(() => {
        if (!cancelled) setLiveStatus('unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Simple focus trap within the panel while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="sony-presenter-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Presenter controls"
      data-no-swipe
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sony-presenter-panel" ref={panelRef}>
        <div className="sony-presenter-head">
          <span className="sony-presenter-title">Presenter controls</span>
          <button className="sony-presenter-close" onClick={onClose} aria-label="Close presenter controls">
            ✕
          </button>
        </div>

        <div className="sony-presenter-group" role="group" aria-label="Jump to scene">
          <span className="sony-presenter-group-label">Jump to scene</span>
          <div className="sony-presenter-jumps">
            {SCENE_ORDER.map((s, i) => (
              <button
                key={s.id}
                ref={i === 0 ? firstBtnRef : undefined}
                className="sony-presenter-btn"
                onClick={() => onJump(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sony-presenter-group">
          <button className="sony-presenter-btn sony-presenter-reset" onClick={onReset}>
            Reset presentation to Slack
          </button>
        </div>

        <div className="sony-presenter-group">
          <span className="sony-presenter-group-label">Live executive brief</span>
          <div className="sony-presenter-live">
            <span className="sony-presenter-live-status" data-status={liveStatus}>
              {liveStatus === 'checking' ? 'Checking…' : 'Unavailable (deterministic brief in use)'}
            </span>
            <button className="sony-presenter-btn" disabled aria-disabled="true">
              Off
            </button>
          </div>
          <p className="sony-presenter-note">
            The executive brief is prepared deterministically from governed context. Live generation
            is disabled in this build.
          </p>
        </div>
      </div>
    </div>
  );
}
