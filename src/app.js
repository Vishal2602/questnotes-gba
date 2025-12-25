/**
 * POCKET SCRIBE - GBA Note Quest
 * A quirky 16-bit style note-taking RPG experience
 */

// ==========================================
// GAME STATE & DATA
// ==========================================

const GameState = {
    notes: [],
    stats: {
        level: 1,
        xp: 0,
        xpToLevel: 100,
        totalXP: 0,
        battlesWon: 0,
        totalWords: 0
    },
    achievements: {
        first_note: false,
        note_collector: false,
        first_battle: false,
        word_master: false
    },
    currentScreen: 'title',
    selectedNote: null,
    battleNotes: [],
    creatureMessages: [
        "Ready to take notes!",
        "Let's write something!",
        "I'm feeling creative!",
        "Notes are power!",
        "*happy bounce*",
        "What wisdom today?",
        "Scrolls await!",
        "Adventure time!",
        "*scribble scribble*"
    ]
};

// Mood configurations
const MOODS = {
    fire: { emoji: '🔥', name: 'Fire', power: 15, description: 'Urgent' },
    water: { emoji: '💧', name: 'Water', power: 10, description: 'Calm' },
    earth: { emoji: '🌿', name: 'Earth', power: 12, description: 'Important' },
    lightning: { emoji: '⚡', name: 'Lightning', power: 18, description: 'Idea' },
    star: { emoji: '⭐', name: 'Star', power: 20, description: 'Favorite' }
};

// ==========================================
// SOUND EFFECTS (8-bit style using Web Audio)
// ==========================================

const AudioManager = {
    ctx: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio not supported');
        }
    },

    playTone(frequency, duration, type = 'square') {
        if (!this.ctx) return;

        try {
            const oscillator = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

            gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.ctx.destination);

            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Ignore audio errors
        }
    },

    playSelect() {
        this.playTone(440, 0.1);
    },

    playConfirm() {
        this.playTone(523, 0.1);
        setTimeout(() => this.playTone(659, 0.1), 100);
    },

    playBack() {
        this.playTone(330, 0.1);
    },

    playSummon() {
        this.playTone(262, 0.1);
        setTimeout(() => this.playTone(330, 0.1), 100);
        setTimeout(() => this.playTone(392, 0.1), 200);
        setTimeout(() => this.playTone(523, 0.2), 300);
    },

    playLevelUp() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15), i * 150);
        });
    },

    playBattleHit() {
        this.playTone(150, 0.1, 'sawtooth');
    },

    playVictory() {
        const melody = [523, 659, 784, 659, 784, 1047];
        melody.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15), i * 120);
        });
    },

    playDelete() {
        this.playTone(200, 0.2, 'sawtooth');
    },

    playAchievement() {
        this.playTone(784, 0.1);
        setTimeout(() => this.playTone(988, 0.1), 100);
        setTimeout(() => this.playTone(1175, 0.2), 200);
    }
};

// ==========================================
// LOCAL STORAGE
// ==========================================

const Storage = {
    KEYS: {
        NOTES: 'pocketscribe_notes',
        STATS: 'pocketscribe_stats',
        ACHIEVEMENTS: 'pocketscribe_achievements'
    },

    save() {
        try {
            localStorage.setItem(this.KEYS.NOTES, JSON.stringify(GameState.notes));
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(GameState.stats));
            localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(GameState.achievements));
        } catch (e) {
            console.error('Failed to save:', e);
        }
    },

    load() {
        try {
            const notes = localStorage.getItem(this.KEYS.NOTES);
            const stats = localStorage.getItem(this.KEYS.STATS);
            const achievements = localStorage.getItem(this.KEYS.ACHIEVEMENTS);

            if (notes) GameState.notes = JSON.parse(notes);
            if (stats) GameState.stats = { ...GameState.stats, ...JSON.parse(stats) };
            if (achievements) GameState.achievements = { ...GameState.achievements, ...JSON.parse(achievements) };
        } catch (e) {
            console.error('Failed to load:', e);
        }
    }
};

// ==========================================
// UI MANAGEMENT
// ==========================================

