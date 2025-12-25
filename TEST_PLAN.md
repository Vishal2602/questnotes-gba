# QuestNotes / Pocket Scribe - Test Plan

A comprehensive test plan for the 16-bit GBA-style quirky note-taking RPG experience.

---

## Overview

This application has two implementations:
- **QuestNotes (React)**: Quest-based notes with dungeons, companions, and XP system
- **Pocket Scribe (Vanilla JS)**: Battle mode where notes fight each other

Both share the core quirky mechanics that need thorough testing.

---

## Unit Tests

### 1. XP & Leveling System (`src/utils/xp.ts`)

| Test ID | Test Case | Input | Expected Output |
|---------|-----------|-------|-----------------|
| XP-001 | Calculate XP for level 1 | `xpForLevel(1)` | `100` |
| XP-002 | Calculate XP for level 2 | `xpForLevel(2)` | `150` (100 * 1.5) |
| XP-003 | Calculate XP for level 5 | `xpForLevel(5)` | `506` (approx) |
| XP-004 | Handle level 0 (edge case) | `xpForLevel(0)` | `0` |
| XP-005 | Handle negative level | `xpForLevel(-1)` | `0` |
| XP-006 | Total XP for level 1 | `totalXpForLevel(1)` | `0` |
| XP-007 | Total XP for level 3 | `totalXpForLevel(3)` | `250` (100+150) |
| XP-008 | Calculate level from 0 XP | `calculateLevel(0)` | `1` |
| XP-009 | Calculate level from 99 XP | `calculateLevel(99)` | `1` |
| XP-010 | Calculate level from 100 XP | `calculateLevel(100)` | `2` |
| XP-011 | Calculate level from 250 XP | `calculateLevel(250)` | `3` |
| XP-012 | Level progress at 0 XP | `calculateLevelProgress(0)` | `0` |
| XP-013 | Level progress at 50 XP | `calculateLevelProgress(50)` | `50` |
| XP-014 | XP to next level from 0 | `xpToNextLevel(0)` | `100` |
| XP-015 | XP to next level from 50 | `xpToNextLevel(50)` | `50` |
| XP-016 | Level 99 cap (no infinite loop) | `calculateLevel(999999)` | `99` (capped) |
| XP-017 | Rank title for level 1 | `getRankTitle(1)` | `'Peasant'` |
| XP-018 | Rank title for level 5 | `getRankTitle(5)` | `'Initiate'` |
| XP-019 | Rank title for level 10 | `getRankTitle(10)` | `'Journeyman'` |
| XP-020 | Rank title for level 50+ | `getRankTitle(50)` | `'Legendary Scribe'` |

### 2. Storage System (`src/utils/storage.ts`)

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| STR-001 | Save game state | Call `saveGame(validState)` | localStorage contains wrapped data |
| STR-002 | Load non-existent save | Clear localStorage, call `loadGame()` | Returns `null` |
| STR-003 | Load valid save | Save then load | Returns identical state |
| STR-004 | Handle corrupted JSON | Set invalid JSON in localStorage | Returns `null`, logs error |
| STR-005 | Handle missing quests array | Save `{data: {dungeons: []}}` | Returns `null` |
| STR-006 | Handle missing dungeons array | Save `{data: {quests: []}}` | Returns `null` |
| STR-007 | Version mismatch warning | Save with version 2, load with version 1 | Logs warning, still loads |
| STR-008 | Clear save | `clearSave()` then `loadGame()` | Returns `null` |
| STR-009 | Export save | `exportSave()` | Returns JSON string |
| STR-010 | Import valid save | `importSave(validJson)` | Returns `true`, data in storage |
| STR-011 | Import invalid save | `importSave('not json')` | Returns `false` |
| STR-012 | Handle localStorage full | Fill localStorage, try `saveGame()` | Fails silently, logs error |
| STR-013 | Handle localStorage disabled | Mock localStorage error | Fails silently |

### 3. Priority Configuration (`src/types/index.ts`)

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| PRI-001 | Slime XP value | `PRIORITY_CONFIG.slime.xp` = `10` |
| PRI-002 | Goblin XP value | `PRIORITY_CONFIG.goblin.xp` = `25` |
| PRI-003 | Dragon XP value | `PRIORITY_CONFIG.dragon.xp` = `50` |
| PRI-004 | All priorities have colors | All 3 have non-empty color strings |
| PRI-005 | All priorities have emojis | All 3 have emoji strings |

