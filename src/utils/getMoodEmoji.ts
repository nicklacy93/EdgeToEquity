export function getMoodEmoji(mood: string): string {
  switch (mood) {
    case 'optimistic': return '😊';
    case 'focused': return '🧠';
    case 'uncertain': return '🤔';
    case 'frustrated': return '😤';
    case 'calm': return '🧘';
    case 'aggressive': return '🔥';
    default: return '💬';
  }
}
