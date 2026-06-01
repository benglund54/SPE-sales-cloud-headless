import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { activeTheme } = useTheme();

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
    }
  }

  const isClaude = activeTheme === 'claude';
  const isSlack = activeTheme === 'slack';
  const placeholder = isClaude
    ? 'Write a message...'
    : isSlack
    ? 'Message # tv-rights-command'
    : 'Ask about rights deals, renewal risk, windows, or executive summary...';

  return (
    <div className="input-bar">
      <div className={`input-bar-inner ${isClaude ? 'claude-composer' : ''} ${isSlack ? 'slack-composer' : ''}`}>
        {isClaude && (
          <button
            className="claude-send-dot"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
          />
        )}
        <textarea
          ref={textareaRef}
          className="input-textarea"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        {isClaude && (
          <div className="claude-composer-footer">
            <button className="claude-plus-btn" aria-label="Add attachment">
              +
            </button>
            <div className="claude-tools">
              <span className="claude-model-pill">Sonnet 4.6</span>
              <button className="claude-tool-btn" aria-label="Voice input">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><line x1="12" y1="18" x2="12" y2="22" /></svg>
              </button>
              <button className="claude-tool-btn" aria-label="Audio controls">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="14" x2="4" y2="10"/><line x1="9" y1="18" x2="9" y2="6"/><line x1="14" y1="16" x2="14" y2="8"/><line x1="19" y1="20" x2="19" y2="4"/></svg>
              </button>
            </div>
          </div>
        )}
        {isSlack && (
          <div className="slack-composer-toolbar">
            <button className="slack-tool-btn"><b>B</b></button>
            <button className="slack-tool-btn"><i>I</i></button>
            <button className="slack-tool-btn"><u>U</u></button>
            <button className="slack-tool-btn">•</button>
            <button className="slack-tool-btn">1.</button>
            <button className="slack-tool-btn">🔗</button>
            <button className="slack-tool-btn">🙂</button>
            <span className="slack-toolbar-spacer" />
            <button className="slack-tool-btn">📎</button>
            <button className="slack-tool-btn">🎙</button>
          </div>
        )}
        {!isClaude && (
        <button
          className="send-button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
        )}
      </div>
    </div>
  );
}
