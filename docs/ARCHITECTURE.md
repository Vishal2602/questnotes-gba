# ARCHITECTURE: PixelScribe

## Technical Overview

PixelScribe is a client-side web application built with React and TypeScript, featuring a 16-bit GBA aesthetic. The app uses local storage for persistence, custom CSS for pixel-perfect styling, and the Web Audio API for chiptune sound effects.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React 18 + TypeScript | UI components and type safety |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Styling** | CSS Modules + CSS Variables | Scoped styles with theme support |
| **State** | Zustand | Lightweight global state management |
| **Storage** | localStorage + IndexedDB | Note persistence and asset caching |
| **Audio** | Howler.js | Cross-browser chiptune audio |
| **Animations** | Framer Motion | Smooth pixel transitions |

---

## Project Structure

```
src/
├── main.tsx                    # App entry point
├── App.tsx                     # Root component with routing
│
├── components/
│   ├── layout/
│   │   ├── GBAFrame.tsx        # Main container with pixel borders
│   │   ├── ScreenTransition.tsx # Fade/slide transitions
│   │   └── Scanlines.tsx       # Optional CRT overlay effect
│   │
│   ├── mascot/
│   │   ├── Mascot.tsx          # Animated sprite companion
│   │   ├── MascotSprite.tsx    # Sprite sheet renderer
│   │   └── mascotStates.ts     # Animation state definitions
│   │
│   ├── notes/
│   │   ├── NoteEditor.tsx      # Main text editing area
│   │   ├── NoteList.tsx        # Quest log view
│   │   ├── NoteCard.tsx        # Individual note preview
│   │   ├── TreasureChest.tsx   # Folder component
│   │   └── BossNoteBadge.tsx   # Special note indicator
│   │
│   ├── ui/
│   │   ├── PixelButton.tsx     # Styled button with press animation
│   │   ├── PixelInput.tsx      # Retro text input
│   │   ├── HealthBar.tsx       # Word count display as HP
│   │   ├── XPBar.tsx           # Experience progress bar
│   │   ├── Modal.tsx           # Dialog boxes (pixel styled)
│   │   └── Toast.tsx           # Notification popups
│   │
│   └── gamification/
│       ├── LevelDisplay.tsx    # Current level indicator
│       ├── AchievementPopup.tsx # Badge unlock animation
│       ├── RandomEncounter.tsx # Surprise pixel events
│       └── StatsPanel.tsx      # User statistics dashboard
│
├── hooks/
│   ├── useNotes.ts             # Note CRUD operations
│   ├── useMascot.ts            # Mascot state and reactions
│   ├── useAudio.ts             # Sound effect triggers
│   ├── useXP.ts                # Experience point calculations
│   ├── useTheme.ts             # Palette switching
│   └── useRandomEncounter.ts   # Event trigger logic
│
├── stores/
│   ├── noteStore.ts            # Notes state (Zustand)
│   ├── userStore.ts            # XP, level, achievements
│   ├── settingsStore.ts        # Audio, theme preferences
│   └── mascotStore.ts          # Companion state
│
├── services/
│   ├── storage.ts              # localStorage abstraction
│   ├── audioPlayer.ts          # Howler.js wrapper
│   └── achievementChecker.ts   # Badge unlock logic
│
├── assets/
│   ├── sprites/
│   │   ├── mascot-sheet.png    # Sprite atlas for companion
│   │   ├── icons.png           # UI icon sprites
│   │   └── chest-animation.png # Folder open/close frames
│   │
│   ├── audio/
│   │   ├── sfx/
│   │   │   ├── type.wav        # Keystroke sound
│   │   │   ├── save.wav        # Save confirmation
│   │   │   ├── delete.wav      # Delete with sword slash
│   │   │   ├── levelup.wav     # XP level increase
│   │   │   └── open.wav        # Note/chest open
│   │   └── music/
│   │       └── chill-loop.wav  # Optional background music
│   │
│   └── fonts/
│       └── PressStart2P.woff2  # Pixel font
│
├── styles/
│   ├── global.css              # Reset, base pixel styles
│   ├── themes.css              # Color palette variables
│   ├── animations.css          # Keyframe definitions
│   └── pixelBorders.css        # Reusable border utilities
│
├── types/
│   ├── note.ts                 # Note interface definitions
│   ├── user.ts                 # User profile types
│   ├── mascot.ts               # Sprite state types
│   └── theme.ts                # Theme configuration types
│
└── utils/
    ├── xpCalculator.ts         # XP gain formulas
    ├── spriteAnimation.ts      # Frame timing utilities
    ├── randomEvents.ts         # Encounter probability
    └── constants.ts            # Magic numbers, config
```

