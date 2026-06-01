import { useState } from 'react';
import type { ChatMessage } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownRenderer } from './MarkdownRenderer';
import { formatTimestamp } from '../../utils/formatters';
import { ClaudeLogo } from '../icons/ClaudeLogo';
import { ChatGPTLogo } from '../icons/ChatGPTLogo';
import { GeminiLogo } from '../icons/GeminiLogo';
import { SlackBotLogo } from '../icons/SlackBotLogo';
import { CopilotLogo } from '../icons/CopilotLogo';

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
  displayContent?: string;
}

export function MessageBubble({ message, isStreaming, displayContent }: Props) {
  const { themeConfig } = useTheme();
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const isUser = message.role === 'user';
  const isFlat = themeConfig.messageStyle === 'flat';
  const content = displayContent ?? message.content;

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-agent'} ${isFlat ? 'message-flat' : 'message-bubble'}`}>
      {!isUser && (
        <div className={`message-avatar agent-avatar avatar-${themeConfig.avatarShape}`}>
          {themeConfig.agentName === 'Claude' ? <ClaudeLogo size={20} /> : themeConfig.agentName === 'ChatGPT' ? <ChatGPTLogo size={20} /> : themeConfig.agentName === 'Sales Agent' ? <GeminiLogo size={20} /> : themeConfig.agentName === 'Slackbot' ? <SlackBotLogo size={32} /> : themeConfig.agentName === 'Copilot' ? <CopilotLogo size={30} /> : themeConfig.agentName[0]}
        </div>
      )}
      <div className="message-body">
        {isFlat && !isUser && (
          <div className="message-meta">
            <span className="message-sender">{themeConfig.agentName}</span>
            <span className="message-time">{formatTimestamp(message.timestamp)}</span>
          </div>
        )}
        <div className="message-content">
          {isUser ? (
            <p>{content}</p>
          ) : (
            <>
              <MarkdownRenderer content={content} />
              {isStreaming && <span className="streaming-cursor" />}
            </>
          )}
        </div>
        {!isStreaming && message.toolResults && message.toolResults.length > 0 && (
          <div className="tool-results">
            <button
              className="tool-results-toggle"
              onClick={() => setToolsExpanded(!toolsExpanded)}
            >
              {toolsExpanded ? '▾' : '▸'} Used {message.toolResults.length} tool{message.toolResults.length > 1 ? 's' : ''}
            </button>
            {toolsExpanded && (
              <ul className="tool-results-list">
                {message.toolResults.map((tr: { summary: string }, i: number) => (
                  <li key={i}>{tr.summary}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {!isFlat && !isStreaming && (
          <span className="message-time-inline">{formatTimestamp(message.timestamp)}</span>
        )}
      </div>
      {isUser && (
        <div className={`message-avatar user-avatar avatar-${themeConfig.avatarShape}`}>
          Y
        </div>
      )}
    </div>
  );
}
