import { isSafeActivationUrl } from './activationUrl';

interface Props {
  url: string | null;
  label: string;
}

/**
 * The single functional action in the Slack scene:
 * "Review governed activation in Salesforce".
 *
 * - When `url` is a valid absolute HTTPS URL, renders a real anchor that opens
 *   in a new tab with rel="noopener noreferrer".
 * - Otherwise renders a clearly-unavailable, non-clickable control (no href,
 *   aria-disabled) so the experience is never blocked by a missing/invalid URL.
 */
export function ActivationLink({ url, label }: Props) {
  const safe = isSafeActivationUrl(url);

  if (safe) {
    return (
      <a
        className="sony-activation-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="activation-link"
      >
        <span className="sony-activation-link-icon" aria-hidden="true">↗</span>
        {label}
      </a>
    );
  }

  return (
    <span
      className="sony-activation-link sony-activation-link-disabled"
      aria-disabled="true"
      data-testid="activation-link-disabled"
      title="Governed activation link is not configured"
    >
      <span className="sony-activation-link-icon" aria-hidden="true">↗</span>
      {label}
      <span className="sony-activation-link-note">Not available</span>
    </span>
  );
}
