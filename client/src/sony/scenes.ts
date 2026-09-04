/**
 * Typed scene model for the Sony Headless 360 experience.
 *
 * The navigator is driven by this typed identifier — NOT by theme-name
 * conditionals — so adding Claude in HX-4 is a one-line change to SCENE_ORDER
 * (plus its scene component) with no rewrite of the state model, navigator, or
 * hash logic.
 */

export type SceneId = 'slack' | 'teams' | 'claude';

export interface SceneDef {
  id: SceneId;
  /** Segment label shown in the navigator. */
  label: string;
  /** URL hash (without the leading '#'). */
  hash: string;
}

/**
 * Swipe/narrative order (left→right): Slack · Teams · Claude. Swipe stepping
 * reads this list so horizontal navigation stays continuous. Note the DEFAULT
 * scene is Teams (HX-6V-D) — the presentation opens on Teams; Slack is a
 * fallback reached by hash or the presenter panel.
 */
export const SCENE_ORDER: SceneDef[] = [
  { id: 'slack', label: 'Slack', hash: 'slack' },
  { id: 'teams', label: 'Teams', hash: 'teams' },
  { id: 'claude', label: 'Claude', hash: 'claude' },
];

/**
 * Presenter-panel jump order (HX-6V-D): Teams first (primary), then Claude,
 * then Slack labeled as the fallback. Presenter terminology stays out of the
 * audience-facing UI.
 */
export const PRESENTER_ORDER: { id: SceneId; label: string }[] = [
  { id: 'teams', label: 'Teams' },
  { id: 'claude', label: 'Claude' },
  { id: 'slack', label: 'Slack (Backup)' },
];

/** Default scene when no (or an unknown) hash is present: Teams. */
export const DEFAULT_SCENE: SceneId = 'teams';

/** Parse a location hash into a known SceneId, falling back to the default. */
export function sceneFromHash(hash: string): SceneId {
  const normalized = hash.replace(/^#/, '').toLowerCase();
  const match = SCENE_ORDER.find((s) => s.hash === normalized);
  return match ? match.id : DEFAULT_SCENE;
}

/** The '#'-prefixed hash for a scene id. */
export function hashForScene(id: SceneId): string {
  const def = SCENE_ORDER.find((s) => s.id === id);
  return `#${def ? def.hash : DEFAULT_SCENE}`;
}
