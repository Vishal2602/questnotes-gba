# QuestNotes - Technical Architecture

## Overview

A single-page React application with a pixel-art aesthetic. No backend, no database—just clean client-side code with localStorage persistence. Simple, maintainable, fun.

## Directory Structure

```
src/
├── components/
│   ├── App.tsx                 # Root component, layout
│   ├── QuestList/
│   │   ├── QuestList.tsx       # Main note list view
│   │   ├── QuestCard.tsx       # Individual note card (quest scroll)
│   │   └── QuestForm.tsx       # Create/edit note modal
│   ├── Dungeon/
│   │   ├── DungeonList.tsx     # Folder sidebar
│   │   └── DungeonForm.tsx     # Create/edit folder
│   ├── Character/
│   │   ├── CharacterDisplay.tsx # XP bar, level, avatar
│   │   └── Companion.tsx       # Pet sprite with animations
│   ├── UI/
│   │   ├── PixelButton.tsx     # Styled button component
│   │   ├── PixelInput.tsx      # Styled input/textarea
│   │   ├── PixelModal.tsx      # Dialog boxes (GBA style)
│   │   └── SpriteIcon.tsx      # Icon component using sprite sheet
│   └── Layout/
│       ├── Header.tsx          # Top bar with title, XP
│       └── Sidebar.tsx         # Dungeon navigation
├── hooks/
│   ├── useQuests.ts            # Quest CRUD operations
│   ├── useDungeons.ts          # Folder management
│   ├── useCharacter.ts         # XP, leveling logic
│   └── useSound.ts             # Audio effect triggers
├── context/
│   ├── GameContext.tsx         # Global state (quests, dungeons, character)
│   └── SoundContext.tsx        # Sound enabled/disabled state
├── utils/
│   ├── storage.ts              # localStorage helpers
│   ├── xp.ts                   # XP calculation formulas
│   └── priorities.ts           # Priority tier definitions
├── assets/
│   ├── sprites/                # Pixel art sprite sheets
│   ├── sounds/                 # Chiptune .mp3/.ogg files
│   └── fonts/                  # Pixel fonts
├── styles/
│   ├── global.css              # Reset, base pixel styles
│   ├── variables.css           # GBA color palette CSS vars
│   └── animations.css          # Sprite animations, transitions
├── types/
│   └── index.ts                # TypeScript interfaces
└── index.tsx                   # Entry point
```

## Data Models

```typescript
// types/index.ts

interface Quest {
  id: string;
  title: string;
  content: string;
  dungeonId: string | null;  // null = "Uncategorized" (Wilderness)
  priority: 'slime' | 'goblin' | 'dragon';
  category: 'knight' | 'mage' | 'bard' | 'rogue';
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Dungeon {
  id: string;
  name: string;
  icon: string;  // Sprite reference
  createdAt: string;
}

interface Character {
  name: string;
  level: number;
  xp: number;
  companion: 'cat' | 'dog' | 'dragon' | 'slime';
  completedQuests: number;
  achievements: string[];
}

interface GameState {
  quests: Quest[];
  dungeons: Dungeon[];
  character: Character;
  selectedDungeonId: string | null;
  soundEnabled: boolean;
}
```

## State Management

Using React Context with useReducer. One context, one reducer, no complexity.

```typescript
// context/GameContext.tsx

type Action =
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST'; payload: Quest }
  | { type: 'DELETE_QUEST'; payload: string }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'ADD_DUNGEON'; payload: Dungeon }
  | { type: 'DELETE_DUNGEON'; payload: string }
  | { type: 'SELECT_DUNGEON'; payload: string | null }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'SET_COMPANION'; payload: Character['companion'] }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'LOAD_STATE'; payload: GameState };
```

## XP & Leveling System

Keep it simple, keep it fun:

```typescript
// utils/xp.ts

const XP_PER_PRIORITY = {
  slime: 10,
  goblin: 25,
  dragon: 50
};

// Level thresholds (exponential growth)
const xpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Total XP needed to reach a level
const totalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
};
```

## Visual Design System

### GBA Color Palette (CSS Variables)

