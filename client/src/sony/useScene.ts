import { useCallback, useEffect, useState } from 'react';
import { type SceneId, sceneFromHash, hashForScene } from './scenes';

/**
 * Scene state synchronized with the URL hash.
 *
 * - Initial scene comes from the current hash (unknown/missing → Slack).
 * - `setScene` updates state AND the URL via history.replaceState, so the
 *   presentation does not accumulate browser-history entries. No reload.
 * - Listens for hashchange (e.g. manual edits / deep links) and stays in sync.
 */
type SceneUpdater = SceneId | ((current: SceneId) => SceneId);

export function useScene(): { scene: SceneId; setScene: (next: SceneUpdater) => void } {
  const [scene, setSceneState] = useState<SceneId>(() =>
    sceneFromHash(typeof window !== 'undefined' ? window.location.hash : '')
  );

  const setScene = useCallback((next: SceneUpdater) => {
    setSceneState((current) => {
      const id = typeof next === 'function' ? next(current) : next;
      const nextHash = hashForScene(id);
      if (typeof window !== 'undefined' && window.location.hash !== nextHash) {
        // replaceState (not pushState) — no extra history entries during the demo.
        const url = window.location.pathname + window.location.search + nextHash;
        window.history.replaceState(null, '', url);
      }
      return id;
    });
  }, []);

  // On mount, normalize the URL to the resolved scene (e.g. unknown hash →
  // #slack) without adding history, and keep state in sync with hashchange.
  useEffect(() => {
    const sync = () => setSceneState(sceneFromHash(window.location.hash));
    // Normalize once on mount.
    const resolved = sceneFromHash(window.location.hash);
    const normalized = hashForScene(resolved);
    if (window.location.hash !== normalized) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search + normalized
      );
    }
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return { scene, setScene };
}
