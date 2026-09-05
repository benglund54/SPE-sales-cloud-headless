/**
 * Format a submission timestamp the Teams way: "Today 7:44 AM".
 * Uses the browser locale with an explicit 12-hour clock. Pure and
 * deterministic given a fixed epoch (tests pass a fixed value), so the stored
 * timestamp never drifts as later sections render.
 */
export function formatTeamsTime(epochMs: number): string {
  const d = new Date(epochMs);
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  return `Today ${time}`;
}
