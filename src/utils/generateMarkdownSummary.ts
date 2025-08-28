export interface SessionExportData {
  date: string;
  moodSummary: string;
  marketContext: string;
  confidence: string;
  metrics: {
    winRate: string;
    edgeScore: string;
    rrRatio: string;
    execution: string;
  };
  emotionalFlow: string[];
  messages: { sender: string; content: string }[];
  journalTags: string[];
  behavioralNotes: string[];
  keyInsights: string[];
  followUps: string[];
  walkthrough?: string;
}

export function generateMarkdownSummary(data: SessionExportData): string {
  const {
    date,
    moodSummary,
    marketContext,
    confidence,
    metrics,
    emotionalFlow,
    messages,
    journalTags,
    behavioralNotes,
    keyInsights,
    followUps,
    walkthrough,
  } = data;

  const chatMarkdown = messages
    .map((msg) => `### ${msg.sender === 'user' ? '?? Trader' : '?? EdgeBot'}\n${msg.content}`)
    .join('\n\n');

  return `# ?? EdgeBot Session Export

## Session Overview
**Date:** ${date}  
**Market Context:** ${marketContext}  
**Emotional Journey:** ${moodSummary}  

## ?? Performance Metrics
- **Win Rate:** ${metrics.winRate}
- **Edge Score:** ${metrics.edgeScore}
- **Risk-Reward Ratio:** ${metrics.rrRatio}
- **Execution Accuracy:** ${metrics.execution}

## ?? Conversation Flow
${chatMarkdown}

**Current Confidence Level:** ${confidence}

## ?? Mood Timeline
- ${emotionalFlow.join(' ? ')}

## ?? Walkthrough Summary
${walkthrough || "No summary recorded."}

## ?? Behavioral Tags
${journalTags.map((tag) => `- \`${tag}\``).join('\n')}

## ?? Observations
${behavioralNotes.map((b) => `- ${b}`).join('\n')}

## ?? Key Insights
${keyInsights.map((i) => `- ${i}`).join('\n')}

## ?? Follow-up Actions
${followUps.map((f) => `- ${f}`).join('\n')}
`;
}