### 4. Category Configuration

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| CAT-001 | Knight category label | `'Tasks'` |
| CAT-002 | Mage category label | `'Ideas'` |
| CAT-003 | Bard category label | `'Journal'` |
| CAT-004 | Rogue category label | `'Secrets'` |
| CAT-005 | All categories have unique colors | 4 distinct color values |

---

## Integration Tests

### 5. Game Context & Reducer (`src/context/GameContext.tsx`)

| Test ID | Test Case | Action | Expected State Change |
|---------|-----------|--------|----------------------|
| CTX-001 | Add quest | `ADD_QUEST` | Quest added to `state.quests` |
| CTX-002 | Add quest with null dungeonId | `ADD_QUEST` with `dungeonId: null` | Quest in "Wilderness" |
| CTX-003 | Update quest | `UPDATE_QUEST` | Quest modified in place |
| CTX-004 | Delete quest | `DELETE_QUEST` | Quest removed from array |
| CTX-005 | Complete quest gains XP | `COMPLETE_QUEST` for slime | XP +10, completedQuests +1 |
| CTX-006 | Complete dragon quest | `COMPLETE_QUEST` for dragon | XP +50 |
| CTX-007 | Complete already-completed quest | `COMPLETE_QUEST` twice | No XP change second time |
| CTX-008 | Uncomplete quest removes XP | `UNCOMPLETE_QUEST` | XP decreased, min 0 |
| CTX-009 | Uncomplete non-completed quest | `UNCOMPLETE_QUEST` on incomplete | State unchanged |
| CTX-010 | Add dungeon | `ADD_DUNGEON` | Dungeon added |
| CTX-011 | Delete dungeon moves quests | `DELETE_DUNGEON` with quests inside | Quests get `dungeonId: null` |
| CTX-012 | Delete selected dungeon | Delete currently selected | `selectedDungeonId` becomes `null` |
| CTX-013 | Select dungeon | `SELECT_DUNGEON` | `selectedDungeonId` updated |
| CTX-014 | Select null (all quests) | `SELECT_DUNGEON` with `null` | Shows all quests |
| CTX-015 | Toggle sound on | `TOGGLE_SOUND` when off | `soundEnabled: true` |
| CTX-016 | Toggle sound off | `TOGGLE_SOUND` when on | `soundEnabled: false` |
| CTX-017 | Set companion | `SET_COMPANION` to 'dragon' | `character.companion: 'dragon'` |
| CTX-018 | Set character name | `SET_CHARACTER_NAME` | `character.name` updated |
| CTX-019 | Reset game | `RESET_GAME` | Returns to initial state |
| CTX-020 | Load state | `LOAD_STATE` | Replaces entire state |
| CTX-021 | Level up on XP gain | Add enough XP | `character.level` increases |
| CTX-022 | Multiple level ups | Add massive XP | Level increases multiple times |

### 6. Achievement System

| Test ID | Test Case | Trigger Condition | Achievement Unlocked |
|---------|-----------|-------------------|---------------------|
| ACH-001 | First quest | Complete 1 quest | `first_quest` |
| ACH-002 | Ten quests | Complete 10 quests | `ten_quests` |
| ACH-003 | Fifty quests | Complete 50 quests | `fifty_quests` |
| ACH-004 | Hundred quests | Complete 100 quests | `hundred_quests` |
| ACH-005 | Dragon slayer | Complete dragon-priority quest | `first_dragon` |
| ACH-006 | Dungeon master | Create first dungeon | `first_dungeon` |
| ACH-007 | Level 5 | Reach level 5 | `level_5` |
| ACH-008 | Level 10 | Reach level 10 | `level_10` |
| ACH-009 | Night owl | Complete quest 12AM-5AM | `night_owl` |
| ACH-010 | Early bird | Complete quest 5AM-7AM | `early_bird` |
| ACH-011 | No duplicate achievements | Complete 10 quests twice | Only unlocks once |
| ACH-012 | Achievement persists after reset | Unlock, reload page | Still unlocked |

### 7. Companion Mood System (`src/components/Character/Companion.tsx`)

| Test ID | Test Case | State | Expected Mood |
|---------|-----------|-------|---------------|
| CMP-001 | No completed quests | Empty quest history | `'idle'` |
| CMP-002 | Just completed quest | Quest completed < 1 hour ago | `'happy'` |
| CMP-003 | Inactive for 24+ hours | Last completion > 24 hours | `'sleeping'` |
| CMP-004 | Too many dragon quests | 4+ incomplete dragon quests | `'worried'` |
| CMP-005 | Normal activity | 1-24 hours since completion | `'idle'` |
| CMP-006 | Worried takes priority | 4 dragons + just completed | `'worried'` (not happy) |

