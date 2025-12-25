import { CompanionMood, Quest, Character, COMPANION_CONFIG } from '../../types';
import './Companion.css';

interface CompanionProps {
  character: Character;
  quests: Quest[];
  onClick?: () => void;
}

/**
 * Determine companion mood based on quest status
 * Sam's note: Companion reacts to player's productivity
 */
function getCompanionMood(_character: Character, quests: Quest[]): CompanionMood {
  // Check for too many hard quests piling up
  const overdueHardQuests = quests.filter(q =>
    !q.completed && q.priority === 'dragon'
  );

  if (overdueHardQuests.length > 3) return 'worried';

  // Check last activity
  const completedQuests = quests
    .filter(q => q.completed && q.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  if (completedQuests.length === 0) return 'idle';

  const lastCompleted = completedQuests[0];
  const hoursSinceActivity = (Date.now() - new Date(lastCompleted.completedAt!).getTime()) / 3600000;

  if (hoursSinceActivity > 24) return 'sleeping';
  if (hoursSinceActivity < 1) return 'happy';

  return 'idle';
}

/**
 * Get mood-specific message for companion
 */
function getMoodMessage(mood: CompanionMood): string {
  const messages: Record<CompanionMood, string[]> = {
    idle: [
      'Ready for adventure!',
      'What quest awaits?',
      'Let\'s do this!',
      '*bounces excitedly*'
    ],
    happy: [
      'Great job, hero!',
      'Quest complete! ★',
      'You\'re amazing!',
      '*happy dance*'
    ],
    sleeping: [
      'Zzz... *snore*',
      '*yawns* ...back yet?',
      'Waiting for you...',
      '*sleepy eyes*'
    ],
    worried: [
      'So many quests...',
      'Need help, hero?',
      '*nervous bouncing*',
      'Dragons everywhere!'
    ]
  };

  const moodMessages = messages[mood];
  return moodMessages[Math.floor(Math.random() * moodMessages.length)];
}

export function Companion({ character, quests, onClick }: CompanionProps) {
  const mood = getCompanionMood(character, quests);
  const config = COMPANION_CONFIG[character.companion];
  const message = getMoodMessage(mood);

  return (
    <div
      className={`companion companion--${mood}`}
      onClick={onClick}
      title="Click to change companion"
    >
      <div className="companion__sprite">
        <span className="companion__emoji">{config.emoji}</span>
      </div>
      <div className="companion__speech">
        <span className="companion__message">{message}</span>
      </div>
    </div>
  );
}
