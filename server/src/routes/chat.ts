import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
import { processMockChat } from '../services/mockAgent.js';
import type { ChatRequest, ChatResponse } from '../types/index.js';

let useLiveAgent = true;

const EXACT_DISTRIBUTION_DEAL_PROMPTS = new Set([
  'give me my active distribution deals',
  'give me my active disribution deals',
  'what distribution deals need my attention',
  'what disribution deals need my attention',
  'show my active distribution deals',
  'show my active disribution deals',
  'what are my current tv rights deals',
  'show me tv rights deals',
]);

const DISTRIBUTION_DEALS_INTENT =
  /(active|current|open).*(distribution|disribution|tv rights|rights).*(deals|renewals)|what.*(distribution|disribution) deals.*attention|show.*active.*(distribution|disribution) deals|current.*tv rights deals|show me.*tv rights deals/;

export const chatRouter = Router();

chatRouter.get('/agent-mode', (_req, res) => {
  res.json({ live: useLiveAgent });
});

chatRouter.post('/agent-mode', (req, res) => {
  const { live } = req.body;
  if (typeof live === 'boolean') {
    useLiveAgent = live;
    console.log(`Agent mode switched to ${live ? 'LIVE' : 'MOCK'}`);
  }
  res.json({ live: useLiveAgent });
});

chatRouter.post('/chat', async (req, res) => {
  const { message, conversationHistory } = req.body as ChatRequest;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    let result;
    const normalizedMessage = message
      .toLowerCase()
      .trim()
      .replace(/[?!.,]/g, '')
      .replace(/\s+/g, ' ');

    // Force TV rights distribution experience for high-confidence distribution prompts,
    // regardless of Live/Mock mode, so demo behavior stays deterministic.
    if (
      EXACT_DISTRIBUTION_DEAL_PROMPTS.has(normalizedMessage) ||
      normalizedMessage.match(DISTRIBUTION_DEALS_INTENT)
    ) {
      result = await processMockChat('show me tv rights deals', conversationHistory || []);
    } else

    if (useLiveAgent && config.anthropic.apiKey) {
      const { processChat } = await import('../services/claude.js');
      result = await processChat(message, conversationHistory || []);
    } else {
      result = await processMockChat(message, conversationHistory || []);
    }

    const response: ChatResponse = {
      message: {
        id: uuidv4(),
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toISOString(),
        toolResults: result.toolResults.length > 0 ? result.toolResults : undefined,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMsg });
  }
});
