/**
 * Deterministic local fixtures for the interactive scenes (HX-6V-D).
 *
 * All copy is derived from the governed Sony IP360 Canvas. No live model,
 * Slack, Microsoft, Salesforce, or Anthropic call. Progress-stage strings are
 * presentation states — not hidden chain-of-thought — and must not imply
 * searches, tools, or external system activity.
 */

// ---- Preloaded prompts (exact, per spec) ---------------------------------
export const TEAMS_PROMPT = 'What does PlayStation need to decide?';
export const CLAUDE_PROMPT =
  'Prepare a one-minute executive brief for the Spider-Man: Brand New Day opportunity.';
export const SLACKBOT_PROMPT =
  'Catch me up on the Spider-Man EMEA opportunity and what’s still pending.';

// ---- Progress-stage sequences --------------------------------------------
export const TEAMS_STAGES = [
  'Reviewing governed Sony IP360 context…',
  'Evaluating PlayStation participation requirements…',
  'Separating permitted signals from pending approvals…',
];

export const CLAUDE_STAGES = [
  'Working on it…',
  'Thinking…',
  'Reviewing governed Sony IP360 context…',
  'Organizing grounded facts and pending decisions…',
  'Drafting the executive recommendation…',
];

export const SLACKBOT_STAGES = ['Thinking…'];

// ---- Slackbot catch-up answer (3 governed sections, from the Canvas) ------
export interface AnswerSection {
  heading: string;
  body: string;
}

export const SLACKBOT_ANSWER: AnswerSection[] = [
  {
    heading: 'The opportunity',
    body:
      'The EMEA Spider-Man Connected Fan Moment is a proposed, coordinated fan experience across Sony Pictures, PlayStation, and Sony Music, grounded in a 1.85M qualified aggregate EMEA audience. The working concept is a limited-edition Brand New Day PlayStation Fan Pack — an exclusive PlayStation reward, a physical Spider-Man collectible, Sony Pictures bonus content, and a Sony Music experience. Sony Pictures leads with current Spider-Man: Brand New Day content; the Fan Pack remains proposed and subject to PlayStation and Sony Music participation, rights review, and approval.',
  },
  {
    heading: 'Why it matters',
    body:
      'It ranks #1 among qualified opportunities (Opportunity / Priority Score 91.58), with an Engagement Score of 82.3 and a Cross-Affinity Score of 84. Sustained PlayStation Spider-Man engagement, Spider-Verse film/streaming affinity, and soundtrack-listening affinity align into a credible near-term planning window. These are modeled signals, not guaranteed results.',
  },
  {
    heading: 'What is still pending',
    body:
      'PlayStation and Sony Music participation, accountable owners, the EMEA operating window, eligible experiences, and rights review are all unresolved. The activation remains Draft — no audience activated and no customer communication sent.',
  },
];

// Section counts for progressive reveal in the artifact-based scenes. The
// Teams PlayStation card and the Claude brief reveal their existing sections;
// these counts drive the reveal cadence, not the content.
// Finer progressive reveal for a natural downward build (HX-6V-F):
// 1 why · 2 metrics · 3 ownership/lifecycle · 4 decisions · 5 permitted ·
// 6 restricted · 7 banner+Salesforce action.
export const TEAMS_SECTION_COUNT = 7;
// Finer reveal for a natural downward build (HX-6V-J) — nine increments in
// reading order: 1 lead-in sentence (in the scene) · 2 header
// (label/title/subtitle) · 3 recommendation · 4 grounded facts · 5 connected
// value · 6 decisions · 7 risks · 8 draft banner · 9 Salesforce action (last).
// The scene reveals the lead-in at step 1, then passes (revealed - 1) to the
// brief, which gates its eight steps. The brief still renders exactly five
// sony-brief-section cards.
export const CLAUDE_SECTION_COUNT = 9;

