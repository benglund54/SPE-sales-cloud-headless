/**
 * Pure swipe-gesture decision logic, separated from React and from the visual
 * scene shells so HX-6 can replace the shells without touching navigation.
 *
 * A gesture is described by its net delta (dx, dy) and elapsed time; the helpers
 * decide whether it is an intentional horizontal swipe and, if so, its
 * direction. Scene stepping is clamped to the ends of SCENE_ORDER and can never
 * move more than one scene per gesture.
 */
import { type SceneId, SCENE_ORDER } from './scenes';

/** Minimum horizontal travel (px) to count as a swipe. */
export const SWIPE_DISTANCE_PX = 60;
/** Minimum velocity (px/ms) that also qualifies a shorter, faster flick. */
export const SWIPE_VELOCITY_PXMS = 0.5;
/**
 * Horizontal intent ratio: |dx| must exceed |dy| by this factor, so a
 * primarily vertical drag (scrolling/selecting) is rejected.
 */
export const HORIZONTAL_RATIO = 1.5;

export type SwipeDirection = 'left' | 'right' | null;

export interface GestureSample {
  dx: number;
  dy: number;
  /** Elapsed time in ms (>0). */
  dt: number;
}

/**
 * Decide the swipe direction for a completed gesture, or null if it is not an
 * intentional horizontal swipe.
 *
 * - Rejects primarily vertical gestures (|dx| must beat |dy| by HORIZONTAL_RATIO).
 * - Qualifies on EITHER sufficient distance OR sufficient velocity.
 * - "left" = swiped leftwards (advance); "right" = swiped rightwards (back).
 */
export function swipeDirection(g: GestureSample): SwipeDirection {
  const absX = Math.abs(g.dx);
  const absY = Math.abs(g.dy);

  // Must be dominantly horizontal.
  if (absX < absY * HORIZONTAL_RATIO) return null;

  const velocity = g.dt > 0 ? absX / g.dt : 0;
  const farEnough = absX >= SWIPE_DISTANCE_PX;
  const fastEnough = velocity >= SWIPE_VELOCITY_PXMS && absX >= SWIPE_DISTANCE_PX / 2;
  if (!farEnough && !fastEnough) return null;

  return g.dx < 0 ? 'left' : 'right';
}

/**
 * Step exactly one scene in the given direction, clamped at the ends.
 * "left" advances (Slack→Teams→Claude); "right" goes back. Returns the same
 * scene when already at a boundary — never wraps, never skips.
 */
export function nextScene(current: SceneId, direction: Exclude<SwipeDirection, null>): SceneId {
  const idx = SCENE_ORDER.findIndex((s) => s.id === current);
  if (idx === -1) return current;
  const delta = direction === 'left' ? 1 : -1;
  const nextIdx = Math.max(0, Math.min(SCENE_ORDER.length - 1, idx + delta));
  return SCENE_ORDER[nextIdx].id;
}

/**
 * True when a gesture that begins on `el` (or an ancestor) must NOT start a
 * swipe: interactive/selectable controls, the navigator, and the presenter
 * panel. Keeps content selection and control interaction from being hijacked.
 */
export function isInteractiveOrigin(el: Element | null): boolean {
  const INTERACTIVE_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'LABEL']);
  let node: Element | null = el;
  while (node) {
    if (INTERACTIVE_TAGS.has(node.tagName)) return true;
    // Data hooks / roles that opt a subtree out of swipe.
    if (node.getAttribute?.('data-no-swipe') !== null && node.getAttribute?.('data-no-swipe') !== undefined) {
      return true;
    }
    const role = node.getAttribute?.('role');
    if (role === 'tablist' || role === 'tab' || role === 'dialog') return true;
    if (node.hasAttribute?.('contenteditable')) return true;
    node = node.parentElement;
  }
  return false;
}
