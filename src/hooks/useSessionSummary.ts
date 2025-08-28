import { useSessionStore } from "./useSessionStore";

export function useSessionSummary() {
  const { messages } = useSessionStore();

  const summary = () => {
    const userMessages = messages.filter((m) => m.sender === "user");
    const botMessages = messages.filter((m) => m.sender === "bot");

    const topics = [...new Set(userMessages.map((m) => m.content.split(" ")[0]))].slice(0, 3);
    const totalExchanges = messages.length;
    const mostRecent = userMessages[userMessages.length - 1]?.content ?? "N/A";

    return {
      totalExchanges,
      mostRecent,
      topTopics: topics,
    };
  };

  return { summary: summary() };
}
