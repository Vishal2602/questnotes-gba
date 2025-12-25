# PROJECT PLAN: PixelScribe - The GBA-Style Quirky Note Taker

## Vision Statement
**PixelScribe** is a nostalgic 16-bit Game Boy Advance inspired note-taking app that transforms mundane note-taking into a retro gaming adventure. Every note becomes a quest, every save is a victory, and your productivity has a pixel-perfect charm.

---

## The Quirky Concept

### Core Quirks
1. **Notes are "Quests"** - Each note is treated as a quest in your adventure log
2. **Pixel Mascot Companion** - A tiny 16-bit sprite character reacts to your typing
3. **Chiptune Sound Effects** - GBA-era bleeps and bloops for every action
4. **Experience Points (XP)** - Earn XP for writing notes, level up your profile
5. **Random Encounters** - Occasional pixel art "events" pop up while writing
6. **Save States** - Notes auto-save with retro "SAVING..." animation
7. **Power-Ups** - Unlock themes, fonts, and mascot costumes as you level up

### Unique Features
| Feature | Description |
|---------|-------------|
| **Battle Mode Editing** | Delete text with a pixel sword slash animation |
| **Treasure Chest Folders** | Organize notes in animated treasure chests |
| **Health Bar Word Count** | Word count displayed as an HP bar |
| **Boss Notes** | Mark important notes as "Boss Notes" with special borders |
| **Pixel Weather** | Background changes based on time of day with pixel weather |
| **Achievement Badges** | Unlock badges for milestones (100 notes, 10k words, etc.) |

---

## Milestones & Deliverables

### Milestone 1: Foundation Quest (Core App)
**Goal:** Establish the basic note-taking functionality with GBA styling

**Deliverables:**
- [ ] Project scaffolding with React + TypeScript
- [ ] GBA-style CSS theme (4-color palette system)
- [ ] Pixel font integration (Press Start 2P)
- [ ] Basic note CRUD operations
- [ ] Local storage persistence
- [ ] Retro UI frame/border system

### Milestone 2: The Sprite Awakens (Mascot & Animations)
**Goal:** Bring the pixel companion to life

**Deliverables:**
- [ ] Pixel mascot sprite sheet (idle, happy, typing, sleeping)
- [ ] Mascot reaction system based on user actions
- [ ] Typing animation effects
- [ ] Save/load animations with GBA-style progress bar
- [ ] Screen transition effects (fade, slide)

### Milestone 3: Sound of Adventure (Audio System)
**Goal:** Authentic GBA audio experience

**Deliverables:**
- [ ] Chiptune sound effect library
- [ ] Typing sounds (per keystroke)
- [ ] Action sounds (save, delete, create)
- [ ] Optional background music loop
- [ ] Audio toggle controls

### Milestone 4: Quest Log System (Organization)
**Goal:** Unique note organization mechanics

**Deliverables:**
- [ ] Treasure chest folder system
- [ ] Boss Note designation
- [ ] Note tagging with pixel badges
- [ ] Search with "radar scan" animation
- [ ] Sort by "rarity" (importance level)

### Milestone 5: Level Up! (Gamification)
**Goal:** Reward system for engagement

**Deliverables:**
- [ ] XP system based on word count and activity
- [ ] Level progression display
- [ ] Achievement badge system
- [ ] Unlockable themes/palettes
- [ ] Stats dashboard (notes created, words written, streak)

### Milestone 6: Polish & Launch
**Goal:** Final touches and deployment

**Deliverables:**
- [ ] Random encounter popup events
- [ ] Power-up animations
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Deployment to production

---

## Visual Design Specifications

### Color Palettes (Selectable Themes)

**Classic GBA (Default)**
```
Background:  #9BBC0F (Lime Green)
Light:       #8BAC0F
Medium:      #306230
Dark:        #0F380F
```

**Night Mode**
```
Background:  #1A1C2C
Light:       #5D275D
Medium:      #B13E53
Dark:        #38002B
```

**Ocean Quest**
```
Background:  #3F3F74
Light:       #5A5A8F
Medium:      #1E1E3F
Dark:        #0E0E1F
```

### Typography
- **Primary:** Press Start 2P (Google Fonts)
- **Note Content:** Pixel-styled monospace with readability
- **Size Scale:** 8px base, scaled by 2x multiples

### UI Elements
- 3px pixel borders on all containers
- Dithered gradients for depth
- Animated sprite buttons
- Scanline overlay option for authenticity

---

## Target User Experience

### New User Flow
1. Boot screen with "PIXELSCRIBE" pixel logo animation
2. Character select (choose your mascot sprite)
3. Brief tutorial as a "Training Quest"
4. First note creation with celebratory animation
5. XP earned notification

### Daily User Flow
1. Quick load with mascot greeting
2. Quest log (note list) with recent activity
3. Create/edit notes with companion reactions
4. Earn XP, potentially unlock new item
5. "Progress Saved" confirmation on exit

---

## Success Metrics
- User completes at least 3 notes in first session
- 60% of users return within 7 days
- Average session length > 5 minutes
- Positive feedback on "fun factor" and nostalgia

---

## Out of Scope (For Initial Release)
- Cloud sync / multi-device
- Collaborative notes
- Rich media embedding (images/files)
- Export to other formats
- User accounts / authentication

*These features are great ideas for future "expansion packs" but not part of the core adventure.*

---

## Timeline Approach
Each milestone builds upon the previous. We ship incrementally, validating that the quirky concept resonates before adding complexity. The core note-taking must work flawlessly before gamification layers are added.

---

*"Every great adventure begins with a single note."*
— PixelScribe Loading Screen
