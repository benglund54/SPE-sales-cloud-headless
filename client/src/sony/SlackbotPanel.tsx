import { useState } from 'react';
import { useConversation } from './useConversation';
import { useFollowScroll } from './useFollowScroll';
import { SLACKBOT_PROMPT, SLACKBOT_STAGES, SLACKBOT_ANSWER } from './interactiveFixtures';
import { SlackbotLogo, SendIcon } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
}

/**
 * Slack fallback: the Slackbot right-side panel. The catch-up prompt is
 * preloaded in the panel composer (never the channel composer). On Send/Enter
 * it shows the user message, a brief native "Thinking" state, then reveals the
 * prepared three-section answer progressively. No Claude-style research steps.
 */
export function SlackbotPanel({ open, onClose, reducedMotion = false }: Props) {
  const [prompt, setPrompt] = useState(SLACKBOT_PROMPT);
  const convo = useConversation({
    progressStages: SLACKBOT_STAGES,
    sectionCount: SLACKBOT_ANSWER.length,
    reducedMotion,
    stageMs: reducedMotion ? 120 : 900,
  });
  const scrollRef = useFollowScroll<HTMLDivElement>(`${convo.phase}:${convo.revealed}`);

  if (!open) return null;

  return (
    <aside className="slk-bot" aria-label="Slackbot">
      <header className="slk-bot-head">
        <span className="slk-bot-avatar" aria-hidden="true"><SlackbotLogo size={22} alt="" /></span>
        <span className="slk-bot-title">Slackbot</span>
        <button className="slk-bot-close" onClick={onClose} aria-label="Close Slackbot">✕</button>
      </header>

      <div className="slk-bot-thread" ref={scrollRef}>
        {convo.submitted && (
          <div className="slk-bot-turn slk-bot-turn-user">
            <div className="slk-bot-bubble slk-bot-bubble-user">{SLACKBOT_PROMPT}</div>
          </div>
        )}

        {convo.phase === 'thinking' && (
          <div className="slk-bot-turn slk-bot-turn-bot">
            <span className="slk-bot-turn-avatar" aria-hidden="true"><SlackbotLogo size={18} alt="" /></span>
            <div className="slk-bot-thinking" role="status">
              <span className="slk-bot-thinking-dot" aria-hidden="true" /> Thinking…
            </div>
          </div>
        )}

        {(convo.phase === 'revealing' || convo.phase === 'done') && (
          <div className="slk-bot-turn slk-bot-turn-bot">
            <span className="slk-bot-turn-avatar" aria-hidden="true"><SlackbotLogo size={18} alt="" /></span>
            <div className="slk-bot-answer">
              {SLACKBOT_ANSWER.slice(0, convo.phase === 'done' ? SLACKBOT_ANSWER.length : convo.revealed).map((s) => (
                <div key={s.heading} className="slk-bot-section">
                  <div className="slk-bot-section-h">{s.heading}</div>
                  <p className="slk-bot-section-b">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="slk-bot-composer">
        <textarea
          className="slk-bot-field"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={convo.handleComposerKeyDown}
          disabled={convo.busy || convo.phase === 'done'}
          rows={2}
          aria-label="Message Slackbot"
        />
        <button
          className="slk-bot-send"
          onClick={convo.submit}
          disabled={convo.busy || convo.phase === 'done' || convo.submitted}
          aria-label="Send"
        >
          <SendIcon size={16} />
        </button>
      </div>
    </aside>
  );
}