---

## Core Data Models

### Note
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  isBossNote: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags: string[];
  wordCount: number;
  createdAt: number;
  updatedAt: number;
}
```

### Folder (Treasure Chest)
```typescript
interface Folder {
  id: string;
  name: string;
  icon: 'chest' | 'pouch' | 'scroll' | 'grimoire';
  color: string;
  noteCount: number;
  createdAt: number;
}
```

### User Profile
```typescript
interface UserProfile {
  mascotType: 'knight' | 'mage' | 'rogue' | 'bard';
  xp: number;
  level: number;
  totalNotes: number;
  totalWords: number;
  longestStreak: number;
  currentStreak: number;
  lastActiveDate: string;
  unlockedThemes: string[];
  unlockedBadges: string[];
  settings: UserSettings;
}
```

### User Settings
```typescript
interface UserSettings {
  theme: 'classic' | 'night' | 'ocean' | 'forest';
  soundEnabled: boolean;
  musicEnabled: boolean;
  scanlineEffect: boolean;
  mascotReactions: boolean;
}
```

---

## Component Architecture

### State Flow
```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   GBAFrame.tsx                    │  │
│  │  ┌─────────────┐  ┌─────────────────────────────┐│  │
│  │  │  Mascot.tsx │  │      Main Content Area      ││  │
│  │  │  (reactive) │  │  ┌─────────────────────────┐││  │
│  │  │             │  │  │   NoteList / NoteEditor │││  │
│  │  └─────────────┘  │  └─────────────────────────┘││  │
│  │                   │  ┌─────────────────────────┐││  │
│  │  ┌─────────────┐  │  │   XPBar / HealthBar     │││  │
│  │  │ LevelDisplay│  │  └─────────────────────────┘││  │
│  │  └─────────────┘  └─────────────────────────────┘│  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Zustand Stores: noteStore, userStore, settings  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Mascot Reaction System
```
User Action → Hook Trigger → Mascot Store Update → Animation Frame
    │
    ├── Typing fast  → mascot: 'excited'  → bouncy animation
    ├── Typing slow  → mascot: 'thinking' → scratching head
    ├── Idle > 30s   → mascot: 'sleepy'   → dozing animation
    ├── Save note    → mascot: 'happy'    → celebration dance
    ├── Delete note  → mascot: 'worried'  → sweat drop
    └── Level up     → mascot: 'victory'  → jump with sparkles
```

---

## Audio System Architecture

### Sound Manager
```typescript
// Singleton audio controller
class AudioManager {
  private sounds: Map<string, Howl>;
  private music: Howl | null;

  playSFX(name: SoundEffect): void;
  playMusic(): void;
  stopMusic(): void;
  setVolume(type: 'sfx' | 'music', level: number): void;
}

type SoundEffect =
  | 'type'      // Per keystroke (throttled)
  | 'save'      // Note saved
  | 'delete'    // Note deleted
  | 'open'      // Note/folder opened
  | 'close'     // Modal closed
  | 'levelup'   // XP milestone
  | 'unlock'    // Achievement/theme unlocked
  | 'encounter' // Random event appears
```

### Audio Throttling
Keystroke sounds are throttled to max 10/second to prevent audio overload while maintaining the tactile feel.

---

## Storage Architecture

### localStorage Schema
```
pixelscribe_notes     → Note[]
pixelscribe_folders   → Folder[]
pixelscribe_user      → UserProfile
pixelscribe_settings  → UserSettings
```

