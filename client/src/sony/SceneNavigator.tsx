import { type SceneId, SCENE_ORDER } from './scenes';

interface Props {
  scene: SceneId;
  onSelect: (id: SceneId) => void;
}

/**
 * Accessible segmented control for switching scenes. Rendered once, driven by
 * the typed SceneId. Adding Claude in HX-4 requires no change here — it reads
 * SCENE_ORDER. No swipe gestures in this phase.
 */
export function SceneNavigator({ scene, onSelect }: Props) {
  return (
    <nav className="sony-nav" aria-label="Sony IP360 scenes">
      <div className="sony-nav-segments" role="tablist" aria-label="Scenes">
        {SCENE_ORDER.map((s) => {
          const active = s.id === scene;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`sony-scene-${s.id}`}
              className={`sony-nav-segment ${active ? 'sony-nav-segment-active' : ''}`}
              onClick={() => onSelect(s.id)}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