const UI = {
    screens: {},
    elements: {},

    init() {
        // Cache screen elements
        this.screens = {
            title: document.getElementById('titleScreen'),
            menu: document.getElementById('menuScreen'),
            notes: document.getElementById('notesScreen'),
            newNote: document.getElementById('newNoteScreen'),
            viewNote: document.getElementById('viewNoteScreen'),
            battle: document.getElementById('battleScreen'),
            stats: document.getElementById('statsScreen')
        };

        // Cache common elements
        this.elements = {
            xpFill: document.getElementById('xpFill'),
            xpText: document.getElementById('xpText'),
            noteCount: document.getElementById('noteCount'),
            notesContainer: document.getElementById('notesContainer'),
            emptyMessage: document.getElementById('emptyMessage'),
            scrollCount: document.getElementById('scrollCount'),
            creatureSpeech: document.getElementById('creatureSpeech'),
            menuCreature: document.getElementById('menuCreature'),
            toast: document.getElementById('toast'),
            levelUpOverlay: document.getElementById('levelUpOverlay'),
            newLevel: document.getElementById('newLevel')
        };

        this.bindEvents();
        this.updateUI();
    },

    bindEvents() {
        // Title screen - press start
        this.screens.title.addEventListener('click', () => {
            if (GameState.currentScreen === 'title') {
                AudioManager.playConfirm();
                this.goToScreen('menu');
            }
        });

        // Also handle keyboard for title
        document.addEventListener('keydown', (e) => {
            if (GameState.currentScreen === 'title' && (e.key === 'Enter' || e.key === ' ')) {
                AudioManager.playConfirm();
                this.goToScreen('menu');
            }
        });

        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                AudioManager.playSelect();
                this.selectMenuItem(item);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AudioManager.playBack();
                const target = btn.dataset.goto;
                this.goToScreen(target);
            });
        });

        // Mood selector
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', () => {
                AudioManager.playSelect();
                document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Summon button
        document.getElementById('summonBtn').addEventListener('click', () => {
            this.summonNote();
        });

        // Edit note button
        document.getElementById('editNoteBtn').addEventListener('click', () => {
            this.editNote();
        });

        // Delete note button
        document.getElementById('deleteNoteBtn').addEventListener('click', () => {
            this.deleteNote();
        });

        // Battle button
        document.getElementById('startBattleBtn').addEventListener('click', () => {
            this.startBattle();
        });

        // Level up continue
        document.getElementById('levelUpContinue').addEventListener('click', () => {
            AudioManager.playConfirm();
            this.elements.levelUpOverlay.classList.remove('show');
        });

        // Update creature speech periodically
        setInterval(() => {
            if (GameState.currentScreen === 'menu') {
                this.updateCreatureSpeech();
            }
        }, 5000);
    },

    goToScreen(screenName) {
        // Remove active from all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Activate target screen
        const targetScreen = this.screens[screenName];
        if (targetScreen) {
            targetScreen.classList.add('active');
            GameState.currentScreen = screenName;

            // Screen-specific updates
            switch (screenName) {
                case 'menu':
                    this.updateMenuScreen();
                    break;
                case 'notes':
                    this.updateNotesScreen();
                    break;
                case 'newNote':
                    this.resetNewNoteForm();
                    break;
                case 'battle':
                    this.updateBattleScreen();
                    break;
                case 'stats':
                    this.updateStatsScreen();
                    break;
            }
        }
    },

    selectMenuItem(item) {
        // Update selection visuals
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        // Navigate based on action
        const action = item.dataset.action;
        setTimeout(() => {
            switch (action) {
                case 'notes':
                    this.goToScreen('notes');
                    break;
                case 'new':
                    this.goToScreen('newNote');
                    break;
                case 'battle':
                    this.goToScreen('battle');
                    break;
                case 'stats':
                    this.goToScreen('stats');
                    break;
            }
        }, 150);
    },

    updateUI() {
        this.updateXPBar();
        this.updateNoteCount();
    },

    updateMenuScreen() {
        this.updateXPBar();
        this.updateNoteCount();
        this.updateCreatureSpeech();
    },

    updateXPBar() {
        const { xp, xpToLevel, level } = GameState.stats;
        const percentage = (xp / xpToLevel) * 100;

        this.elements.xpFill.style.width = `${percentage}%`;
        this.elements.xpText.textContent = `XP: ${xp}/${xpToLevel}`;

        // Update level display
        document.querySelector('.player-name').textContent = `SCRIBE LV.${level}`;
    },

    updateNoteCount() {
        this.elements.noteCount.textContent = `(${GameState.notes.length})`;
    },

    updateCreatureSpeech() {
        const messages = GameState.creatureMessages;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.elements.creatureSpeech.textContent = randomMessage;
    },

    updateNotesScreen() {
        const container = this.elements.notesContainer;
        const empty = this.elements.emptyMessage;

        // Clear existing notes (keep empty message)
        const noteCards = container.querySelectorAll('.note-card');
        noteCards.forEach(card => card.remove());

        if (GameState.notes.length === 0) {
            empty.style.display = 'flex';
        } else {
            empty.style.display = 'none';

            // Sort by level/power (higher first)
            const sortedNotes = [...GameState.notes].sort((a, b) => b.level - a.level);

            sortedNotes.forEach(note => {
                const card = this.createNoteCard(note);
                container.appendChild(card);
            });
        }

        this.elements.scrollCount.textContent = `${GameState.notes.length} SCROLLS`;
    },

    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.dataset.id = note.id;
        card.dataset.mood = note.mood;

        const mood = MOODS[note.mood];
        const preview = note.content.substring(0, 30) + (note.content.length > 30 ? '...' : '');

        card.innerHTML = `
            <div class="note-mood-icon">${mood.emoji}</div>
            <div class="note-info">
                <div class="note-title">${this.escapeHtml(note.title)}</div>
                <div class="note-preview">${this.escapeHtml(preview)}</div>
            </div>
            <div class="note-level-badge">LV.${note.level}</div>
        `;

        card.addEventListener('click', () => {
            AudioManager.playSelect();
            this.viewNote(note.id);
        });

        return card;
    },

    viewNote(noteId) {
        const note = GameState.notes.find(n => n.id === noteId);
        if (!note) return;

        GameState.selectedNote = note;

        // Update view elements
        document.getElementById('viewNoteTitle').textContent = note.title;
        document.getElementById('viewNoteLevel').textContent = `LV.${note.level}`;
        document.getElementById('viewNoteMood').textContent = MOODS[note.mood].emoji;
        document.getElementById('viewNotePower').textContent = `PWR: ${note.power}`;
        document.getElementById('viewNoteContent').textContent = note.content;
        document.getElementById('viewNoteDate').textContent = `Created: ${this.formatDate(note.createdAt)}`;

        // Update creature color based on mood
        const creatureDisplay = document.getElementById('noteCreatureDisplay');
        creatureDisplay.className = 'note-creature-display mood-' + note.mood;

        this.goToScreen('viewNote');
    },

    resetNewNoteForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';

        // Reset mood to first option
        document.querySelectorAll('.mood-option').forEach((o, i) => {
            o.classList.toggle('selected', i === 0);
        });
    },

    summonNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const selectedMood = document.querySelector('.mood-option.selected');
        const mood = selectedMood ? selectedMood.dataset.mood : 'fire';

        if (!title) {
            this.showToast('⚠️', 'Name your scroll!');
            return;
        }

        if (!content) {
            this.showToast('⚠️', 'Write some wisdom!');
            return;
        }

        // Play summon animation and sound
        AudioManager.playSummon();

        const summoningCircle = document.getElementById('summoningCircle');
        summoningCircle.parentElement.classList.add('summoning-active');

        setTimeout(() => {
            summoningCircle.parentElement.classList.remove('summoning-active');

            // Calculate note properties
            const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
            const moodPower = MOODS[mood].power;
            const basePower = Math.floor(moodPower + (wordCount / 5));
            const level = Math.max(1, Math.floor(Math.log2(wordCount + 1)));

            // Create note object
            const note = {
                id: Date.now().toString(),
                title,
                content,
                mood,
                power: basePower,
                level,
                createdAt: new Date().toISOString(),
                wins: 0,
                losses: 0
            };

            // Add to notes
            GameState.notes.push(note);

            // Update stats
            GameState.stats.totalWords += wordCount;

            // Grant XP
            const xpGained = 10 + (wordCount * 2);
            this.grantXP(xpGained);

            // Check achievements
            this.checkAchievements();

            // Save
            Storage.save();

            // Show success
            this.showToast('✨', 'Scroll summoned!');

            // Go to notes list
            setTimeout(() => {
                this.goToScreen('notes');
            }, 500);

        }, 500);
    },

    editNote() {
        if (!GameState.selectedNote) return;

        // Pre-fill the form with existing note data
        document.getElementById('noteTitle').value = GameState.selectedNote.title;
        document.getElementById('noteContent').value = GameState.selectedNote.content;

        // Set the mood
        document.querySelectorAll('.mood-option').forEach(o => {
            o.classList.toggle('selected', o.dataset.mood === GameState.selectedNote.mood);
        });

        // Change summon button to update
        const summonBtn = document.getElementById('summonBtn');
        summonBtn.innerHTML = '<span class="btn-icon">✏️</span> UPDATE!';

        // Store that we're editing
        summonBtn.dataset.editing = GameState.selectedNote.id;

        // Override summon behavior temporarily
        const originalHandler = this.summonNote.bind(this);
        summonBtn.onclick = () => {
            this.updateNote(summonBtn.dataset.editing);
            summonBtn.innerHTML = '<span class="btn-icon">✨</span> SUMMON!';
            summonBtn.dataset.editing = '';
            summonBtn.onclick = originalHandler;
        };

        this.goToScreen('newNote');
    },

    updateNote(noteId) {
        const note = GameState.notes.find(n => n.id === noteId);
        if (!note) return;

        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const selectedMood = document.querySelector('.mood-option.selected');
        const mood = selectedMood ? selectedMood.dataset.mood : note.mood;

        if (!title || !content) {
            this.showToast('⚠️', 'Fill all fields!');
            return;
        }

        // Calculate word difference for XP
        const oldWords = note.content.split(/\s+/).filter(w => w.length > 0).length;
        const newWords = content.split(/\s+/).filter(w => w.length > 0).length;
        const wordDiff = newWords - oldWords;

        // Update note
        note.title = title;
        note.content = content;
        note.mood = mood;
        note.power = Math.floor(MOODS[mood].power + (newWords / 5));
        note.level = Math.max(1, Math.floor(Math.log2(newWords + 1)));
        note.updatedAt = new Date().toISOString();

        // Update stats
        if (wordDiff > 0) {
            GameState.stats.totalWords += wordDiff;
            this.grantXP(wordDiff * 2);
        }

        AudioManager.playConfirm();
        Storage.save();
        this.showToast('✨', 'Scroll updated!');

        setTimeout(() => {
            this.goToScreen('notes');
        }, 500);
    },

    deleteNote() {
        if (!GameState.selectedNote) return;

        // Confirm delete (simple approach - could be fancier)
        AudioManager.playDelete();

        const noteId = GameState.selectedNote.id;
        GameState.notes = GameState.notes.filter(n => n.id !== noteId);
        GameState.selectedNote = null;

        Storage.save();
        this.showToast('🗑️', 'Scroll banished!');

        setTimeout(() => {
            this.goToScreen('notes');
        }, 500);
    },

    updateBattleScreen() {
        GameState.battleNotes = [];
        const select = document.getElementById('battleSelect');
        const log = document.getElementById('battleLog');

        select.innerHTML = '';
        log.innerHTML = '<p>Select two scrolls to battle!</p>';

        // Reset battle arena
        document.getElementById('battleNoteLeft').querySelector('.battle-name').textContent = '---';
        document.getElementById('battleNoteRight').querySelector('.battle-name').textContent = '---';

        document.querySelectorAll('.hp-fill').forEach(fill => {
            fill.style.width = '100%';
            fill.classList.remove('low');
        });

        if (GameState.notes.length < 2) {
            select.innerHTML = '<p style="font-size:5px;color:var(--gba-screen-dark);">Need at least 2 scrolls to battle!</p>';
            document.getElementById('startBattleBtn').disabled = true;
            return;
        }

        document.getElementById('startBattleBtn').disabled = false;

        GameState.notes.forEach(note => {
            const option = document.createElement('div');
            option.className = 'battle-option';
            option.dataset.id = note.id;
            option.innerHTML = `${MOODS[note.mood].emoji} ${note.title.substring(0, 10)}`;

            option.addEventListener('click', () => {
                AudioManager.playSelect();
                this.toggleBattleSelect(note, option);
            });

            select.appendChild(option);
        });
    },

    toggleBattleSelect(note, element) {
        const isSelected = GameState.battleNotes.find(n => n.id === note.id);

        if (isSelected) {
            // Deselect
            GameState.battleNotes = GameState.battleNotes.filter(n => n.id !== note.id);
            element.classList.remove('selected');
        } else {
            // Select (max 2)
            if (GameState.battleNotes.length >= 2) {
                // Deselect first one
                const firstId = GameState.battleNotes[0].id;
                document.querySelector(`.battle-option[data-id="${firstId}"]`).classList.remove('selected');
                GameState.battleNotes.shift();
            }
            GameState.battleNotes.push(note);
            element.classList.add('selected');
        }

        // Update arena display
        const leftNote = GameState.battleNotes[0];
        const rightNote = GameState.battleNotes[1];

        const leftName = document.getElementById('battleNoteLeft').querySelector('.battle-name');
        const rightName = document.getElementById('battleNoteRight').querySelector('.battle-name');

        leftName.textContent = leftNote ? leftNote.title.substring(0, 8) : '---';
        rightName.textContent = rightNote ? rightNote.title.substring(0, 8) : '---';
    },

    startBattle() {
        if (GameState.battleNotes.length !== 2) {
            this.showToast('⚠️', 'Select 2 scrolls!');
            return;
        }

        const [note1, note2] = GameState.battleNotes;
        const log = document.getElementById('battleLog');
        const leftEl = document.getElementById('battleNoteLeft');
        const rightEl = document.getElementById('battleNoteRight');

        log.innerHTML = '<p>Battle start!</p>';

        let hp1 = 100;
        let hp2 = 100;

        const battleRound = (round) => {
            if (round > 10) {
                // Draw
                log.innerHTML += '<p class="win">IT\'S A DRAW!</p>';
                return;
            }

            // Note 1 attacks
            const dmg1 = Math.floor((note1.power + Math.random() * 10) * (1 + note1.level * 0.1));
            hp2 = Math.max(0, hp2 - dmg1);

            AudioManager.playBattleHit();
            leftEl.classList.add('attacking');
            rightEl.classList.add('hit');

            log.innerHTML += `<p class="hit">${note1.title.substring(0, 8)} deals ${dmg1} damage!</p>`;
            rightEl.querySelector('.hp-fill').style.width = `${hp2}%`;
            if (hp2 < 30) rightEl.querySelector('.hp-fill').classList.add('low');

            setTimeout(() => {
                leftEl.classList.remove('attacking');
                rightEl.classList.remove('hit');

                if (hp2 <= 0) {
                    this.endBattle(note1, note2, log, leftEl, rightEl);
                    return;
                }

                // Note 2 attacks
                const dmg2 = Math.floor((note2.power + Math.random() * 10) * (1 + note2.level * 0.1));
                hp1 = Math.max(0, hp1 - dmg2);

                AudioManager.playBattleHit();
                rightEl.classList.add('attacking');
                leftEl.classList.add('hit');

                log.innerHTML += `<p class="hit">${note2.title.substring(0, 8)} deals ${dmg2} damage!</p>`;
                leftEl.querySelector('.hp-fill').style.width = `${hp1}%`;
                if (hp1 < 30) leftEl.querySelector('.hp-fill').classList.add('low');

                setTimeout(() => {
                    rightEl.classList.remove('attacking');
                    leftEl.classList.remove('hit');

                    if (hp1 <= 0) {
                        this.endBattle(note2, note1, log, rightEl, leftEl);
                        return;
                    }

                    // Next round
                    battleRound(round + 1);
                }, 600);
            }, 600);

            // Auto-scroll log
            log.scrollTop = log.scrollHeight;
        };

        setTimeout(() => battleRound(1), 500);
    },

    endBattle(winner, loser, log, winnerEl, loserEl) {
        AudioManager.playVictory();

        winnerEl.classList.add('victory');
        loserEl.classList.add('defeat');

        log.innerHTML += `<p class="win">🏆 ${winner.title.substring(0, 10)} WINS!</p>`;
        log.scrollTop = log.scrollHeight;

        // Update note stats
        const winnerNote = GameState.notes.find(n => n.id === winner.id);
        const loserNote = GameState.notes.find(n => n.id === loser.id);

        if (winnerNote) {
            winnerNote.wins = (winnerNote.wins || 0) + 1;
            winnerNote.level += 1;
            winnerNote.power += 5;
        }
        if (loserNote) {
            loserNote.losses = (loserNote.losses || 0) + 1;
        }

        // Update player stats
        GameState.stats.battlesWon++;
        this.grantXP(25);
        this.checkAchievements();

        Storage.save();

        setTimeout(() => {
            winnerEl.classList.remove('victory');
            loserEl.classList.remove('defeat');
            this.showToast('⚔️', `${winner.title.substring(0, 10)} levels up!`);
        }, 2000);
    },

    updateStatsScreen() {
        document.getElementById('statNotes').textContent = GameState.notes.length;
        document.getElementById('statBattles').textContent = GameState.stats.battlesWon;
        document.getElementById('statXP').textContent = GameState.stats.totalXP;
        document.getElementById('statWords').textContent = GameState.stats.totalWords;

        // Update achievements
        Object.entries(GameState.achievements).forEach(([id, unlocked]) => {
            const el = document.querySelector(`.achievement[data-id="${id}"]`);
            if (el) {
                el.classList.toggle('locked', !unlocked);
                el.classList.toggle('unlocked', unlocked);
            }
        });
    },

    grantXP(amount) {
        GameState.stats.xp += amount;
        GameState.stats.totalXP += amount;

        // Check for level up
        while (GameState.stats.xp >= GameState.stats.xpToLevel) {
            GameState.stats.xp -= GameState.stats.xpToLevel;
            GameState.stats.level++;
            GameState.stats.xpToLevel = Math.floor(GameState.stats.xpToLevel * 1.5);

            // Show level up!
            this.showLevelUp();
        }

        this.updateXPBar();
        Storage.save();
    },

    showLevelUp() {
        AudioManager.playLevelUp();
        this.elements.newLevel.textContent = GameState.stats.level;
        this.elements.levelUpOverlay.classList.add('show');
    },

    checkAchievements() {
        const { notes, stats, achievements } = GameState;

        // First note
        if (notes.length >= 1 && !achievements.first_note) {
            achievements.first_note = true;
            this.showAchievement('First Scroll!');
        }

        // Note collector (10 notes)
        if (notes.length >= 10 && !achievements.note_collector) {
            achievements.note_collector = true;
            this.showAchievement('Note Collector!');
        }

        // First battle
        if (stats.battlesWon >= 1 && !achievements.first_battle) {
            achievements.first_battle = true;
            this.showAchievement('First Victory!');
        }

        // Word master (1000 words)
        if (stats.totalWords >= 1000 && !achievements.word_master) {
            achievements.word_master = true;
            this.showAchievement('Word Master!');
        }

        Storage.save();
    },

    showAchievement(name) {
        AudioManager.playAchievement();
        this.showToast('🏆', name);
    },

    showToast(icon, message) {
        const toast = this.elements.toast;
        toast.querySelector('.toast-icon').textContent = icon;
        toast.querySelector('.toast-message').textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    },

    formatDate(isoString) {
        const date = new Date(isoString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        AudioManager.init();
    }, { once: true });

    // Load saved data
    Storage.load();

    // Initialize UI
    UI.init();

    // Start on title screen
    UI.goToScreen('title');

    console.log('🎮 Pocket Scribe loaded! Press START to begin your quest!');
});

// ==========================================
// KEYBOARD CONTROLS (Optional GBA feel)
// ==========================================

document.addEventListener('keydown', (e) => {
    // Prevent scrolling with arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    const currentScreen = GameState.currentScreen;

    if (currentScreen === 'menu') {
        const items = document.querySelectorAll('.menu-item');
        const selected = document.querySelector('.menu-item.selected');
        const currentIndex = Array.from(items).indexOf(selected);

        if (e.key === 'ArrowUp' && currentIndex > 0) {
            AudioManager.playSelect();
            items[currentIndex].classList.remove('selected');
            items[currentIndex - 1].classList.add('selected');
        } else if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
            AudioManager.playSelect();
            items[currentIndex].classList.remove('selected');
            items[currentIndex + 1].classList.add('selected');
        } else if (e.key === 'Enter' || e.key === ' ') {
            selected.click();
        }
    }

    // Back with Escape or B
    if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        const backBtn = document.querySelector('.screen.active .back-btn');
        if (backBtn) {
            backBtn.click();
        }
    }
});

// ==========================================
// SERVICE WORKER REGISTRATION (PWA support)
// ==========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here for PWA support
        // navigator.serviceWorker.register('/sw.js');
    });
}
