
// src/data/coachingTriggers.ts

interface CoachingTrigger {
  type: string;
  label: string;
  nudges: string[];
}

const coachingTriggers: CoachingTrigger[] = [
  {
    type: "losing_streak",
    label: "📉 Losing Streak",
    nudges: [
      "Every champion has rough patches — this streak doesn't define your skills, it's just teaching you something new.",
      "I'm seeing the discipline in how you're handling these losses. That composure is what separates pros from amateurs.",
      "Losing streaks test character, not ability. You're still the same trader who had those winning days.",
      "Your risk management is keeping these losses manageable — that's exactly how you weather storms like this.",
      "Sometimes the market just doesn't speak our language for a while. Your edge is still there, waiting for the right conditions."
    ]
  },
  {
    type: "drawdown",
    label: "😤 Drawdown / Frustration",
    nudges: [
      "I can feel that frustration through the screen. Take a breath — this feeling will pass, but what you learn from it stays forever.",
      "Disappointment means you care deeply about this. That passion is actually one of your greatest trading assets.",
      "Regret is just your brain trying to protect you for next time. What's it trying to tell you about this situation?",
      "Every trader I know has felt exactly what you're feeling right now. You're not alone in this.",
      "This sting you're feeling? It's not failure talking — it's your standards reminding you how much you've grown."
    ]
  },
  {
    type: "hesitation",
    label: "🤔 Hesitation / Overthinking",
    nudges: [
      "I notice you're thinking hard about this one. Sometimes your gut knows before your brain catches up — what's that first instinct saying?",
      "Analysis is powerful, but paralysis is expensive. What would you do if you had to decide in the next 30 seconds?",
      "All that thinking shows you care about making good decisions. Trust that preparation — you know more than you think.",
      "Your caution might be wisdom in disguise. If something feels off, that's valuable information too.",
      "Perfect setups are rare, but good enough setups with solid risk management can be plenty profitable."
    ]
  },
  {
    type: "revenge",
    label: "🔥 Revenge Trading",
    nudges: [
      "I'm sensing some fire after that last trade. That energy is powerful — let's channel it into a really solid setup instead of rushing.",
      "The urge to 'get even' is so human, but the market doesn't owe us anything. Your next trade deserves a fresh perspective.",
      "I know you want to prove something right now, but your best revenge is patient, disciplined trading that builds long-term wealth.",
      "That aggressive feeling? It's not wrong, but maybe dial down the position size until we're thinking clearly again.",
      "The market will give you better opportunities to win when you're trading from strategy, not emotion."
    ]
  },
  {
    type: "confidence",
    label: "🎯 Confidence Boost",
    nudges: [
      "That execution was beautiful! I love seeing your patience and discipline pay off like this.",
      "You're in a great flow state right now. This is what happens when preparation meets opportunity.",
      "Three solid trades in a row — your consistency is becoming your superpower. Stay humble, stay hungry.",
      "That read on the market was spot-on. Your instincts are getting sharper with every session.",
      "Winning feels good, but I'm more impressed by how you're staying level-headed. That's champion mindset right there."
    ]
  },
  {
    type: "idle",
    label: "😴 Low Activity / Idle",
    nudges: [
      "Taking your time out there? Sometimes the best action is no action — patience is a trading skill too.",
      "Market's been quiet, or are you just being selective? Either way, I appreciate the discipline.",
      "Waiting for the right setup shows real maturity. Quality over quantity always wins in the long run.",
      "I'm here when you're ready to dive back in. Sometimes the market needs time to set up properly.",
      "Boredom in trading is often a sign you're being smart about entries. Not every moment needs a trade."
    ]
  },
  {
    type: "burnout",
    label: "😵‍💫 Burnout Signs",
    nudges: [
      "I hear the exhaustion in your words. Maybe it's time to step back and remember why you started this journey in the first place.",
      "Burnout is your mind's way of saying you need to recharge. Even the best traders take breaks to come back stronger.",
      "Feeling fed up usually means you're pushing too hard. What would happen if you traded with half the intensity for a while?",
      "This game is a marathon, not a sprint. Your future self will thank you for taking care of your mental energy today.",
      "Sometimes the best trading decision is to not trade at all. Your capital will be here when you're ready to return refreshed."
    ]
  }
];

export default coachingTriggers;
