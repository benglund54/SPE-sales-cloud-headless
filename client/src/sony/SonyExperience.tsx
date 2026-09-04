import { ActivationProvider, useActivation } from '../context/ActivationContext';
import { SlackScene } from './SlackScene';
import { TeamsScene } from './TeamsScene';
import { ClaudeScene } from './ClaudeScene';
import { SceneNavigator } from './SceneNavigator';
import { useScene } from './useScene';
import './sony.css';

/**
 * Path-gated Sony Headless 360 experience (mounted only at
 * /sony-headless-360). This is the ONLY place ActivationProvider is mounted —
 * the legacy `/` experience never sees it.
 *
 * HX-4: Slack → Teams → Claude scenes with a hash-driven three-segment
 * navigator. All scenes consume the same authoritative Activation context. No
 * swipe, presenter/reset/Live-Mock controls, live Claude, or external calls.
 */
function SonyExperienceInner() {
  const { status, context, activationUrl, error } = useActivation();
  const { scene, setScene } = useScene();

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

  return (
    <div className="sony-shell">
      <div
        className="sony-scene-viewport"
        id={`sony-scene-${scene}`}
        role="tabpanel"
      >
        {scene === 'slack' && <SlackScene context={context} activationUrl={activationUrl} />}
        {scene === 'teams' && <TeamsScene context={context} activationUrl={activationUrl} />}
        {scene === 'claude' && <ClaudeScene context={context} activationUrl={activationUrl} />}
      </div>
      <SceneNavigator scene={scene} onSelect={setScene} />
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
