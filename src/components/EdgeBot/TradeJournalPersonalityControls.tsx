'use client';

import { PersonalityProfile } from '@/types/ChatTypes';

interface Props {
  personality: PersonalityProfile;
  onChange: (p: PersonalityProfile) => void;
}

export default function TradeJournalPersonalityControls({ personality, onChange }: Props) {
  return (
    <div className='space-y-2 p-2 border rounded bg-muted/50'>
      <label>
        Tone:
        <select
          value={personality.preferredTone}
          onChange={e => onChange({ ...personality, preferredTone: e.target.value })}
          className='ml-2 rounded border px-2 py-1'
        >
          <option value='encouraging'>Encouraging</option>
          <option value='tough-love'>Tough Love</option>
          <option value='neutral'>Neutral</option>
        </select>
      </label>

      <label>
        Style:
        <select
          value={personality.coachStyle}
          onChange={e => onChange({ ...personality, coachStyle: e.target.value })}
          className='ml-2 rounded border px-2 py-1'
        >
          <option value='mentor'>Mentor</option>
          <option value='socratic'>Socratic</option>
          <option value='friend'>Supportive Friend</option>
        </select>
      </label>
    </div>
  );
}
