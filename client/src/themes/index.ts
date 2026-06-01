import type { ThemeConfig, ThemeId } from '../types';

export const themes: Record<ThemeId, ThemeConfig> = {
  claude: {
    id: 'claude',
    name: 'Claude',
    hasSidebar: true,
    hasHeader: true,
    hasAppRail: false,
    messageStyle: 'bubble',
    avatarShape: 'circle',
    agentName: 'Claude',
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    hasSidebar: true,
    hasHeader: true,
    hasAppRail: false,
    messageStyle: 'bubble',
    avatarShape: 'circle',
    agentName: 'ChatGPT',
  },
  google: {
    id: 'google',
    name: 'Google Chat',
    hasSidebar: true,
    hasHeader: true,
    hasAppRail: false,
    messageStyle: 'bubble',
    avatarShape: 'circle',
    agentName: 'Sales Agent',
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    hasSidebar: true,
    hasHeader: true,
    hasAppRail: true,
    messageStyle: 'flat',
    avatarShape: 'rounded-square',
    agentName: 'Slackbot',
  },
  teams: {
    id: 'teams',
    name: 'Teams',
    hasSidebar: true,
    hasHeader: true,
    hasAppRail: true,
    messageStyle: 'flat',
    avatarShape: 'circle',
    agentName: 'Copilot',
  },
};

export const themeList: ThemeConfig[] = Object.values(themes);
