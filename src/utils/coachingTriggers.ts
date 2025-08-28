import { ChatMessageWithMeta } from "@/types/ChatTypes";

export interface CoachingTrigger {
  condition: (messages: ChatMessageWithMeta[]) => boolean;
  response: string;
  tag: string;
}

export const coachingTriggers: CoachingTrigger[] = [
  {
    tag: "drawdownPattern",
    condition: (messages) =>
      messages.filter(m => m.sender === "user" && m.message.toLowerCase().includes("drawdown")).length >= 2,
    response: "?? Noticing repeated drawdown mentions. Want to reset your focus or review strategy?",
  },
  {
    tag: "inputOverload",
    condition: (messages) =>
      messages.length >= 8 && messages.slice(-3).every(m => m.sender === "user"),
    response: "?? You've been input-heavy. Want a quick summary or strategy clarification?",
  },
  {
    tag: "noBotResponse",
    condition: (messages) =>
      messages.length >= 4 &&
      messages.slice(-4).every(m => m.sender === "user"),
    response: "?? Haven’t responded in a bit — want to prompt EdgeBot for insight?",
  }
];

export function evaluateTriggers(messages: ChatMessageWithMeta[], firedTags: Set<string>): CoachingTrigger | null {
  for (const trigger of coachingTriggers) {
    if (!firedTags.has(trigger.tag) && trigger.condition(messages)) {
      return trigger;
    }
  }
  return null;
}
