/**
 * Sony Sales Cloud — all new-experience copy lives here so it can be changed
 * after Sony discovery without touching component code. Phase 1 is a visual
 * foundation only: nothing here implies a live Salesforce connection.
 */
export const SALES_CLOUD_CONFIG = {
  /** Workspace / team label shown in the conversation header. */
  team: 'Sony Sales',
  /** Assistant display name (sidebar, header, message sender). */
  assistantName: 'Sony Sales Assistant',
  /** Two-letter avatar mark (plain initials; no logo asset). */
  assistantInitials: 'SA',
  /** Sidebar preview line under the assistant name. */
  assistantPreview: 'Preview',
  /** Signed-in user shown in the (simulated) top bar. */
  userName: 'Sony Sales User',
  userInitials: 'SU',
  /** Status badge next to the assistant name. */
  statusLabel: 'Preview · not connected',
  composerPlaceholder: 'Type a message',
  emptyTitle: 'Sony Sales Assistant',
  emptyIntro: 'Ask about accounts, opportunities, contacts, and activities once Salesforce is connected.',
  suggestionsHeading: 'Examples of what you’ll be able to ask',
  /** Example prompts only — they fill the composer; they do not run CRM actions. */
  suggestedPrompts: [
    'Show my open opportunities',
    'What activities are due today?',
    'Which deals need attention?',
    'Prepare me for an account meeting',
  ],
  suggestionsNote: 'Examples only — Salesforce is not connected yet.',
  /** Shown in place of an answer when a message is sent in Phase 1. */
  notConnectedNotice:
    'Salesforce is not connected yet, so this message was not sent anywhere and no CRM data was looked up.',
  disclosure: 'Simulated Teams-style interface · not a Microsoft Teams integration',
} as const;
