import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { InputBar } from './InputBar';

export function Chat() {
  const { messages, isTyping, sendMessage, streamingMessageId, streamedContent } = useChat();

  return (
    <div className="chat-container">
      <MessageList
        messages={messages}
        isTyping={isTyping}
        streamingMessageId={streamingMessageId}
        streamedContent={streamedContent}
      />
      <InputBar onSend={sendMessage} disabled={isTyping || !!streamingMessageId} />
    </div>
  );
}