---

## Component Tests

### 8. PixelButton (`src/components/UI/PixelButton.tsx`)

| Test ID | Test Case | Props | Expected Behavior |
|---------|-----------|-------|-------------------|
| BTN-001 | Renders children | `children="Click me"` | Text visible |
| BTN-002 | Primary variant | `variant="primary"` | Has `pixel-button--primary` class |
| BTN-003 | Danger variant | `variant="danger"` | Has `pixel-button--danger` class |
| BTN-004 | Disabled state | `disabled={true}` | Button disabled, onClick not fired |
| BTN-005 | Click handler | `onClick={mockFn}` | Function called on click |
| BTN-006 | Full width | `fullWidth={true}` | Has `pixel-button--full` class |
| BTN-007 | Small size | `size="small"` | Has `pixel-button--small` class |
| BTN-008 | Submit type | `type="submit"` | Button type is submit |

### 9. PixelInput (`src/components/UI/PixelInput.tsx`)

| Test ID | Test Case | Props | Expected Behavior |
|---------|-----------|-------|-------------------|
| INP-001 | Renders with value | `value="test"` | Input shows "test" |
| INP-002 | onChange fires | Type in input | `onChange` called with new value |
| INP-003 | Placeholder shows | `placeholder="Enter..."` | Placeholder visible |
| INP-004 | maxLength enforced | `maxLength={5}` | Can't type beyond 5 chars |
| INP-005 | Disabled state | `disabled={true}` | Input not editable |
| INP-006 | Autofocus works | `autoFocus={true}` | Input focused on mount |

### 10. PixelTextarea

| Test ID | Test Case | Props | Expected Behavior |
|---------|-----------|-------|-------------------|
| TXT-001 | Renders multiple rows | `rows={4}` | 4-row textarea |
| TXT-002 | onChange fires | Type text | `onChange` called |
| TXT-003 | maxLength on textarea | `maxLength={100}` | Enforced |

### 11. PixelSelect

| Test ID | Test Case | Props | Expected Behavior |
|---------|-----------|-------|-------------------|
| SEL-001 | Renders options | `options=[{value, label}]` | Options visible |
| SEL-002 | Selected value | `value="mage"` | Mage option selected |
| SEL-003 | onChange fires | Change selection | `onChange` with new value |

### 12. PixelModal (`src/components/UI/PixelModal.tsx`)

| Test ID | Test Case | Props/Action | Expected Behavior |
|---------|-----------|--------------|-------------------|
| MOD-001 | Not visible when closed | `isOpen={false}` | Nothing rendered |
| MOD-002 | Visible when open | `isOpen={true}` | Modal visible |
| MOD-003 | Title displayed | `title="Settings"` | "Settings" in header |
| MOD-004 | Escape closes modal | Press Escape key | `onClose` called |
| MOD-005 | Overlay click closes | Click outside modal | `onClose` called |
| MOD-006 | Content click doesn't close | Click inside modal | `onClose` NOT called |
| MOD-007 | Focus trap | Tab navigation | Focus stays in modal |
| MOD-008 | Body scroll locked | Open modal | `body.style.overflow = 'hidden'` |
| MOD-009 | Close button works | Click X button | `onClose` called |
| MOD-010 | Hide close button | `showCloseButton={false}` | No X button |

### 13. ConfirmModal

| Test ID | Test Case | Action | Expected Behavior |
|---------|-----------|--------|-------------------|
| CFM-001 | Shows message | `message="Delete?"` | Message displayed |
| CFM-002 | Confirm triggers callback | Click confirm button | `onConfirm` + `onClose` called |
| CFM-003 | Cancel only closes | Click cancel | Only `onClose` called |
| CFM-004 | Danger variant styling | `variant="danger"` | Red confirm button |

### 14. XPBar (`src/components/Character/XPBar.tsx`)

| Test ID | Test Case | Character State | Expected Display |
|---------|-----------|-----------------|------------------|
| XPB-001 | Shows level | `level: 5` | "Lv.5" displayed |
| XPB-002 | Shows rank | `level: 10` | "Journeyman" displayed |
| XPB-003 | Progress bar width | 50% progress | Fill at 50% width |
| XPB-004 | XP to next level | 50 XP remaining | "50 XP to next level" |
| XPB-005 | Empty progress bar | 0 XP into level | 0% fill |
| XPB-006 | Full progress bar | 99% progress | 99% fill |

