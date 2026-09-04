import { useCallback, useEffect, useRef, useState } from 'react';
import {
  swipeDirection,
  isInteractiveOrigin,
  type SwipeDirection,
} from './swipe';

interface Options {
  /** Called with a qualifying direction when a gesture completes. */
  onSwipe: (direction: Exclude<SwipeDirection, null>) => void;
  /** When true, live drag offset is suppressed (reduced motion). */
  reducedMotion?: boolean;
}

interface SwipeState {
  /** Live horizontal drag offset in px (0 when idle or reduced-motion). */
  dragX: number;
  /** True while an active, eligible horizontal gesture is in progress. */
  dragging: boolean;
}

/**
 * Pointer-Events swipe navigation over the scene viewport. Gesture/state logic
 * is kept out of the visual shells: this hook returns handlers to spread on the
 * viewport plus a small drag state for the snap animation. Selection and
 * interactive controls are protected; vertical drags are ignored; the gesture
 * cancels safely on pointercancel / multitouch / interruption.
 *
 * The hook NEVER touches the URL or history itself — it only reports a
 * qualifying direction to `onSwipe`, so hash/replaceState behavior stays in one
 * place (useScene).
 */
export function useSwipeNavigation({ onSwipe, reducedMotion = false }: Options) {
  const [state, setState] = useState<SwipeState>({ dragX: 0, dragging: false });
  const gesture = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    startT: number;
    horizontal: boolean | null; // null until axis is decided
  }>({ active: false, pointerId: null, startX: 0, startY: 0, startT: 0, horizontal: null });

  const cancel = useCallback(() => {
    gesture.current.active = false;
    gesture.current.pointerId = null;
    gesture.current.horizontal = null;
    setState({ dragX: 0, dragging: false });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only primary button / primary pointer; ignore secondary or non-primary.
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (isInteractiveOrigin(e.target as Element)) return;
    gesture.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startT: performance.now(),
      horizontal: null,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const g = gesture.current;
      if (!g.active || e.pointerId !== g.pointerId) return;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      // Decide the axis once movement is meaningful.
      if (g.horizontal === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        g.horizontal = Math.abs(dx) > Math.abs(dy);
        if (!g.horizontal) {
          // Vertical intent — release so native scroll/selection proceeds.
          cancel();
          return;
        }
      }

      if (g.horizontal) {
        if (!reducedMotion) {
          // Damped live offset for the snap feel; capped for stability.
          const capped = Math.max(-window.innerWidth, Math.min(window.innerWidth, dx));
          setState({ dragX: capped, dragging: true });
        } else if (!state.dragging) {
          setState({ dragX: 0, dragging: true });
        }
      }
    },
    [cancel, reducedMotion, state.dragging]
  );

  const finish = useCallback(
    (e: React.PointerEvent) => {
      const g = gesture.current;
      if (!g.active || e.pointerId !== g.pointerId) return;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      const dt = performance.now() - g.startT;
      const dir = g.horizontal ? swipeDirection({ dx, dy, dt }) : null;
      cancel();
      if (dir) onSwipe(dir);
    },
    [cancel, onSwipe]
  );

  // Multitouch ambiguity: if a second pointer arrives, cancel the gesture.
  const onPointerDownCapture = useCallback(
    (e: React.PointerEvent) => {
      if (gesture.current.active && e.pointerId !== gesture.current.pointerId) {
        cancel();
      }
    },
    [cancel]
  );

  // Safety: if the window loses the pointer entirely, reset.
  useEffect(() => {
    const onBlur = () => cancel();
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [cancel]);

  return {
    dragX: state.dragX,
    dragging: state.dragging,
    handlers: {
      onPointerDown,
      onPointerDownCapture,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: cancel,
      onPointerLeave: (e: React.PointerEvent) => {
        // Leaving the viewport ends the gesture as a completion check.
        if (gesture.current.active) finish(e);
      },
    },
  };
}
