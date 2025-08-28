import type { ChatMessage } from '@/types/ChatTypes';

export function exportChatAsJSON(messages: ChatMessage[]) {
  const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'edgebot_chat.json';
  link.href = url;
  link.click();
}

export function exportChatAsMarkdown(messages: ChatMessage[]) {
  const markdown = messages.map(msg => {
    const tag = msg.sender === 'user' ? '??' : msg.messageType === 'nudge' ? '??' : '??';
    return ** **: ;
  }).join('\n\n');

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'edgebot_chat.md';
  link.href = url;
  link.click();
}