### 15. Header (`src/components/Layout/Header.tsx`)

| Test ID | Test Case | Action | Expected Behavior |
|---------|-----------|--------|-------------------|
| HDR-001 | Shows quest count | 5 total, 3 completed | "3/5" displayed |
| HDR-002 | Settings modal opens | Click gear icon | Settings modal visible |
| HDR-003 | Achievements modal opens | Click trophy | Achievements modal visible |
| HDR-004 | Name change saves | Edit name, save | Character name updated |
| HDR-005 | Empty name rejected | Save with empty name | Name not changed |
| HDR-006 | Companion change | Select dragon | Companion updated |
| HDR-007 | Sound toggle | Click sound button | Sound state flipped |
| HDR-008 | Achievement count | 3 unlocked | "3" shown on trophy |

### 16. Sidebar (`src/components/Layout/Sidebar.tsx`)

| Test ID | Test Case | Action | Expected Behavior |
|---------|-----------|--------|-------------------|
| SDB-001 | Shows all quests option | Render | "All Quests" visible |
| SDB-002 | Shows wilderness option | Render | "Wilderness" visible |
| SDB-003 | Shows user dungeons | 3 dungeons created | 3 dungeon items visible |
| SDB-004 | Empty state | No dungeons | Empty message shown |
| SDB-005 | Quest count badges | 5 incomplete quests | Badge shows "5" |
| SDB-006 | Active dungeon highlighted | Select dungeon | Has active class |
| SDB-007 | Create dungeon | Fill form, submit | New dungeon in list |
| SDB-008 | Edit dungeon (context menu) | Right-click dungeon | Edit modal opens |
| SDB-009 | Delete dungeon | Click delete in edit modal | Dungeon removed |
| SDB-010 | Icon picker works | Click different icon | Icon updates |
| SDB-011 | Empty name rejected | Try save with no name | Button disabled |
| SDB-012 | Dungeon name max length | Type 31+ chars | Capped at 30 |

---

## Pocket Scribe (Vanilla JS) Tests

### 17. Audio Manager (`app.js`)

| Test ID | Test Case | Action | Expected Behavior |
|---------|-----------|--------|-------------------|
| AUD-001 | Initialize audio context | Click page | AudioContext created |
| AUD-002 | Play select sound | `AudioManager.playSelect()` | 440Hz tone plays |
| AUD-003 | Play confirm sound | `AudioManager.playConfirm()` | Two-tone chime |
| AUD-004 | Handle no audio support | Mock unsupported browser | No errors thrown |
| AUD-005 | Level up fanfare | `AudioManager.playLevelUp()` | 4-note melody |
| AUD-006 | Victory sound | `AudioManager.playVictory()` | 6-note melody |

### 18. Note Battle System

| Test ID | Test Case | Setup | Expected Result |
|---------|-----------|-------|-----------------|
| BTL-001 | Need 2 notes to battle | 1 note | Battle disabled |
| BTL-002 | Select two notes | Click two notes | Both highlighted |
| BTL-003 | Max 2 selection | Try selecting third | First deselected |
| BTL-004 | Battle damage calculation | Note power 15 | Damage ~ 15-25 range |
| BTL-005 | Winner gains level | Battle ends | Winner level +1 |
| BTL-006 | Winner gains power | Battle ends | Winner power +5 |
| BTL-007 | Battle grants XP | Battle ends | Player +25 XP |
| BTL-008 | HP bar decreases | Take damage | Visual bar shrinks |
| BTL-009 | Low HP indicator | HP < 30% | Red/low class added |
| BTL-010 | Battle log scrolls | Many attacks | Auto-scroll to bottom |
| BTL-011 | Draw after 10 rounds | Equal power notes | "IT'S A DRAW!" |

### 19. Note Mood System

| Test ID | Test Case | Mood | Expected Power |
|---------|-----------|------|----------------|
| MOD-001 | Fire mood power | 'fire' | 15 base power |
| MOD-002 | Water mood power | 'water' | 10 base power |
| MOD-003 | Earth mood power | 'earth' | 12 base power |
| MOD-004 | Lightning mood power | 'lightning' | 18 base power |
| MOD-005 | Star mood power | 'star' | 20 base power |
| MOD-006 | Word count bonus | 50 words | +10 power |

