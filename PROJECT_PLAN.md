# QuestNotes - 16-Bit GBA-Style Note Taker

## Vision

A note-taking app that feels like you're playing a Game Boy Advance RPG from 2003. Your notes are "quests," organizing them is "inventory management," and the whole experience drips with that nostalgic pixel-art charm. Because taking notes shouldn't feel like work—it should feel like an adventure.

## The Quirk Factor

### Core Concept: Notes as RPG Quests

- **Notes = Quests**: Each note is a "quest scroll" you've picked up
- **Folders = Dungeons**: Organize quests into themed dungeons (Work Dungeon, Personal Cave, Side Quests)
- **Completing notes = Quest completion**: Check off a note and get XP, level up your character
- **Character progression**: Your avatar levels up as you complete notes, unlocking cosmetic pixel art items

### Visual Identity

- **16-bit pixel art aesthetic** throughout
- **Chunky pixel fonts** (think Golden Sun, Pokemon Ruby/Sapphire era)
- **Chiptune sound effects** for interactions (8-bit bleeps and bloops)
- **Animated pixel sprites** for your character and UI elements
- **Color palette**: Limited GBA-style palette (warm, slightly washed out)

### Unique Mechanics

1. **Quest Priority = Monster Difficulty**
   - Low priority: Slime-tier quest (green border)
   - Medium priority: Goblin-tier quest (yellow border)
   - High priority: Dragon-tier quest (red border, pulsing animation)

2. **Note Categories as Character Classes**
   - Work notes: Knight class icon
   - Personal notes: Mage class icon
   - Ideas: Bard class icon
   - Tasks: Rogue class icon

3. **The Companion System**
   - A pixel art companion (choose from: cat, dog, dragon, slime) that reacts to your productivity
   - Happy and animated when you complete quests
   - Falls asleep if you're idle
   - Worried expression when you have overdue high-priority notes

4. **Achievement Badges**
   - "First Blood" - Complete your first quest
   - "Dungeon Master" - Create 5 folders
   - "Loot Hoarder" - Have 50+ notes
   - "Speed Runner" - Complete 10 quests in one day

## Features

### MVP (Phase 1)

- [ ] Create/edit/delete notes (quests)
- [ ] Folder organization (dungeons)
- [ ] Priority levels with monster-tier visuals
- [ ] Basic pixel art UI with GBA color palette
- [ ] Sound effects on key actions
- [ ] Local storage persistence
- [ ] Quest completion with XP reward animation

### Phase 2

- [ ] Character selection and leveling system
- [ ] Companion pet with reactive animations
- [ ] Achievement system
- [ ] Note search ("Quest Log Search")
- [ ] Due dates with "Quest Timer" visualization

### Phase 3 (Nice to Have)

- [ ] Export notes (as "Quest Scrolls")
- [ ] Dark mode ("Night Mode Dungeon")
- [ ] Keyboard shortcuts ("Quick Cast")
- [ ] Mobile responsive design

## Tech Stack

- **Frontend**: React + TypeScript (no over-engineering, just solid fundamentals)
- **Styling**: CSS with pixel-art specific techniques (image-rendering: pixelated)
- **State**: React Context (we don't need Redux for a note app, fight me)
- **Storage**: LocalStorage (keeps it simple, no backend needed for MVP)
- **Audio**: Howler.js for chiptune sound effects
- **Fonts**: Custom pixel font (Press Start 2P or similar)

## Non-Goals

- No cloud sync (keep it simple)
- No collaborative editing (this is a solo adventure)
- No mobile app (web-first, responsive later)
- No AI features (the companion is dumb on purpose, it's charming)

## Success Metrics

- Does it make you smile when you use it?
- Does completing a note feel satisfying?
- Would a 2003 GBA player recognize the aesthetic?
- Is it actually useful for taking notes?

---

*"Every great adventure starts with a single quest."* - Loading screen tip #1
