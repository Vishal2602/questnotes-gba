# QuirkNotes - 16-Bit GBA Style Design System

## Concept

A nostalgic, Game Boy Advance-inspired note-taking app that feels like you're writing in a retro RPG menu. Notes are treated like "inventory items," categories are "quests," and the whole experience oozes pixel-perfect charm.

---

## Color Palette

### Primary Colors (GBA-Inspired)

| Name | Hex | Usage |
|------|-----|-------|
| **Pixel Purple** | `#5A3472` | Primary brand, headers, active states |
| **Cartridge Teal** | `#30B8A0` | Accents, links, highlights |
| **Screen Green** | `#9BBC0F` | Classic GBA screen tint, success states |
| **Link Pink** | `#F878B0` | Special actions, favorite notes |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Dark Dungeon** | `#1A1A2E` | Main background |
| **Midnight Blue** | `#16213E` | Card backgrounds, secondary areas |
| **Deep Cave** | `#0F0F1A` | Modal overlays, dropdowns |
| **Panel Gray** | `#2D2D44` | Input fields, inactive elements |

### UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Parchment** | `#E8E4D9` | Primary text |
| **Faded Scroll** | `#A8A498` | Secondary text, placeholders |
| **Gold Coin** | `#FFD700` | Stars, important markers |
| **Potion Red** | `#E84855` | Delete, warnings, errors |
| **Mana Blue** | `#4A90D9` | Info states, tips |

---

## Typography

### Font Stack

```css
/* Primary - Pixel Font */
--font-pixel: 'Press Start 2P', 'Courier New', monospace;

/* Secondary - Readable Retro */
--font-retro: 'VT323', 'Lucida Console', monospace;

/* Fallback */
--font-system: -apple-system, BlinkMacSystemFont, monospace;
```

### Type Scale (8px base - GBA native resolution friendly)

| Level | Size | Line Height | Usage |
|-------|------|-------------|-------|
| **xs** | 8px | 12px | Tiny labels, timestamps |
| **sm** | 10px | 14px | Secondary info, hints |
| **base** | 12px | 18px | Body text, note content |
| **md** | 14px | 20px | Subheadings, buttons |
| **lg** | 16px | 24px | Section headers |
| **xl** | 20px | 28px | Page titles |
| **xxl** | 24px | 32px | Hero text, logo |

### Text Styles

```css
/* Headings - Always pixel font */
.heading {
  font-family: var(--font-pixel);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #000;
}

/* Body - Readable retro */
.body-text {
  font-family: var(--font-retro);
  letter-spacing: 0.5px;
}

/* Special - Glowing effect for important items */
.glow-text {
  text-shadow: 0 0 8px var(--cartridge-teal);
}
```

---

## Spacing Scale

Based on 4px grid (GBA-friendly pixel alignment)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Element spacing, small gaps |
| `--space-3` | 12px | Button padding, list items |
| `--space-4` | 16px | Card padding, sections |
| `--space-5` | 24px | Large section gaps |
| `--space-6` | 32px | Page margins |
| `--space-7` | 48px | Major section breaks |
| `--space-8` | 64px | Hero spacing |

---

## Component Styles

### Note Card (Inventory Item Style)

```css
.note-card {
  background: linear-gradient(135deg, #16213E 0%, #1A1A2E 100%);
  border: 3px solid #5A3472;
  border-radius: 0; /* Pixel-perfect sharp corners */
  padding: var(--space-4);
  position: relative;

  /* Pixel border effect */
  box-shadow:
    4px 4px 0 #000,
    inset -2px -2px 0 #3D2452,
    inset 2px 2px 0 #7A4A92;
}

.note-card:hover {
  border-color: var(--cartridge-teal);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000;
}

/* Rarity indicators (note importance) */
.note-card--common { border-color: #A8A498; }
.note-card--rare { border-color: #4A90D9; }
.note-card--epic { border-color: #9B59B6; }
.note-card--legendary { border-color: #FFD700; }
```

### Buttons (Menu Select Style)

```css
.btn {
  font-family: var(--font-pixel);
  font-size: 10px;
  text-transform: uppercase;
  padding: var(--space-3) var(--space-4);
  border: 2px solid;
  background: var(--panel-gray);
  color: var(--parchment);
  cursor: pointer;
  position: relative;

  /* Pixel button depth */
  box-shadow:
    3px 3px 0 #000,
    inset -1px -1px 0 #1A1A2E,
    inset 1px 1px 0 #4A4A64;
}

.btn:hover {
  background: var(--pixel-purple);
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #000;
}

/* Cursor pointer indicator */
.btn::before {
  content: '>';
  position: absolute;
  left: -16px;
  opacity: 0;
  color: var(--cartridge-teal);
  animation: blink 0.5s steps(2) infinite;
}

.btn:hover::before,
.btn:focus::before {
  opacity: 1;
}

@keyframes blink {
  50% { opacity: 0; }
}
```

### Input Fields (Text Box Style)

