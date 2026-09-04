import { ActivationProvider, useActivation } from '../context/ActivationContext';
import { SlackScene } from './SlackScene';
import './sony.css';

/**
 * Path-gated Sony Headless 360 experience (mounted only at
 * /sony-headless-360). This is the ONLY place ActivationProvider is mounted —
 * the legacy `/` experience never sees it.
 *
 * HX-2 renders the Slack scene only. No Teams/Claude scene, no navigator, no
 * swipe, no presenter controls, no live Claude.
 */
function SonyExperienceInner() {
  const { status, context, activationUrl, error } = useActivation();

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

  return <SlackScene context={context} activationUrl={activationUrl} />;
}

export function SonyExperience() {
  return (
    <ActivationProvider>
      <SonyExperienceInner />
    </ActivationProvider>
  );
}
