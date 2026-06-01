import { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../types';
import { sendChatMessage } from '../utils/api';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm your distribution assistant for Luminary teams. I can help you review rights pipeline, flag renewal risk, and prep executive-ready licensing decisions.\n\n- **Show current TV rights deals by risk and value**\n- **Summarize renewal exposure for this quarter**\n- **Highlight licensing window conflicts by territory**\n- **Draft an executive readout for leadership**",
  timestamp: new Date().toISOString(),
};

const WORDS_PER_TICK = 3;
const TICK_MS = 30;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState('');
  const streamTimerRef = useRef<number | null>(null);

  const startStreaming = useCallback((fullContent: string, messageId: string) => {
    const words = fullContent.split(/(\s+)/);
    let index = 0;
    setStreamingMessageId(messageId);
    setStreamedContent('');

    const tick = () => {
      index += WORDS_PER_TICK;
      const partial = words.slice(0, index).join('');
      setStreamedContent(partial);

      if (index >= words.length) {
        setStreamingMessageId(null);
        setStreamedContent('');
      } else {
        streamTimerRef.current = window.setTimeout(tick, TICK_MS);
      }
    };

    streamTimerRef.current = window.setTimeout(tick, TICK_MS);
  }, []);

  async function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(content, [
        ...messages,
        userMessage,
      ]);

      setIsTyping(false);
      setMessages((prev) => [...prev, response.message]);
      startStreaming(response.message.content, response.message.id);
    } catch (error) {
      setIsTyping(false);
      const errorMsg = error instanceof Error ? error.message : 'Something went wrong';
      const errMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMessage]);
    }
  }

  function clearChat() {
    if (streamTimerRef.current) {
      clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setStreamingMessageId(null);
    setStreamedContent('');
    setMessages([WELCOME_MESSAGE]);
  }

  return { messages, isTyping, sendMessage, clearChat, streamingMessageId, streamedContent };
}