```css
.input {
  font-family: var(--font-retro);
  font-size: 14px;
  background: #0F0F1A;
  border: 2px solid var(--panel-gray);
  color: var(--screen-green);
  padding: var(--space-3);
  width: 100%;

  /* CRT scanline effect */
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
}

.input:focus {
  outline: none;
  border-color: var(--cartridge-teal);
  box-shadow: 0 0 8px rgba(48, 184, 160, 0.3);
}

.input::placeholder {
  color: var(--faded-scroll);
  opacity: 0.6;
}
```

### Category Tabs (Quest Menu Style)

```css
.category-tab {
  font-family: var(--font-pixel);
  font-size: 8px;
  padding: var(--space-2) var(--space-3);
  background: var(--deep-cave);
  border: 2px solid var(--panel-gray);
  border-bottom: none;
  color: var(--faded-scroll);
  position: relative;
  top: 2px;
}

.category-tab--active {
  background: var(--midnight-blue);
  border-color: var(--pixel-purple);
  color: var(--parchment);
  z-index: 1;
}

/* Quest icon prefix */
.category-tab::before {
  content: '[ ]';
  margin-right: var(--space-2);
  color: var(--faded-scroll);
}

.category-tab--active::before {
  content: '[*]';
  color: var(--gold-coin);
}
```

### Modal / Dialog (Menu Window Style)

```css
.modal {
  background: var(--midnight-blue);
  border: 4px solid var(--pixel-purple);
  padding: var(--space-5);
  max-width: 400px;
  position: relative;

  /* Double border pixel effect */
  box-shadow:
    6px 6px 0 #000,
    inset 0 0 0 2px var(--dark-dungeon),
    inset 0 0 0 4px var(--pixel-purple);
}

/* Title bar */
.modal-header {
  background: linear-gradient(90deg, var(--pixel-purple), var(--link-pink));
  margin: calc(var(--space-5) * -1);
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  border-bottom: 2px solid #000;
}

.modal-title {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
}
```

### Scrollbar (Custom Pixel Style)

```css
::-webkit-scrollbar {
  width: 12px;
  background: var(--deep-cave);
}

::-webkit-scrollbar-thumb {
  background: var(--pixel-purple);
  border: 2px solid var(--deep-cave);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--cartridge-teal);
}

::-webkit-scrollbar-button {
  background: var(--panel-gray);
  height: 12px;
}
```

---

## Icons (Pixel Art Style)

All icons should be 16x16 or 24x24 pixel art style.

| Icon | Purpose | Style Notes |
|------|---------|-------------|
| Scroll | New note | Rolled parchment, tied with ribbon |
| Chest | Categories/folders | Wooden treasure chest |
| Star | Favorites | 5-point pixel star |
| Trash | Delete | Potion bottle (breaking) |
| Quill | Edit | Feather pen with ink |
| Magnifier | Search | Classic RPG inspect icon |
| Gear | Settings | 8-tooth cog wheel |
| Heart | Important | Pixel heart (Zelda-style) |

---

## Animations

### Cursor Blink
```css
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

### Item Appear (Notes loading in)
```css
@keyframes item-appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger delay for list items */
.note-card:nth-child(1) { animation-delay: 0ms; }
.note-card:nth-child(2) { animation-delay: 50ms; }
.note-card:nth-child(3) { animation-delay: 100ms; }
/* etc... */
```

### Button Press
```css
@keyframes button-press {
  0% { transform: translate(0, 0); }
  50% { transform: translate(2px, 2px); }
  100% { transform: translate(0, 0); }
}
```

### Success Flash (Note saved)
```css
@keyframes success-flash {
  0%, 100% {
    box-shadow: 0 0 0 rgba(155, 188, 15, 0);
  }
  50% {
    box-shadow: 0 0 20px rgba(155, 188, 15, 0.8);
  }
}
```

---

## Layout Grid

### Desktop (240px GBA width scaled up)
- Container max-width: 960px (4x GBA)
- 3-column grid for notes
- 240px sidebar for categories

### Tablet
- 2-column grid for notes
- Collapsible sidebar

### Mobile (GBA Portrait Mode)
- Single column
- Bottom navigation bar
- Swipe gestures for categories

---

## Sound Design Notes (Optional Enhancement)

To complete the GBA experience, consider these 8-bit sound effects:
- Menu select: Short blip
- Note created: Ascending chime (item acquired)
- Note deleted: Low descending tone
- Category switch: Page flip sound
- Error: Classic "bonk" sound
- Success: Triumphant short fanfare

---

## Quirky Features to Implement

1. **Note Rarity System** - Notes can be tagged as Common, Rare, Epic, or Legendary with corresponding border colors
2. **XP Bar** - Track total notes written, level up your "Scribe" rank
3. **Achievement Badges** - Pixel art badges for milestones (First Note, 100 Notes, etc.)
4. **Random Tip Toast** - "A wild tip appeared!" style notifications
5. **Battle Mode** - Timed note-taking challenges
6. **Save Slots** - Classic "Save File 1, 2, 3" style for note collections
7. **Secret Codes** - Konami code unlocks special themes
8. **Boot Screen** - GBA-style startup animation on load
