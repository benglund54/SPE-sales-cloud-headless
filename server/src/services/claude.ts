import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import { toolDefinitions, executeTool } from '../tools/index.js';
import { SYSTEM_PROMPT } from '../prompts/system.js';
import type { ChatMessage, ToolCallSummary } from '../types/index.js';

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

const MAX_TOOL_ITERATIONS = 10;

export async function processChat(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<{ content: string; toolResults: ToolCallSummary[] }> {
  const messages: Anthropic.MessageParam[] = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  messages.push({ role: 'user', content: userMessage });

  const allToolResults: ToolCallSummary[] = [];

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find((b) => b.type === 'text');
      return {
        content: textBlock ? textBlock.text : '',
        toolResults: allToolResults,
      };
    }

    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      );

      messages.push({ role: 'assistant', content: response.content });

      const toolResultContents: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        try {
          const { result, summary } = await executeTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );

          allToolResults.push({
            toolName: toolUse.name,
            input: toolUse.input as Record<string, unknown>,
            summary,
          });

          toolResultContents.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          });
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : 'Unknown error';

          toolResultContents.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: errorMsg }),
            is_error: true,
          });
        }
      }

      messages.push({ role: 'user', content: toolResultContents });
      continue;
    }

    const textBlock = response.content.find((b) => b.type === 'text');
    return {
      content: textBlock ? textBlock.text : 'I encountered an unexpected response.',
      toolResults: allToolResults,
    };
  }

  return {
    content: 'I made too many tool calls. Please try a simpler question.',
    toolResults: allToolResults,
  };
}
