import { ChatMessageWithMeta } from "@/types/ChatTypes";

export function exportChatAsJSON(messages: ChatMessageWithMeta[], agent: string) {
  const blob = new Blob([JSON.stringify({ agent, messages }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${agent}_chat_export.json`;
  link.click();
}

export function exportChatAsMarkdown(messages: ChatMessageWithMeta[], agent: string) {
  const md = messages.map((msg) => {
    const role = msg.sender === 'user' ? '**You**' : `**${msg.provider || 'Bot'}**`;
    return `${role}: ${msg.message}`;
  }).join("\n\n");

  const blob = new Blob([`# EdgeBot Journal: ${agent}\n\n${md}`], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${agent}_chat_journal.md`;
  link.click();
}