### Save System
```typescript
// Auto-save with retro animation
const useSaveSystem = () => {
  const saveNote = async (note: Note) => {
    setIsSaving(true);
    showSaveAnimation(); // "SAVING..." with progress bar

    await delay(300);    // Dramatic pause for effect
    storage.saveNote(note);

    playSFX('save');
    showSaveComplete();  // "OK!" confirmation
    setIsSaving(false);
  };
};
```

---

## Gamification Engine

### XP Calculations
```typescript
const XP_REWARDS = {
  NOTE_CREATED: 10,
  WORDS_WRITTEN: 1,      // per 10 words
  DAILY_LOGIN: 25,
  STREAK_BONUS: 5,       // per day
  BOSS_NOTE_COMPLETED: 50,
};

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000
];

function calculateLevel(xp: number): number {
  return LEVEL_THRESHOLDS.findIndex(threshold => xp < threshold) - 1 || 10;
}
```

### Achievement System
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: UserProfile, notes: Note[]) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quest',
    name: 'First Quest',
    description: 'Create your first note',
    icon: 'scroll',
    condition: (user) => user.totalNotes >= 1,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Write 100 notes',
    icon: 'shield',
    condition: (user) => user.totalNotes >= 100,
  },
  // ... more achievements
];
```

### Random Encounter System
```typescript
// Chance-based events during note editing
const ENCOUNTERS = [
  { type: 'treasure', chance: 0.02, xpReward: 15 },
  { type: 'pixelCreature', chance: 0.03, xpReward: 5 },
  { type: 'inspirationQuote', chance: 0.05, xpReward: 0 },
];

// Check every 30 seconds of active editing
function checkForEncounter(): Encounter | null {
  const roll = Math.random();
  for (const encounter of ENCOUNTERS) {
    if (roll < encounter.chance) return encounter;
  }
  return null;
}
```

---

## Styling System

### CSS Variable Theme Structure
```css
:root {
  /* Base pixel unit */
  --pixel: 4px;

  /* Current theme colors (swapped via class) */
  --color-bg: var(--theme-bg);
  --color-light: var(--theme-light);
  --color-medium: var(--theme-medium);
  --color-dark: var(--theme-dark);

  /* UI spacing (multiples of pixel) */
  --space-xs: calc(var(--pixel) * 1);
  --space-sm: calc(var(--pixel) * 2);
  --space-md: calc(var(--pixel) * 4);
  --space-lg: calc(var(--pixel) * 8);

  /* Borders */
  --border-width: calc(var(--pixel) * 1);
}

.theme-classic {
  --theme-bg: #9BBC0F;
  --theme-light: #8BAC0F;
  --theme-medium: #306230;
  --theme-dark: #0F380F;
}
```

### Pixel Border Utility
```css
.pixel-border {
  border: var(--border-width) solid var(--color-dark);
  box-shadow:
    inset calc(var(--pixel) * -1) calc(var(--pixel) * -1) 0 var(--color-medium),
    inset var(--pixel) var(--pixel) 0 var(--color-light);
}
```

---

## Performance Considerations

1. **Sprite Sheet Optimization**
   - Single image atlas for mascot animations
   - CSS background-position for frame selection
   - GPU-accelerated transforms only

2. **Audio Preloading**
   - Load all SFX on app init (small files)
   - Lazy load background music

3. **Render Optimization**
   - React.memo for static pixel components
   - Debounced note content saves (500ms)
   - Virtual list for 100+ notes

4. **Storage Efficiency**
   - Compress old notes if content > 10KB
   - Periodic cleanup of deleted items

---

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile Safari | 14+ | Touch optimized |
| Chrome Android | 90+ | Touch optimized |

---

## Security Considerations

- All data stored client-side only
- No external API calls (offline-capable)
- Content sanitized before rendering (XSS prevention)
- No user authentication (privacy by design)

---

## Future Architecture Considerations

For potential future features (cloud sync, accounts), the architecture supports:
- Service layer abstraction for storage (easy to swap localStorage → API)
- User profile structure ready for server sync
- Modular store design for feature flags

---

*Architecture designed for a joyful, nostalgic experience that prioritizes responsiveness and delight.*
