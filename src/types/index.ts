// Core data types for QuestNotes
// Sam's note: Being extra defensive with these types to prevent data corruption

export type Priority = 'slime' | 'goblin' | 'dragon';
export type Category = 'knight' | 'mage' | 'bard' | 'rogue';
export type CompanionType = 'cat' | 'dog' | 'dragon' | 'slime';
export type CompanionMood = 'idle' | 'happy' | 'sleeping' | 'worried';

export interface Quest {
  id: string;
  title: string;
  content: string;
  dungeonId: string | null;  // null = "Wilderness" (uncategorized)
  priority: Priority;
  category: Category;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Dungeon {
  id: string;
  name: string;
  icon: string;  // Emoji for simplicity in v1
  createdAt: string;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  companion: CompanionType;
  completedQuests: number;
  achievements: string[];
}

export interface GameState {
  quests: Quest[];
  dungeons: Dungeon[];
  character: Character;
  selectedDungeonId: string | null;  // null = show all / "Wilderness"
  soundEnabled: boolean;
}

// Action types for reducer - explicit union for type safety
export type GameAction =
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST'; payload: Quest }
  | { type: 'DELETE_QUEST'; payload: string }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'UNCOMPLETE_QUEST'; payload: string }
  | { type: 'ADD_DUNGEON'; payload: Dungeon }
  | { type: 'UPDATE_DUNGEON'; payload: Dungeon }
  | { type: 'DELETE_DUNGEON'; payload: string }
  | { type: 'SELECT_DUNGEON'; payload: string | null }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'SET_COMPANION'; payload: CompanionType }
  | { type: 'SET_CHARACTER_NAME'; payload: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'RESET_GAME' };

// Priority metadata for display
export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; xp: number; emoji: string }> = {
  slime: { label: 'Easy', color: '#38b764', xp: 10, emoji: '🟢' },
  goblin: { label: 'Medium', color: '#feae34', xp: 25, emoji: '🟡' },
  dragon: { label: 'Hard', color: '#e43b44', xp: 50, emoji: '🔴' }
};

// Category metadata for display
export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; emoji: string }> = {
  knight: { label: 'Tasks', color: '#3978a8', emoji: '⚔️' },
  mage: { label: 'Ideas', color: '#8b5fbf', emoji: '✨' },
  bard: { label: 'Journal', color: '#f26b8a', emoji: '📜' },
  rogue: { label: 'Secrets', color: '#5a6988', emoji: '🗝️' }
};

// Companion metadata
export const COMPANION_CONFIG: Record<CompanionType, { label: string; emoji: string }> = {
  cat: { label: 'Pixel Cat', emoji: '🐱' },
  dog: { label: 'Quest Pup', emoji: '🐕' },
  dragon: { label: 'Baby Dragon', emoji: '🐲' },
  slime: { label: 'Friendly Slime', emoji: '🟢' }
};

// Achievement definitions
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_quest', name: 'Humble Beginnings', description: 'Complete your first quest', emoji: '🌟' },
  { id: 'ten_quests', name: 'Adventurer', description: 'Complete 10 quests', emoji: '⚔️' },
  { id: 'fifty_quests', name: 'Veteran', description: 'Complete 50 quests', emoji: '🛡️' },
  { id: 'hundred_quests', name: 'Legend', description: 'Complete 100 quests', emoji: '👑' },
  { id: 'first_dragon', name: 'Dragon Slayer', description: 'Complete a dragon-tier quest', emoji: '🐉' },
  { id: 'first_dungeon', name: 'Dungeon Master', description: 'Create your first dungeon', emoji: '🏰' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', emoji: '⭐' },
  { id: 'level_10', name: 'Hero', description: 'Reach level 10', emoji: '🦸' },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a quest after midnight', emoji: '🦉' },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a quest before 7 AM', emoji: '🐦' }
];
