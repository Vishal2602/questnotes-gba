import { Priority, PRIORITY_CONFIG } from '../types';

/**
 * XP calculation and leveling system
 * Sam's note: Using exponential growth to make early levels feel rewarding
 * but later levels require real commitment
 */

// XP gained per priority level
export const XP_PER_PRIORITY: Record<Priority, number> = {
  slime: PRIORITY_CONFIG.slime.xp,
  goblin: PRIORITY_CONFIG.goblin.xp,
  dragon: PRIORITY_CONFIG.dragon.xp
};

// Base XP for level 1, then exponential growth
const BASE_XP = 100;
const GROWTH_RATE = 1.5;

/**
 * Calculate XP required to go from level N to N+1
 */
export const xpForLevel = (level: number): number => {
  if (level < 1) return 0;
  return Math.floor(BASE_XP * Math.pow(GROWTH_RATE, level - 1));
};

/**
 * Calculate total XP required to reach a given level (from level 1)
 */
export const totalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
};

/**
 * Given total XP, calculate current level
 */
export const calculateLevel = (totalXp: number): number => {
  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded + xpForLevel(level) <= totalXp) {
    xpNeeded += xpForLevel(level);
    level++;

    // Cap at level 99 to prevent infinite loop
    if (level >= 99) break;
  }

  return level;
};

/**
 * Calculate progress toward next level (0-100%)
 */
export const calculateLevelProgress = (totalXp: number): number => {
  const level = calculateLevel(totalXp);
  const xpForCurrentLevel = totalXpForLevel(level);
  const xpForNextLevel = xpForLevel(level);
  const xpIntoCurrentLevel = totalXp - xpForCurrentLevel;

  if (xpForNextLevel === 0) return 100;

  return Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevel) * 100));
};

/**
 * Get XP remaining to next level
 */
export const xpToNextLevel = (totalXp: number): number => {
  const level = calculateLevel(totalXp);
  const xpForCurrentLevel = totalXpForLevel(level);
  const xpForNextLevel = xpForLevel(level);
  const xpIntoCurrentLevel = totalXp - xpForCurrentLevel;

  return Math.max(0, xpForNextLevel - xpIntoCurrentLevel);
};

/**
 * Get rank title based on level
 */
export const getRankTitle = (level: number): string => {
  if (level >= 50) return 'Legendary Scribe';
  if (level >= 40) return 'Master Chronicler';
  if (level >= 30) return 'Grand Archivist';
  if (level >= 25) return 'Royal Scribe';
  if (level >= 20) return 'Elder Sage';
  if (level >= 15) return 'Wise Scholar';
  if (level >= 10) return 'Journeyman';
  if (level >= 7) return 'Apprentice';
  if (level >= 5) return 'Initiate';
  if (level >= 3) return 'Novice';
  return 'Peasant';
};