### 20. Note Level Calculation

| Test ID | Test Case | Word Count | Expected Level |
|---------|-----------|------------|----------------|
| NLV-001 | Minimum words | 1 word | Level 1 |
| NLV-002 | Short note | 3 words | Level 2 |
| NLV-003 | Medium note | 15 words | Level 4 |
| NLV-004 | Long note | 63 words | Level 6 |
| NLV-005 | Very long note | 127 words | Level 7 |

### 21. Pocket Scribe XP System

| Test ID | Test Case | Action | Expected XP Gain |
|---------|-----------|--------|------------------|
| PSX-001 | Create note | 10 words | 10 + (10*2) = 30 XP |
| PSX-002 | Win battle | Any battle | +25 XP |
| PSX-003 | Level up threshold | 100 XP at level 1 | Level 2 |
| PSX-004 | Threshold increases | Level 2 | Need 150 XP for level 3 |
| PSX-005 | Update note word bonus | Add 10 words | +20 XP |

---

## Edge Cases & Destructive Tests

### 22. Input Validation

| Test ID | Test Case | Input | Expected Behavior |
|---------|-----------|-------|-------------------|
| VAL-001 | Empty quest title | "" | Rejected, error shown |
| VAL-002 | Very long quest title | 1000 chars | Truncated or rejected |
| VAL-003 | XSS in quest title | `<script>alert(1)</script>` | Escaped, no execution |
| VAL-004 | SQL injection attempt | `'; DROP TABLE--` | Treated as literal text |
| VAL-005 | Emoji in dungeon name | `Emoji Dungeon` | Accepted, displays correctly |
| VAL-006 | Unicode characters | Japanese/Chinese chars | Renders correctly |
| VAL-007 | Only whitespace | `"   "` | Treated as empty |
| VAL-008 | Newlines in note content | Multi-line text | Preserved |

### 23. State Corruption Recovery

| Test ID | Test Case | Corrupted State | Expected Recovery |
|---------|-----------|-----------------|-------------------|
| COR-001 | Missing character | `{quests: [], dungeons: []}` | Use default character |
| COR-002 | Negative XP | `character.xp = -100` | Clamp to 0 |
| COR-003 | Invalid companion | `companion: 'unicorn'` | Fall back to default |
| COR-004 | Quest with deleted dungeon | `dungeonId: 'nonexistent'` | Treat as wilderness |
| COR-005 | NaN level | `level: NaN` | Reset to 1 |
| COR-006 | Array instead of string | `name: ['Bob']` | Handle gracefully |

### 24. Performance & Limits

| Test ID | Test Case | Action | Expected Behavior |
|---------|-----------|--------|-------------------|
| PRF-001 | 1000 quests | Load 1000 quests | UI remains responsive |
| PRF-002 | 100 dungeons | Create 100 dungeons | Sidebar renders |
| PRF-003 | Very long note content | 10,000 character note | Saves and displays |
| PRF-004 | Rapid quest completion | Complete 50 quests fast | All XP awarded correctly |
| PRF-005 | localStorage limit | Fill storage | Graceful failure |

### 25. Concurrent Operations

| Test ID | Test Case | Actions | Expected Result |
|---------|-----------|---------|-----------------|
| CON-001 | Double-click save | Click save twice fast | Only one quest created |
| CON-002 | Delete while editing | Delete quest being edited | Handle gracefully |
| CON-003 | Toggle dungeon while deleting | Switch + delete | No race condition |

---

## User Acceptance Criteria

### 26. Core Note-Taking Flow

| UAC ID | Scenario | Steps | Acceptance Criteria |
|--------|----------|-------|---------------------|
| UAC-001 | Create first note | New user creates note | Note saved, XP gained, companion reacts happily |
| UAC-002 | Organize with dungeons | Create dungeon, move notes | Notes appear in correct dungeon |
| UAC-003 | Complete a quest | Mark note as done | Satisfying visual feedback, XP animation |
| UAC-004 | Level up experience | Gain enough XP | Level up overlay with fanfare |
| UAC-005 | Achievement unlock | Complete first dragon quest | Achievement toast, badge visible |

### 27. GBA Aesthetic Experience

