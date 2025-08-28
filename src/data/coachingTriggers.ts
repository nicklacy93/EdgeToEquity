export const coachingTriggers = {
    idle: [
        "You're not alone in needing breaks. Just make sure they're intentional.",
        "Idle time is a chance to reset your focus. You've got this.",
        "Even silence is a signal. What is your next best move?",
        "Use this pause to reset, not retreat.",
        "When nothing is happening, preparation is everything."
    ],
    losingStreak: [
        "Every champion has rough patches — this streak doesn't define you.",
        "Discipline in losses is what separates pros from amateurs.",
        "Losing streaks test character, not ability.",
        "Your risk management is keeping these losses manageable.",
        "This streak is data. Let's learn from it, not fear it."
    ],
    drawdown: [
        "Drawdowns hurt, but they're not permanent. Stay calm and recalibrate.",
        "Managing your emotions *during* a drawdown is what builds real skill.",
        "You're in the storm — but you're not lost. Follow your rules.",
        "Your next trade doesn't need to make it all back — it just needs to be your best decision.",
        "Deep breath. Refocus. The only way out is forward."
    ],
    streak: [
        "You're on a run! Want to analyze what's working?",
        "Momentum is building. Let's ride the edge smartly.",
        "Success is great – don't rush your next move.",
        "Consistency is key. Let's stick to the plan.",
        "8-day streak! Your consistency is building real expertise."
    ],
    risk: [
        "Sizing up? Let's confirm it aligns with your edge.",
        "You're close to risk max. Want to recenter?",
        "Risk breach alert. Stop and reassess position sizes.",
        "Let's double-check your exposure.",
        "Risk management is crucial. Want to review your plan?"
    ],
    fatigue: [
        "Feeling sharp? Time to finish strong.",
        "Tired mind = costly trades. Want a reset?",
        "Mental fatigue detected. Take a mindful break.",
        "Let's keep decisions clean and intentional.",
        "Reflection helps consolidate learning. Ready for a break?"
    ],
    journaling: [
        "Great session! Want to capture your insights in a journal entry?",
        "Your future self will thank you for this journal entry.",
        "Don't skip reflection – it's key to growth.",
        "Journaling now will help you improve faster.",
        "Want to capture today's insight while it's fresh?"
    ]
};

export function getNudgeForMood(mood: keyof typeof coachingTriggers): string {
    const nudges = coachingTriggers[mood];
    return nudges[Math.floor(Math.random() * nudges.length)];
}

export function getBestTrigger(session: any): keyof typeof coachingTriggers {
    if (session.journalEntries === 0) return "journaling";
    if (session.learningStreak >= 5) return "streak";
    if (session.mood === "fatigue") return "fatigue";
    if (session.mood === "alert") return "drawdown";
    return "streak";
} 
