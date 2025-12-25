import { GameState } from '../types';

const STORAGE_KEY = 'questnotes_save';
const STORAGE_VERSION = 1;

interface StorageWrapper {
  version: number;
  data: GameState;
  savedAt: string;
}

/**
 * Save game state to localStorage with version tracking
 * Sam's note: Added wrapper to handle future migrations
 */
export const saveGame = (state: GameState): void => {
  try {
    const wrapper: StorageWrapper = {
      version: STORAGE_VERSION,
      data: state,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
  } catch (error) {
    // localStorage might be full or disabled - fail silently but log
    console.error('Failed to save game state:', error);
  }
};

/**
 * Load game state from localStorage with validation
 * Returns null if no save exists or data is corrupted
 */
export const loadGame = (): GameState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const wrapper = JSON.parse(saved) as StorageWrapper;

    // Version check - handle migrations in future
    if (wrapper.version !== STORAGE_VERSION) {
      console.warn('Save file version mismatch, may need migration');
      // For now, still try to load
    }

    // Basic validation - ensure required fields exist
    const data = wrapper.data;
    if (!data || !Array.isArray(data.quests) || !Array.isArray(data.dungeons)) {
      console.error('Corrupted save file detected');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Clear all saved data - use with caution!
 */
export const clearSave = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear save:', error);
  }
};

/**
 * Export save data as JSON string for backup
 */
export const exportSave = (): string | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved;
};

/**
 * Import save data from JSON string
 * Returns true if successful, false if data is invalid
 */
export const importSave = (jsonString: string): boolean => {
  try {
    const wrapper = JSON.parse(jsonString) as StorageWrapper;

    // Validate structure
    if (!wrapper.data || !Array.isArray(wrapper.data.quests)) {
      return false;
    }

    localStorage.setItem(STORAGE_KEY, jsonString);
    return true;
  } catch {
    return false;
  }
};
