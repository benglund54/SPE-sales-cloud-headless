import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  sf: {
    loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com',
    username: process.env.SF_USERNAME || '',
    password: process.env.SF_PASSWORD || '',
    securityToken: process.env.SF_SECURITY_TOKEN || '',
    clientId: process.env.SF_CLIENT_ID || '',
    clientSecret: process.env.SF_CLIENT_SECRET || '',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },

  // Sony Headless 360 — single source of truth for HX-1 config.
  // The Activation URL is a browser-visible click destination only; it is
  // sourced here (never hardcoded in the contract) and no Salesforce
  // credential, token, or session ever accompanies it to the browser.
  sony: {
    // Optional. Unset => the client renders the Activation link as inert.
    salesforceActivationUrl: process.env.SALESFORCE_ACTIVATION_URL || '',
    // Model used by the (later) optional live executive-brief path.
    claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-5',
    // Master gate for the (later) optional live path. Off unless === 'true'.
    liveExecBriefEnabled: process.env.LIVE_EXEC_BRIEF === 'true',
    // Presentation-safe timeout (ms) for the (later) optional live path.
    claudeTimeoutMs: parseInt(process.env.CLAUDE_TIMEOUT_MS || '6000', 10),
  },
};

/**
 * Resolve the browser-visible Activation URL at request time (not frozen at
 * module load). Returns null when unset. Reading it live lets a presenter set
 * SALESFORCE_ACTIVATION_URL and have the next request reflect it without a
 * restart, and keeps this the single source of truth for the value.
 */
export function resolveSalesforceActivationUrl(): string | null {
  const url = process.env.SALESFORCE_ACTIVATION_URL;
  return url && url.length > 0 ? url : null;
}
