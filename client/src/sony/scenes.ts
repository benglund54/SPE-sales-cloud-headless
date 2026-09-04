/**
 * Typed scene model for the Sony Headless 360 experience.
 *
 * The navigator is driven by this typed identifier — NOT by theme-name
 * conditionals — so adding Claude in HX-4 is a one-line change to SCENE_ORDER
 * (plus its scene component) with no rewrite of the state model, navigator, or
 * hash logic.
 */

export type SceneId = 'slack' | 'teams';

export interface SceneDef {
  id: SceneId;
  /** Segment label shown in the navigator. */
  label: string;
  /** URL hash (without the leading '#'). */
  hash: string;
}

/**
 * Ordered scenes for this phase. HX-4 will append { id: 'claude', ... } here;
 * everything downstream (navigator, hash sync, fallback) reads from this list.
 */
export const SCENE_ORDER: SceneDef[] = [
  { id: 'slack', label: 'Slack', hash: 'slack' },
  { id: 'teams', label: 'Teams', hash: 'teams' },
];

export const DEFAULT_SCENE: SceneId = 'slack';

/** Parse a location hash into a known SceneId, falling back to Slack. */
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
