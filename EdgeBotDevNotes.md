# ?? EdgeBot Emotional Intelligence System - Developer Notes

## ?? Overview
EdgeBot is designed to feel like a sentient AI trading companion. This file documents the architecture, components, and emotional logic system powering EdgeBot’s adaptive personality.

---

## ?? Mood States & Triggers

| Mood        | Trigger Conditions                             | Personality         |
|-------------|-------------------------------------------------|---------------------|
| Confident   | Win rate > 70% + PnL trending up                | Encouraging         |
| Focused     | Win rate 45–70% + PnL flat                      | Strategic/Neutral   |
| Supportive  | Win rate < 45% or PnL trending down             | Empathetic/Calming  |
| Alert       | Overtrading or near risk limit                  | Cautious/Directive  |

---

## ?? Mood-Based UI Impact

| Component                 | Behavior per Mood                          |
|--------------------------|--------------------------------------------|
| `EdgeBotGreetingCard`    | Dynamic greeting + accent glow             |
| `FloatingEdgeBot`        | Glow color + hover insight popup           |
| `EnhancedKPICard`        | Background gradient matches mood           |
| `RecentActivityCard`     | Border glow + impact-based text color      |
| `SwipeableKPICards`      | Gradient styling + animated entry          |
| `CollapsibleChartSection`| Mood-colored toggle + expansion            |
| `EdgeBotMoodRing`        | Glow dot or pulse showing emotional state  |

---

## ?? State Management

- Hook: `useEdgeBotState.ts`
- Context Provider: `EdgeBotMoodContext.tsx`
- Persistence: `localStorage` with session restoration
- Future: Sync to backend for deeper AI memory

---

## ?? AI Behavior Examples

- `Confident`: “You’re in the zone! Ready to scale?”
- `Supportive`: “This is where growth happens. Let’s reset.”
- `Alert`: “Caution – you’re nearing your daily risk limit.”

---

## ?? Future Expansions

- Time-of-day awareness (“Morning open” vs “Lunch fade”)
- Energy-level context (“Focused”, “Tired”, “Overwhelmed”)
- AI coaching preferences (tone, emojis, privacy level)
- Emotional pattern tracking (what works best under stress)
- Mood memory graph (emotional performance journal)

---

## ?? Developer Tips

- Use `useEdgeBotMood()` anywhere to access current state
- Add new moods via `types/edgebot.d.ts` and update logic
- Ensure framer-motion is available in all animated components

---
