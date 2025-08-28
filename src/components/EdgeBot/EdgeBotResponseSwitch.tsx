'use client';
import StrategyResponseCard from './AgentCards/StrategyResponseCard';
import PsychologyResponseCard from './AgentCards/PsychologyResponseCard';
import ExplanationResponseCard from './AgentCards/ExplanationResponseCard';
import DebuggingResponseCard from './AgentCards/DebuggingResponseCard';

export default function EdgeBotResponseSwitch({ agent, response }: { agent: string, response: any }) {
  switch(agent) {
    case 'strategy_generator': return <StrategyResponseCard data={response} />;
    case 'psychology_analyzer': return <PsychologyResponseCard data={response} />;
    case 'strategy_explainer': return <ExplanationResponseCard data={response} />;
    case 'ai_debugger': return <DebuggingResponseCard data={response} />;
    default: return <div className='text-sm text-muted'>Unknown agent response.</div>;
  }
}
