import { useTheme } from '../../hooks/useTheme';
import { ClaudeLogo } from '../icons/ClaudeLogo';
import { ChatGPTLogo } from '../icons/ChatGPTLogo';
import { GeminiLogo } from '../icons/GeminiLogo';
import { SlackBotLogo } from '../icons/SlackBotLogo';
import { CopilotLogo } from '../icons/CopilotLogo';

export function TypingIndicator() {
  const { themeConfig } = useTheme();

  return (
    <div className="typing-indicator-wrapper">
      <div className="message-avatar agent-avatar">
        {themeConfig.agentName === 'Claude' ? <ClaudeLogo size={20} /> : themeConfig.agentName === 'ChatGPT' ? <ChatGPTLogo size={20} /> : themeConfig.agentName === 'Sales Agent' ? <GeminiLogo size={20} /> : themeConfig.agentName === 'Slackbot' ? <SlackBotLogo size={32} /> : themeConfig.agentName === 'Copilot' ? <CopilotLogo size={30} /> : themeConfig.agentName[0]}
      </div>
      <div className="typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