```css
/* styles/variables.css */

:root {
  /* Primary palette - warm, slightly desaturated GBA style */
  --gba-bg-dark: #1a1c2c;
  --gba-bg-mid: #333c57;
  --gba-bg-light: #566c86;

  --gba-text-dark: #333c57;
  --gba-text-light: #f4f4f4;
  --gba-text-muted: #94b0c2;

  /* Priority colors */
  --slime-green: #38b764;
  --goblin-yellow: #feae34;
  --dragon-red: #e43b44;

  /* Category colors */
  --knight-blue: #3978a8;
  --mage-purple: #8b5fbf;
  --bard-pink: #f26b8a;
  --rogue-gray: #5a6988;

  /* UI accents */
  --xp-gold: #ffd700;
  --border-color: #566c86;
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

### Pixel-Perfect Rendering

```css
/* styles/global.css */

* {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Pixel font setup */
@font-face {
  font-family: 'PixelFont';
  src: url('../assets/fonts/PressStart2P-Regular.ttf');
}

body {
  font-family: 'PixelFont', monospace;
  font-size: 8px;
  background-color: var(--gba-bg-dark);
  color: var(--gba-text-light);
}

/* Scale up with integer multiples only */
.game-container {
  transform: scale(2);
  transform-origin: top left;
}
```

## Component Patterns

### PixelButton Example

```tsx
// components/UI/PixelButton.tsx

interface PixelButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
}

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled
}) => {
  const { playSound } = useSound();

  const handleClick = () => {
    if (!disabled) {
      playSound('button-click');
      onClick();
    }
  };

  return (
    <button
      className={`pixel-button pixel-button--${variant}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Companion Animation States

```tsx
// components/Character/Companion.tsx

type CompanionMood = 'idle' | 'happy' | 'sleeping' | 'worried';

const getMood = (character: Character, quests: Quest[]): CompanionMood => {
  const overdueQuests = quests.filter(q =>
    !q.completed && q.priority === 'dragon'
  );

  if (overdueQuests.length > 3) return 'worried';

  // Check last activity (simplified)
  const lastCompleted = quests
    .filter(q => q.completed)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];

  if (!lastCompleted) return 'idle';

  const hoursSinceActivity = (Date.now() - new Date(lastCompleted.completedAt!).getTime()) / 3600000;

  if (hoursSinceActivity > 24) return 'sleeping';
  if (hoursSinceActivity < 1) return 'happy';

  return 'idle';
};
```

## Sound Design

Using Howler.js for simple, reliable audio:

```typescript
// hooks/useSound.ts

import { Howl } from 'howler';

const sounds = {
  'button-click': new Howl({ src: ['/sounds/click.mp3'] }),
  'quest-complete': new Howl({ src: ['/sounds/complete.mp3'] }),
  'level-up': new Howl({ src: ['/sounds/levelup.mp3'] }),
  'error': new Howl({ src: ['/sounds/error.mp3'] }),
};

export const useSound = () => {
  const { soundEnabled } = useContext(SoundContext);

  const playSound = (name: keyof typeof sounds) => {
    if (soundEnabled) {
      sounds[name].play();
    }
  };

  return { playSound };
};
```

## localStorage Schema

```typescript
// utils/storage.ts

const STORAGE_KEY = 'questnotes_save';

export const saveGame = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadGame = (): GameState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as GameState;
  } catch {
    return null;
  }
};

// Auto-save on every state change via useEffect in GameContext
```

## Build & Development

```json
// package.json (key dependencies)
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "howler": "^2.2.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/howler": "^2.2.0"
  }
}
```

## Key Principles

1. **No over-abstraction**: If a component is only used once, it doesn't need to be "reusable"
2. **Pixel-perfect or bust**: Every visual element respects the pixel grid
3. **Sound is optional**: Always check `soundEnabled` before playing
4. **Offline-first**: Everything works without network
5. **Fun over features**: If it's not fun, it's not shipped

## Performance Considerations

- Sprite sheets instead of individual images
- CSS animations over JS where possible
- Debounced localStorage saves
- Lazy load sounds on first interaction (browser autoplay policies)

---

*Architecture should be as simple as possible, but no simpler.*
