import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { GameState, GameAction, Quest, Character, ACHIEVEMENTS } from '../types';
import { saveGame, loadGame } from '../utils/storage';
import { calculateLevel, XP_PER_PRIORITY } from '../utils/xp';

// Default character for new players
const defaultCharacter: Character = {
  name: 'Adventurer',
  level: 1,
  xp: 0,
  companion: 'slime',
  completedQuests: 0,
  achievements: []
};

// Initial state for a fresh game
const initialState: GameState = {
  quests: [],
  dungeons: [],
  character: defaultCharacter,
  selectedDungeonId: null,
  soundEnabled: true
};

/**
 * Check and award achievements based on current state
 * Sam's note: This is called after every state change to ensure
 * achievements are never missed
 */
const checkAchievements = (state: GameState): string[] => {
  const newAchievements: string[] = [];
  const { character, quests, dungeons } = state;
  const completedQuests = quests.filter(q => q.completed);

  // First quest
  if (completedQuests.length >= 1 && !character.achievements.includes('first_quest')) {
    newAchievements.push('first_quest');
  }

  // Quest milestones
  if (completedQuests.length >= 10 && !character.achievements.includes('ten_quests')) {
    newAchievements.push('ten_quests');
  }
  if (completedQuests.length >= 50 && !character.achievements.includes('fifty_quests')) {
    newAchievements.push('fifty_quests');
  }
  if (completedQuests.length >= 100 && !character.achievements.includes('hundred_quests')) {
    newAchievements.push('hundred_quests');
  }

  // Dragon slayer
  const completedDragon = completedQuests.some(q => q.priority === 'dragon');
  if (completedDragon && !character.achievements.includes('first_dragon')) {
    newAchievements.push('first_dragon');
  }

  // Dungeon master
  if (dungeons.length >= 1 && !character.achievements.includes('first_dungeon')) {
    newAchievements.push('first_dungeon');
  }

  // Level milestones
  if (character.level >= 5 && !character.achievements.includes('level_5')) {
    newAchievements.push('level_5');
  }
  if (character.level >= 10 && !character.achievements.includes('level_10')) {
    newAchievements.push('level_10');
  }

  // Time-based achievements - check last completed quest
  const lastCompleted = completedQuests[completedQuests.length - 1];
  if (lastCompleted) {
    const completedDate = new Date(lastCompleted.completedAt || lastCompleted.updatedAt);
    const hour = completedDate.getHours();

    if (hour >= 0 && hour < 5 && !character.achievements.includes('night_owl')) {
      newAchievements.push('night_owl');
    }
    if (hour >= 5 && hour < 7 && !character.achievements.includes('early_bird')) {
      newAchievements.push('early_bird');
    }
  }

  return newAchievements;
};

/**
 * Main game reducer - handles all state mutations
 * Sam's note: Every case returns a new state object to ensure immutability
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_QUEST': {
      const newState = {
        ...state,
        quests: [...state.quests, action.payload]
      };
      return newState;
    }

    case 'UPDATE_QUEST': {
      const newState = {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload.id ? action.payload : q
        )
      };
      return newState;
    }

    case 'DELETE_QUEST': {
      const newState = {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload)
      };
      return newState;
    }

    case 'COMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.payload);
      if (!quest || quest.completed) return state;

      const xpGain = XP_PER_PRIORITY[quest.priority];
      const newXp = state.character.xp + xpGain;
      const newLevel = calculateLevel(newXp);

      const updatedQuest: Quest = {
        ...quest,
        completed: true,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let newState: GameState = {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload ? updatedQuest : q
        ),
        character: {
          ...state.character,
          xp: newXp,
          level: newLevel,
          completedQuests: state.character.completedQuests + 1
        }
      };

      // Check for new achievements
      const newAchievements = checkAchievements(newState);
      if (newAchievements.length > 0) {
        newState = {
          ...newState,
          character: {
            ...newState.character,
            achievements: [...newState.character.achievements, ...newAchievements]
          }
        };
      }

      return newState;
    }

    case 'UNCOMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.payload);
      if (!quest || !quest.completed) return state;

      // Remove XP (but don't go below 0)
      const xpLoss = XP_PER_PRIORITY[quest.priority];
      const newXp = Math.max(0, state.character.xp - xpLoss);
      const newLevel = calculateLevel(newXp);

      const updatedQuest: Quest = {
        ...quest,
        completed: false,
        completedAt: null,
        updatedAt: new Date().toISOString()
      };

      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload ? updatedQuest : q
        ),
        character: {
          ...state.character,
          xp: newXp,
          level: newLevel,
          completedQuests: Math.max(0, state.character.completedQuests - 1)
        }
      };
    }

    case 'ADD_DUNGEON': {
      let newState: GameState = {
        ...state,
        dungeons: [...state.dungeons, action.payload]
      };

      // Check for dungeon master achievement
      const newAchievements = checkAchievements(newState);
      if (newAchievements.length > 0) {
        newState = {
          ...newState,
          character: {
            ...newState.character,
            achievements: [...newState.character.achievements, ...newAchievements]
          }
        };
      }

      return newState;
    }

    case 'UPDATE_DUNGEON': {
      return {
        ...state,
        dungeons: state.dungeons.map(d =>
          d.id === action.payload.id ? action.payload : d
        )
      };
    }

    case 'DELETE_DUNGEON': {
      // Move all quests from this dungeon to Wilderness (null)
      return {
        ...state,
        dungeons: state.dungeons.filter(d => d.id !== action.payload),
        quests: state.quests.map(q =>
          q.dungeonId === action.payload
            ? { ...q, dungeonId: null, updatedAt: new Date().toISOString() }
            : q
        ),
        // If we're viewing the deleted dungeon, go back to all
        selectedDungeonId: state.selectedDungeonId === action.payload
          ? null
          : state.selectedDungeonId
      };
    }

    case 'SELECT_DUNGEON': {
      return {
        ...state,
        selectedDungeonId: action.payload
      };
    }

    case 'ADD_XP': {
      const newXp = state.character.xp + action.payload;
      const newLevel = calculateLevel(newXp);

      let newState: GameState = {
        ...state,
        character: {
          ...state.character,
          xp: newXp,
          level: newLevel
        }
      };

      // Check for level achievements
      const newAchievements = checkAchievements(newState);
      if (newAchievements.length > 0) {
        newState = {
          ...newState,
          character: {
            ...newState.character,
            achievements: [...newState.character.achievements, ...newAchievements]
          }
        };
      }

      return newState;
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (state.character.achievements.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        character: {
          ...state.character,
          achievements: [...state.character.achievements, action.payload]
        }
      };
    }

    case 'SET_COMPANION': {
      return {
        ...state,
        character: {
          ...state.character,
          companion: action.payload
        }
      };
    }

    case 'SET_CHARACTER_NAME': {
      return {
        ...state,
        character: {
          ...state.character,
          name: action.payload
        }
      };
    }

    case 'TOGGLE_SOUND': {
      return {
        ...state,
        soundEnabled: !state.soundEnabled
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'RESET_GAME': {
      return initialState;
    }

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    // Try to load saved state on initial render
    const savedState = loadGame();
    if (savedState) {
      return savedState;
    }
    return initialState;
  });

  // Auto-save on every state change
  useEffect(() => {
    saveGame(state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook for accessing game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Convenience hook for just the state
export function useGameState() {
  const { state } = useGame();
  return state;
}

// Export for getting achievement details
export function getAchievementDetails(id: string) {
  return ACHIEVEMENTS.find(a => a.id === id);
}
