import { useCallback, useRef, useState } from 'react';
import { ActivationProvider, useActivation } from '../context/ActivationContext';
import { SlackScene } from './SlackScene';
import { TeamsScene } from './TeamsScene';
import { ClaudeScene } from './ClaudeScene';
import { PresenterPanel } from './PresenterPanel';
import { useScene } from './useScene';
import { useSwipeNavigation } from './useSwipeNavigation';
import { usePresenterPanel } from './usePresenterPanel';
import { nextScene, type SwipeDirection } from './swipe';
import { DEFAULT_SCENE, SCENE_ORDER } from './scenes';
import './sony.css';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Path-gated Sony Headless 360 experience (mounted only at
 * /sony-headless-360). ActivationProvider is mounted only here.
 *
 * HX-5: adds swipe navigation over the typed scene state, a hidden presenter
 * panel (Alt+Shift+P) with jump/reset, and reset of Claude's reveal + gesture
 * state. The visible navigator remains authoritative. Scene shells are
 * unchanged (HX-6 replaces them). All hash updates stay replaceState-only.
 */
function SonyExperienceInner() {
  const { status, context, activationUrl, error } = useActivation();
  const { scene, setScene } = useScene();
  const presenter = usePresenterPanel();
  const reduced = prefersReducedMotion();

  // A monotonically increasing key that remounts the scene subtree on reset,
  // restarting Claude's reveal and clearing any transient scene state.
  const [resetKey, setResetKey] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const onSwipe = useCallback(
    (direction: Exclude<SwipeDirection, null>) => {
      setScene((current) => nextScene(current, direction));
    },
    [setScene]
  );

  const { dragX, dragging, handlers } = useSwipeNavigation({ onSwipe, reducedMotion: reduced });

  // Reset returns to the initial Teams state: default scene + a scene-subtree
  // remount that reinitializes every scene's prompts, progress, rendered
  // answers, and scroll position (and clears any conversation timers).
  const resetToDefault = useCallback(() => {
    setScene(DEFAULT_SCENE);
    setResetKey((k) => k + 1);
    presenter.close();
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [setScene, presenter]);

  if (status === 'loading') {
    return (
      <div className="sony-state" role="status">
        <span className="sony-state-title">Loading Sony IP360…</span>
      </div>
    );
  }

  if (status === 'error' || !context) {
    return (
      <div className="sony-state sony-state-error" role="alert">
        <span className="sony-state-title">Sony IP360 is unavailable</span>
        <span className="sony-state-detail">{error ?? 'Please try again.'}</span>
      </div>
    );
  }

  const dragStyle =
    dragging && !reduced ? { transform: `translateX(${dragX * 0.15}px)` } : undefined;

  const sceneLabel = SCENE_ORDER.find((s) => s.id === scene)?.label ?? scene;

  return (
    <div className="sony-shell">
      {/* Nonvisual scene-change announcement (no visible cross-scene navigator). */}
      <div className="sony-visually-hidden" role="status" aria-live="polite">
        {sceneLabel} scene
      </div>
      <div
        className="sony-scene-viewport"
        id={`sony-scene-${scene}`}
        role="group"
        aria-label={`${sceneLabel} scene`}
        ref={viewportRef}
        style={dragStyle}
        {...handlers}
      >
        <div key={resetKey} className="sony-scene-inner">
          {scene === 'slack' && <SlackScene context={context} activationUrl={activationUrl} reducedMotion={reduced} />}
          {scene === 'teams' && <TeamsScene context={context} activationUrl={activationUrl} reducedMotion={reduced} />}
          {scene === 'claude' && <ClaudeScene context={context} activationUrl={activationUrl} reducedMotion={reduced} />}
        </div>
      </div>
      <PresenterPanel
        open={presenter.open}
        onClose={presenter.close}
        onJump={setScene}
        onReset={resetToDefault}
      />
    </div>
  );
}

export function SonyExperience() {
  return (
    <ActivationProvider>
      <SonyExperienceInner />
    </ActivationProvider>
  );
}