| UAC ID | Scenario | Observation | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| UAC-006 | Pixel-perfect rendering | View UI | Sharp pixels, no blurring |
| UAC-007 | 8-bit sound effects | Interact with buttons | Chiptune-style sounds |
| UAC-008 | Retro color palette | View application | GBA-inspired colors |
| UAC-009 | Pixel font display | Read text | Press Start 2P or similar font |
| UAC-010 | Nostalgic animations | Use app | Scanlines, pixel transitions |

### 28. Battle Mode Experience (Pocket Scribe)

| UAC ID | Scenario | Steps | Acceptance Criteria |
|--------|----------|-------|---------------------|
| UAC-011 | Epic battle | Two high-level notes fight | Dramatic animation, sound effects |
| UAC-012 | Victory celebration | Win a battle | Winner note levels up, fanfare plays |
| UAC-013 | Battle log clarity | Watch battle | Can follow damage/actions |

### 29. Companion Interaction

| UAC ID | Scenario | State | Acceptance Criteria |
|--------|----------|-------|---------------------|
| UAC-014 | Companion greeting | Open app | Companion displays mood message |
| UAC-015 | Happy companion | Just completed quest | Companion bounces/celebrates |
| UAC-016 | Worried companion | Many overdue dragons | Companion shows concern |
| UAC-017 | Change companion | Settings modal | Can switch between 4 companions |

### 30. Data Persistence

| UAC ID | Scenario | Steps | Acceptance Criteria |
|--------|----------|-------|---------------------|
| UAC-018 | Data survives refresh | Create notes, refresh | All data preserved |
| UAC-019 | Data survives browser close | Close/reopen browser | All data preserved |
| UAC-020 | Export/import works | Export, clear, import | Data restored exactly |

---

## Accessibility Tests

### 31. Keyboard Navigation

| Test ID | Test Case | Action | Expected Behavior |
|---------|-----------|--------|-------------------|
| A11Y-001 | Tab navigation | Press Tab | Focus moves logically |
| A11Y-002 | Modal focus trap | Open modal, Tab | Focus stays in modal |
| A11Y-003 | Escape closes modal | Press Escape | Modal closes |
| A11Y-004 | Enter activates buttons | Focus button, Enter | Button clicked |
| A11Y-005 | Arrow keys in lists | Navigate list | Selection moves |

### 32. Screen Reader

| Test ID | Test Case | Element | Expected Announcement |
|---------|-----------|---------|----------------------|
| A11Y-006 | Modal role | Open modal | "Dialog" announced |
| A11Y-007 | Button labels | Focus button | Action announced |
| A11Y-008 | Achievement status | Achievement list | Locked/unlocked state |

### 33. Visual Accessibility

| Test ID | Test Case | Check | Expected Result |
|---------|-----------|-------|-----------------|
| A11Y-009 | Color contrast | Text on backgrounds | WCAG AA compliant |
| A11Y-010 | Focus indicators | Tab through | Visible focus ring |
| A11Y-011 | No seizure risk | View animations | Safe animation speeds |

---

## Cross-Browser Tests

| Test ID | Browser | Key Checks |
|---------|---------|------------|
| XBR-001 | Chrome 120+ | Full functionality |
| XBR-002 | Firefox 120+ | Web Audio, localStorage |
| XBR-003 | Safari 17+ | CSS rendering, fonts |
| XBR-004 | Edge 120+ | Full functionality |
| XBR-005 | Mobile Chrome | Touch interactions |
| XBR-006 | Mobile Safari | iOS-specific behaviors |

---

## Regression Test Priorities

### Critical (Run Every Deploy)
- STR-001 to STR-003 (Save/Load)
- CTX-005, CTX-008 (XP system)
- MOD-001, MOD-002 (Modal open/close)
- UAC-001 (Create note)
- UAC-018 (Data persistence)

### High (Run Daily)
- All achievement tests
- Battle system tests
- Companion mood tests

### Medium (Run Weekly)
- Edge case validation
- Performance tests
- Accessibility tests

### Low (Run Pre-Release)
- Cross-browser tests
- Full UAC suite

---

## Test Environment Setup

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests (if configured)
npm run test:e2e

# Manual testing
npm run dev
# Open http://localhost:5173
```

---

## Bug Severity Definitions

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Data loss, app crash | Notes deleted on save |
| High | Major feature broken | Can't create new notes |
| Medium | Feature works incorrectly | Wrong XP calculation |
| Low | Minor visual/UX issue | Font slightly off |
| Cosmetic | Nitpick | Animation timing |

---

*Test plan created by Quinn, QA Tester*
*"Every bug found is a user saved!"*
