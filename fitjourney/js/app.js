/**
 * ==========================================================================
 * FITJOURNEY - MAIN GAME ENGINE & CORE APPLICATION LOGIC
 * Connects UI widgets, game states, audio synth, and storage persistence.
 * ==========================================================================
 */

// Sound Synth Engine using Web Audio API
const AudioSynth = {
    ctx: null,
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    
    playClick() {
        try {
            this.init();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.04);
            
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) { console.warn(e); }
    },
    
    playHit() {
        try {
            this.init();
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            const gain2 = this.ctx.createGain();
            
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            
            // Slash effect (triangle pitch slide)
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(950, this.ctx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.14);
            gain1.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain1.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
            
            // Heavy impact blow (sine bass slide)
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(130, this.ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.1);
            gain2.gain.setValueAtTime(0.16, this.ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
            
            osc1.start();
            osc1.stop(this.ctx.currentTime + 0.14);
            osc2.start();
            osc2.stop(this.ctx.currentTime + 0.14);
        } catch (e) { console.warn(e); }
    },
    
    playWater() {
        try {
            this.init();
            const now = this.ctx.currentTime;
            
            // Water gulp synth (ascending bubbly sine waves)
            const playBubble = (start) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, start);
                osc.frequency.exponentialRampToValueAtTime(750, start + 0.08);
                
                gain.gain.setValueAtTime(0.05, start);
                gain.gain.linearRampToValueAtTime(0.001, start + 0.08);
                
                osc.start(start);
                osc.stop(start + 0.08);
            };
            
            playBubble(now);
            playBubble(now + 0.1);
            playBubble(now + 0.2);
        } catch (e) { console.warn(e); }
    },
    
    playCoin() {
        try {
            this.init();
            const now = this.ctx.currentTime;
            
            const playTone = (freq, start, duration) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);
                
                gain.gain.setValueAtTime(0.08, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
                
                osc.start(start);
                osc.stop(start + duration);
            };
            
            // Classic 8-bit double coin chime (B5 then E6)
            playTone(987.77, now, 0.08);
            playTone(1318.51, now + 0.08, 0.25);
        } catch (e) { console.warn(e); }
    },
    
    playVictory() {
        try {
            this.init();
            const now = this.ctx.currentTime;
            
            const playTone = (freq, start, duration, type='triangle') => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.type = type;
                osc.frequency.setValueAtTime(freq, start);
                
                gain.gain.setValueAtTime(0.08, start);
                gain.gain.setValueAtTime(0.08, start + duration - 0.02);
                gain.gain.linearRampToValueAtTime(0.001, start + duration);
                
                osc.start(start);
                osc.stop(start + duration);
            };
            
            // Uplifting melody arpeggio
            playTone(523.25, now, 0.09);         // C5
            playTone(659.25, now + 0.09, 0.09);   // E5
            playTone(783.99, now + 0.18, 0.09);   // G5
            playTone(1046.50, now + 0.27, 0.4);   // C6
            
            setTimeout(() => {
                try {
                    const now2 = this.ctx.currentTime;
                    playTone(1318.51, now2, 0.4, 'sine'); // E6 harmony
                } catch (err) {}
            }, 270);
        } catch (e) { console.warn(e); }
    },
    
    playDefeat() {
        try {
            this.init();
            const now = this.ctx.currentTime;
            
            const playTone = (freq, start, duration) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, start);
                osc.frequency.linearRampToValueAtTime(freq * 0.75, start + duration);
                
                gain.gain.setValueAtTime(0.12, start);
                gain.gain.linearRampToValueAtTime(0.001, start + duration);
                
                osc.start(start);
                osc.stop(start + duration);
            };
            
            playTone(330.00, now, 0.22);        // E4
            playTone(293.66, now + 0.22, 0.22);  // D4
            playTone(261.63, now + 0.44, 0.22);  // C4
            playTone(196.00, now + 0.66, 0.6);   // G3
        } catch (e) { console.warn(e); }
    },
    
    playLevelUp() {
        try {
            this.init();
            const now = this.ctx.currentTime;
            
            const playTone = (freq, start, duration) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);
                
                gain.gain.setValueAtTime(0.07, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
                
                osc.start(start);
                osc.stop(start + duration);
            };
            
            const scales = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            scales.forEach((freq, index) => {
                playTone(freq, now + (index * 0.05), 0.18);
            });
        } catch (e) { console.warn(e); }
    }
};

// Global App State Object
let state = {};

// Active Battle Mission State Object
let battleState = {
    selectedQuest: 'squat', // default dropdown selection
    bossHp: 100,
    reps: 0,
    totalSeconds: 60,
    timerRunning: false,
    timerInterval: null
};

// Exercise Quest specs
const QUESTS = {
    squat: { name: 'Squat', targetReps: 10, xpReward: 40, goldReward: 25 },
    pushup: { name: 'Push-Up', targetReps: 10, xpReward: 50, goldReward: 30 },
    situp: { name: 'Sit-Up', targetReps: 15, xpReward: 45, goldReward: 25 }
};

// DOM Selections
const playerLevelEls = document.querySelectorAll('.player-level-val');
const playerGoldEls = document.querySelectorAll('.player-gold-val');
const playerXpTextEl = document.getElementById('player-xp-text');
const playerXpBarEl = document.getElementById('player-xp-bar');
const playerTitleEl = document.getElementById('player-title');

// Sidebar and Mobile Bottom-Nav DOM Selections
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Dashboard Widgets Elements
// Quest
const dropdownQuestEl = document.getElementById('dropdown-quest');
const bossHpTextEl = document.getElementById('boss-hp-text');
const bossHpBarEl = document.getElementById('boss-hp-bar');
const slimeSvgEl = document.getElementById('slime-svg');
const timerDisplayEl = document.getElementById('timer-display');
const btnTimerEl = document.getElementById('btn-timer');
const btnTimerTextEl = document.getElementById('btn-timer-text');
const btnTimerIconEl = document.getElementById('btn-timer-icon');
const btnActionEl = document.getElementById('btn-action');
const repCountEl = document.getElementById('rep-count');
const targetRepEl = document.getElementById('target-rep');
const repDotsContainerEl = document.getElementById('rep-dots-container');

// Calories
const calCountEl = document.getElementById('cal-count');
const btnAyamGeprekEl = document.getElementById('btn-ayam-geprek');
const btnMieInstanEl = document.getElementById('btn-mie-instan');
const btnBaksoCampurEl = document.getElementById('btn-bakso-campur');
const btnNasiPutihEl = document.getElementById('btn-nasi-putih');
const btnResetCalEl = document.getElementById('btn-reset-cal');
const calStatusTextEl = document.getElementById('cal-status-text');

// Hydration
const waterCounterEl = document.getElementById('water-counter');
const btnWaterAddEl = document.getElementById('btn-water-add');
const waterGlassesContainerEl = document.getElementById('water-glasses-container');

// Sleep Tracker
const inputSleepHoursEl = document.getElementById('input-sleep-hours');
const btnSaveSleepEl = document.getElementById('btn-save-sleep');
const sleepStatusBadgeEl = document.getElementById('sleep-status-badge');

// Profile Elements
const statStrengthEl = document.getElementById('stat-strength');
const statAgilityEl = document.getElementById('stat-agility');
const statEnduranceEl = document.getElementById('stat-endurance');
const statIntelligenceEl = document.getElementById('stat-intelligence');
const statStrengthBar = document.getElementById('stat-strength-bar');
const statAgilityBar = document.getElementById('stat-agility-bar');
const statEnduranceBar = document.getElementById('stat-endurance-bar');
const statIntelligenceBar = document.getElementById('stat-intelligence-bar');
const inventoryContainerEl = document.getElementById('inventory-container');

// Shop Buttons
const btnBuyBeltEl = document.getElementById('btn-buy-belt');
const btnBuyBootsEl = document.getElementById('btn-buy-boots');

// Log Elements
const tableLogBody = document.getElementById('table-log-body');

// Modals Elements
const modalVictory = document.getElementById('modal-victory');
const btnClaimVictory = document.getElementById('btn-claim-victory');
const modalDefeat = document.getElementById('modal-defeat');
const btnClaimDefeat = document.getElementById('btn-claim-defeat');
const modalLevelUp = document.getElementById('modal-levelup');
const btnCloseLevelUp = document.getElementById('btn-close-levelup');
const lvOldEl = document.getElementById('lv-old');
const lvNewEl = document.getElementById('lv-new');

// Reset Button
const btnResetDataEl = document.getElementById('btn-reset-data');

/**
 * Returns dynamic title based on specifications
 * @param {number} level - Character level
 * @returns {string} RPG Title
 */
function getPlayerTitle(level) {
    if (level < 5) return 'Pemula Sedenter 🛡️';
    return 'Pejuang Kebugaran ⚔️🔥';
}

/**
 * Startup Initialization
 */
function initApp() {
    // Load persisted state or fallback
    state = loadGameState();
    
    // Bind Tab Navigasi Switch
    bindTabEvents();
    
    // Bind All Widget Interactive Elements
    bindWorkoutQuestEvents();
    bindCalorieWidgetEvents();
    bindWaterWidgetEvents();
    bindSleepWidgetEvents();
    bindShopEvents();
    
    // Bind Reset and Modals
    bindUtilityEvents();
    
    // Render and Sync UI
    syncAllUI();
    resetQuestStateUI();
}

/**
 * Binds sidebar and bottom bar navigation buttons to tab transitions
 */
function bindTabEvents() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');
            AudioSynth.playClick();
            
            // Switch tabs visually
            tabContents.forEach(content => {
                if (content.id === targetTabId) {
                    content.classList.remove('hidden');
                    // Add subtle entry fade class
                    content.style.opacity = 0;
                    setTimeout(() => {
                        content.style.opacity = 1;
                    }, 50);
                } else {
                    content.classList.add('hidden');
                }
            });
            
            // Switch buttons style (desktop sidebar and bottom-nav)
            tabButtons.forEach(btn => {
                const btnTab = btn.getAttribute('data-tab');
                if (btnTab === targetTabId) {
                    // Active button styles
                    btn.classList.add('bg-slate-800', 'text-purple-400', 'border-purple-500/50');
                    btn.classList.remove('text-slate-400', 'border-transparent');
                } else {
                    // Inactive button styles
                    btn.classList.remove('bg-slate-800', 'text-purple-400', 'border-purple-500/50');
                    btn.classList.add('text-slate-400', 'border-transparent');
                }
            });
        });
    });
}

/**
 * Performs deep synchronization from the state variables to all UI parts
 */
function syncAllUI() {
    // 1. Sync Levels and Gold everywhere
    playerLevelEls.forEach(el => {
        el.innerText = `LV ${state.level}`;
    });
    
    playerGoldEls.forEach(el => {
        el.innerText = state.gold;
    });
    
    // 2. Sync Title & Avatar Panel
    playerTitleEl.innerText = getPlayerTitle(state.level);
    
    // 3. Sync XP Text and XP progress bar
    playerXpTextEl.innerText = state.xp;
    const xpPercent = Math.min(100, Math.max(0, state.xp));
    playerXpBarEl.style.width = `${xpPercent}%`;
    if (xpPercent > 80) {
        playerXpBarEl.classList.add('xp-glow-active');
    } else {
        playerXpBarEl.classList.remove('xp-glow-active');
    }
    
    // 4. Sync Calories
    calCountEl.innerText = state.dailyCalories;
    updateCalorieStatusUI();
    
    // 5. Sync Water Glasses
    waterCounterEl.innerText = `${state.waterGlasses} / 8 Gelas`;
    syncWaterGlassesVisuals();
    
    // 6. Sync Sleep Hours Adviser Badge
    syncSleepUI();
    
    // 7. Sync Profile Attributes & Inventory
    syncAttributesUI();
    syncInventoryUI();
    
    // 8. Sync Activity Log Table
    syncActivityLogUI();
}

/**
 * Generates local timestamps for logging events
 * @returns {string} Timestamp string
 */
function getFormattedTime() {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `[${new Date().toLocaleDateString('id-ID')} Pukul ${timeStr}]`;
}

/**
 * Helper to register a new system history entry and save it
 * @param {string} text - History Log content description
 */
function logSystemEvent(text) {
    const entry = `${getFormattedTime()} - ${text}`;
    state.activityLog.push(entry);
    saveGameState(state);
}

/**
 * Updates calorie sweet-spot adviser display
 */
function updateCalorieStatusUI() {
    if (state.dailyCalories === 0) {
        calStatusTextEl.className = 'text-[10px] text-slate-500 mt-1 block';
        calStatusTextEl.innerText = 'Batas aman harian: 1500 - 2000 Kkal.';
    } else if (state.dailyCalories < 1500) {
        calStatusTextEl.className = 'text-[10px] text-orange-400 font-bold mt-1 block';
        calStatusTextEl.innerText = 'Kalori Rendah (Tambahkan makanan agar bertenaga!) 🍲';
    } else if (state.dailyCalories <= 2000) {
        calStatusTextEl.className = 'text-[10px] text-emerald-400 font-black mt-1 block animate-pulse';
        if (state.calorieBonusClaimed) {
            calStatusTextEl.innerText = 'Kalori Ideal! Batas aman tercapai & Bonus Emas berhasil diklaim 🟢🪙';
        } else {
            calStatusTextEl.innerText = 'Kalori Ideal! Batas aman tercapai (+15 Gold Bonus Klaim!) 🟢';
        }
    } else {
        calStatusTextEl.className = 'text-[10px] text-red-500 font-bold mt-1 block';
        calStatusTextEl.innerText = 'Melebihi Batas Ideal 2000 Kkal (Batasi camilan Anda!) ⚠️';
    }
}

/**
 * Visualise the water glass count as custom colored elements
 */
function syncWaterGlassesVisuals() {
    waterGlassesContainerEl.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const glassSpan = document.createElement('span');
        glassSpan.className = 'text-2xl transition-all duration-300 transform filter drop-shadow-sm select-none';
        if (i <= state.waterGlasses) {
            glassSpan.innerText = '🥛'; // Filled glass
            glassSpan.className += ' scale-110 opacity-100 drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]';
        } else {
            glassSpan.innerText = '🥤'; // Empty cup
            glassSpan.className += ' scale-90 opacity-20';
        }
        waterGlassesContainerEl.appendChild(glassSpan);
    }
}

/**
 * Handles sleep tracker adviser rendering
 */
function syncSleepUI() {
    if (state.sleepHours === 0) {
        sleepStatusBadgeEl.className = 'px-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 font-game text-[10px] font-bold rounded-full';
        sleepStatusBadgeEl.innerText = 'BELUM DIISI';
        inputSleepHoursEl.value = '';
    } else {
        inputSleepHoursEl.value = state.sleepHours;
        if (state.sleepHours >= 7 && state.sleepHours <= 8) {
            sleepStatusBadgeEl.className = 'px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-game text-[10px] font-bold rounded-full animate-pulse';
            sleepStatusBadgeEl.innerText = '🟢 IDEAL (BUFF BUGAR ACTIVE)';
        } else if (state.sleepHours < 7) {
            sleepStatusBadgeEl.className = 'px-3 py-1 bg-red-950/60 border border-red-900/30 text-red-400 font-game text-[10px] font-bold rounded-full';
            sleepStatusBadgeEl.innerText = '🔴 KURANG TIDUR';
        } else {
            sleepStatusBadgeEl.className = 'px-3 py-1 bg-yellow-950/60 border border-yellow-900/30 text-yellow-500 font-game text-[10px] font-bold rounded-full';
            sleepStatusBadgeEl.innerText = '🟡 BERLEBIHAN';
        }
    }
}

/**
 * Sync Character profile tab statistics & visual attribute meters
 */
function syncAttributesUI() {
    statStrengthEl.innerText = state.attributes.strength;
    statAgilityEl.innerText = state.attributes.agility;
    statEnduranceEl.innerText = state.attributes.endurance;
    statIntelligenceEl.innerText = state.attributes.intelligence;
    
    const calcWidthPercent = (val) => `${Math.min(100, (val / 50) * 100)}%`;
    statStrengthBar.style.width = calcWidthPercent(state.attributes.strength);
    statAgilityBar.style.width = calcWidthPercent(state.attributes.agility);
    statEnduranceBar.style.width = calcWidthPercent(state.attributes.endurance);
    statIntelligenceBar.style.width = calcWidthPercent(state.attributes.intelligence);
}

/**
 * Synchronizes inventory items bought from the shop
 */
function syncInventoryUI() {
    inventoryContainerEl.innerHTML = '';
    
    if (state.inventory.length === 0) {
        inventoryContainerEl.innerHTML = `
            <div class="col-span-full py-6 text-center text-slate-500 italic text-xs select-none bg-slate-900/35 border border-slate-850 rounded-2xl">
                🎒 Inventori kosong. Beli badge penghargaan di Toko Gold!
            </div>
        `;
        return;
    }
    
    state.inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'glass-card-active rounded-xl p-3 border flex flex-col items-center justify-center gap-1.5 shadow-md transform hover:scale-105 transition-all duration-300 select-none';
        
        let emoji = '🎖️';
        let colorClass = 'text-amber-400';
        let label = item;
        
        if (item.includes('Sabuk Hitam')) {
            emoji = '🛡️';
            colorClass = 'text-purple-400';
        } else if (item.includes('Hermes')) {
            emoji = '⚡';
            colorClass = 'text-cyan-400';
        }
        
        itemDiv.innerHTML = `
            <span class="text-3xl filter drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]">${emoji}</span>
            <span class="text-[10px] font-bold text-slate-200 text-center">${label}</span>
            <span class="text-[8px] font-game ${colorClass} uppercase font-bold tracking-wider">Item Toko</span>
        `;
        inventoryContainerEl.appendChild(itemDiv);
    });
}

/**
 * Render the exercise logs in a modern HTML Table
 */
function syncActivityLogUI() {
    tableLogBody.innerHTML = '';
    
    if (state.activityLog.length === 0) {
        tableLogBody.innerHTML = `
            <tr>
                <td colspan="2" class="px-6 py-8 text-center text-slate-500 italic text-sm select-none bg-slate-900/25 rounded-2xl">
                    📜 Buku log masih kosong. Mulai aktivitas harian Anda untuk mencatat riwayat prestasi!
                </td>
            </tr>
        `;
        return;
    }
    
    // Render descending (newest logs at top)
    const sortedLogs = [...state.activityLog].reverse();
    
    sortedLogs.forEach(log => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-800/80 hover:bg-slate-800/20 transition-colors duration-200';
        
        // Split timestamp and text based on standard format ' - '
        const splitIdx = log.indexOf(' - ');
        let timestamp = '';
        let text = log;
        
        if (splitIdx !== -1) {
            timestamp = log.substring(0, splitIdx);
            text = log.substring(splitIdx + 3);
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 text-xs font-semibold text-slate-400 font-mono select-none">${timestamp}</td>
            <td class="px-6 py-4 text-sm font-medium text-slate-200">${text}</td>
        `;
        tableLogBody.appendChild(row);
    });
}

/**
 * Resets quest values and components to initial values
 */
function resetQuestStateUI() {
    if (battleState.timerInterval) {
        clearInterval(battleState.timerInterval);
        battleState.timerInterval = null;
    }
    
    battleState.bossHp = 100;
    battleState.reps = 0;
    battleState.totalSeconds = 60;
    battleState.timerRunning = false;
    
    const activeQuest = QUESTS[battleState.selectedQuest];
    
    // Reset indicators
    bossHpTextEl.innerText = '100';
    bossHpBarEl.style.width = '100%';
    timerDisplayEl.innerText = '01:00';
    repCountEl.innerText = '0';
    targetRepEl.innerText = activeQuest.targetReps;
    
    // Disable action button
    btnActionEl.disabled = true;
    
    // Restore Slime static idle float
    slimeSvgEl.className = 'w-32 h-32 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.35)] animate-float';
    
    // Reset countdown controls styles
    btnTimerTextEl.innerText = 'Mulai Sesi Latihan';
    btnTimerIconEl.className = 'fas fa-play text-[10px]';
    btnTimerEl.className = 'px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-bold tracking-wide font-game rounded-xl transition-all duration-200 flex items-center gap-2 active:scale-95 select-none shadow-[0_4px_12px_rgba(249,115,22,0.2)]';
    
    // Card borders
    document.getElementById('quest-box').classList.remove('combat-card-active');
    
    // Re-generate visual repetition dots indicators matching selected quest target reps
    repDotsContainerEl.innerHTML = '';
    for (let i = 1; i <= activeQuest.targetReps; i++) {
        const dot = document.createElement('div');
        dot.className = 'rep-dot h-2 rounded bg-slate-800 border border-slate-700/50 transition-all duration-300';
        repDotsContainerEl.appendChild(dot);
    }
}

/**
 * Registers events on workout quest widget (timer, dropdown, attack click)
 */
function bindWorkoutQuestEvents() {
    // 1. Dropdown Selection exercise change
    dropdownQuestEl.addEventListener('change', () => {
        AudioSynth.playClick();
        battleState.selectedQuest = dropdownQuestEl.value;
        resetQuestStateUI();
    });
    
    // 2. Timer countdown control
    btnTimerEl.addEventListener('click', () => {
        AudioSynth.playClick();
        
        if (battleState.timerRunning) {
            // Action: PAUSE
            battleState.timerRunning = false;
            clearInterval(battleState.timerInterval);
            battleState.timerInterval = null;
            
            // Buttons visual update
            btnTimerTextEl.innerText = 'Lanjutkan Sesi';
            btnTimerIconEl.className = 'fas fa-play text-[10px]';
            btnTimerEl.className = 'px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold tracking-wide font-game rounded-xl transition-all duration-200 flex items-center gap-2 active:scale-95 select-none shadow-[0_4px_12px_rgba(168,85,247,0.15)]';
            
            document.getElementById('quest-box').classList.remove('combat-card-active');
            btnActionEl.disabled = true;
        } else {
            // Action: START or RESUME
            battleState.timerRunning = true;
            
            // Buttons visual update
            btnTimerTextEl.innerText = 'Jeda Sesi';
            btnTimerIconEl.className = 'fas fa-pause text-[10px]';
            btnTimerEl.className = 'px-5 py-2.5 bg-slate-700 hover:bg-slate-650 text-slate-200 border border-slate-600 font-medium tracking-wide font-game rounded-xl transition-all duration-200 flex items-center gap-2 active:scale-95 select-none shadow-none';
            
            document.getElementById('quest-box').classList.add('combat-card-active');
            btnActionEl.disabled = false;
            
            // Trigger Interval loop
            battleState.timerInterval = setInterval(() => {
                battleState.totalSeconds--;
                
                // Format display
                const mins = Math.floor(battleState.totalSeconds / 60);
                const secs = battleState.totalSeconds % 60;
                timerDisplayEl.innerText = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
                
                if (battleState.totalSeconds <= 0) {
                    handleQuestDefeat();
                }
            }, 1000);
        }
    });
    
    // 3. Attack Slash Click ⚔️
    btnActionEl.addEventListener('click', () => {
        if (!battleState.timerRunning) return;
        
        const activeQuest = QUESTS[battleState.selectedQuest];
        
        // Attack sound FX
        AudioSynth.playHit();
        
        // Increment reps
        battleState.reps = Math.min(activeQuest.targetReps, battleState.reps + 1);
        repCountEl.innerText = battleState.reps;
        
        // Light up visual dot with scale pop
        const repDotEls = document.querySelectorAll('.rep-dot');
        const targetDotIdx = battleState.reps - 1;
        if (repDotEls[targetDotIdx]) {
            repDotEls[targetDotIdx].className = 'rep-dot h-2.5 rounded bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-300 shadow-[0_0_8px_#F59E0B] transform scale-y-110 transition-all duration-200';
        }
        
        // Decrease Slime HP dynamically based on exact reps target
        battleState.bossHp = Math.max(0, Math.round(100 - (battleState.reps * (100 / activeQuest.targetReps))));
        bossHpTextEl.innerText = battleState.bossHp;
        bossHpBarEl.style.width = `${battleState.bossHp}%`;
        
        // Damage Visual Feedback on Slime SVG
        slimeSvgEl.classList.remove('animate-float');
        slimeSvgEl.classList.add('animate-shake', 'animate-flash');
        
        setTimeout(() => {
            slimeSvgEl.classList.remove('animate-shake', 'animate-flash');
            slimeSvgEl.classList.add('animate-float');
        }, 220);
        
        // Win Condition check
        if (battleState.bossHp <= 0) {
            handleQuestVictory(activeQuest);
        }
    });
}

/**
 * Handles successful quest combat completion
 * @param {Object} quest - Currently selected exercise spec
 */
function handleQuestVictory(quest) {
    clearInterval(battleState.timerInterval);
    battleState.timerInterval = null;
    battleState.timerRunning = false;
    btnActionEl.disabled = true;
    
    AudioSynth.playVictory();
    
    // Rewards
    let xpGain = quest.xpReward;
    let goldGain = quest.goldReward;
    
    // System Event Log
    logSystemEvent(`Sukses mengalahkan Boss Slime via Misi ${quest.name}! (+${xpGain} XP, +${goldGain} Gold)`);
    
    // Apply rewards
    state.gold += goldGain;
    
    // Save to storage
    saveGameState(state);
    
    // Check level up with custom reward xp
    checkAndProcessLevelUp(xpGain);
}

/**
 * Handle quest countdown failure
 */
function handleQuestDefeat() {
    clearInterval(battleState.timerInterval);
    battleState.timerInterval = null;
    battleState.timerRunning = false;
    btnActionEl.disabled = true;
    
    AudioSynth.playDefeat();
    
    setTimeout(() => {
        showModal(modalDefeat);
    }, 250);
}

/**
 * Registers events on local calorie tracker widget buttons
 */
function bindCalorieWidgetEvents() {
    const addCalories = (amount) => {
        AudioSynth.playClick();
        state.dailyCalories += amount;
        
        // Sweet-spot safe calorie range check (1500-2000 Kkal)
        if (state.dailyCalories >= 1500 && state.dailyCalories <= 2000) {
            if (!state.calorieBonusClaimed) {
                // Gold Reward
                state.gold += 15;
                state.calorieBonusClaimed = true;
                
                // Play coin chime
                setTimeout(() => {
                    AudioSynth.playCoin();
                    logSystemEvent(`Berhasil menjaga asupan kalori harian di batas aman (1500-2000 Kkal)! (+15 Gold)`);
                    alert("🍲 Mantap! Asupan Kalori harian Anda berada di Zona Ideal Aman (1500-2000 Kkal). Bonus: +15 Gold didapatkan! 🪙");
                    syncAllUI();
                }, 300);
            }
        }
        
        saveGameState(state);
        syncAllUI();
    };
    
    // Tombol Cepat Ayam Geprek (+700 Kkal)
    btnAyamGeprekEl.addEventListener('click', () => addCalories(700));
    // Tombol Cepat Mie Instan (+400 Kkal)
    btnMieInstanEl.addEventListener('click', () => addCalories(400));
    // Tombol Cepat Bakso Campur (+500 Kkal)
    btnBaksoCampurEl.addEventListener('click', () => addCalories(500));
    // Tombol Cepat Nasi Putih (+200 Kkal)
    btnNasiPutihEl.addEventListener('click', () => addCalories(200));
    
    // Reset calorie tracker counter
    btnResetCalEl.addEventListener('click', () => {
        AudioSynth.playClick();
        state.dailyCalories = 0;
        state.calorieBonusClaimed = false; // allow re-claim on next fill
        saveGameState(state);
        syncAllUI();
    });
}

/**
 * Registers events on Water intake widget elements
 */
function bindWaterWidgetEvents() {
    btnWaterAddEl.addEventListener('click', () => {
        AudioSynth.playWater();
        
        state.waterGlasses++;
        
        // Target limit 8 cups
        if (state.waterGlasses >= 8) {
            state.gold += 10;
            state.waterGlasses = 0; // reset
            
            // Play coin sound
            setTimeout(() => {
                AudioSynth.playCoin();
                logSystemEvent(`Sukses memenuhi target hidrasi harian 8 gelas air! (+10 Gold)`);
                alert("💧 Luar biasa! Target hidrasi harian 8 gelas air terpenuhi. Hadiah Bonus: +10 Gold! 🪙");
                syncAllUI();
            }, 300);
        } else {
            saveGameState(state);
            syncAllUI();
        }
    });
}

/**
 * Registers events on sleeping advisor tracker
 */
function bindSleepWidgetEvents() {
    btnSaveSleepEl.addEventListener('click', () => {
        const val = parseFloat(inputSleepHoursEl.value);
        if (isNaN(val) || val <= 0 || val > 24) {
            alert("⚠️ Masukkan angka durasi tidur yang valid (1 - 24 Jam)!");
            return;
        }
        
        AudioSynth.playClick();
        state.sleepHours = val;
        
        // Sleeping buff evaluator logic
        if (val >= 7 && val <= 8) {
            state.sleepStatus = 'Ideal';
            state.xp += 15;
            
            setTimeout(() => {
                AudioSynth.playVictory();
                logSystemEvent(`Sukses menjaga durasi tidur ideal (${val} jam)! Mendapat Buff Bugar (+15 XP)`);
                alert("🟢 Selamat! Durasi tidur semalam Anda ideal (7-8 Jam). Buff Bugar Aktif! Bonus instan: +15 XP! ✨");
                checkAndProcessLevelUp(0); // sync levelup checks
            }, 300);
        } else if (val < 7) {
            state.sleepStatus = 'Kurang';
            logSystemEvent(`Mencatat durasi tidur kurang (${val} jam). Jaga waktu istirahat Anda!`);
            alert("🔴 Durasi tidur Anda kurang (< 7 Jam). Cobalah untuk tidur lebih awal agar performa tubuh bugar! 💤");
        } else {
            state.sleepStatus = 'Berlebihan';
            logSystemEvent(`Mencatat durasi tidur berlebihan (${val} jam). Hindari tidur terlalu lama!`);
            alert("🟡 Durasi tidur Anda berlebihan (> 8 Jam). Batasi waktu istirahat agar metabolisme tetap terjaga! 💤");
        }
        
        saveGameState(state);
        syncAllUI();
    });
}

/**
 * Helper to process player XP increments and continuous level up
 * @param {number} xpGain - Amount of XP to add
 */
function checkAndProcessLevelUp(xpGain) {
    let currentXp = state.xp + xpGain;
    let currentLevel = state.level;
    let isLevelUp = false;
    let levelIncrements = 0;
    
    // Continuous Level Up loop
    while (currentXp >= 100) {
        currentLevel++;
        currentXp -= 100;
        isLevelUp = true;
        levelIncrements++;
        
        // Permanent Attributes increase STR, AGI, END, INT +2 points
        state.attributes.strength += 2;
        state.attributes.agility += 2;
        state.attributes.endurance += 2;
        state.attributes.intelligence += 2;
    }
    
    // Commit values
    state.level = currentLevel;
    state.xp = currentXp;
    
    saveGameState(state);
    syncAllUI();
    
    if (isLevelUp) {
        setTimeout(() => {
            AudioSynth.playLevelUp();
            logSystemEvent(`🎉 LEVEL UP! Karakter naik ke Level ${currentLevel}! Atribut meningkat!`);
            
            // Sync old/new level in Levelup modal UI
            lvOldEl.innerText = `LV ${currentLevel - levelIncrements}`;
            lvNewEl.innerText = `LV ${currentLevel}`;
            
            showModal(modalLevelUp);
        }, 350);
    } else {
        // Show normal Victory modal on combat quest victory
        if (xpGain > 0 && battleState.bossHp <= 0) {
            showModal(modalVictory);
        }
    }
}

/**
 * Registers events on Gold Shop purchases
 */
function bindShopEvents() {
    const handlePurchase = (itemName, price) => {
        AudioSynth.playClick();
        
        // Inventory validation (anti-duplicate bought badges)
        if (state.inventory.includes(itemName)) {
            alert(`⚠️ Anda sudah memiliki "${itemName}". Penghargaan hanya dapat dibeli sekali!`);
            return;
        }
        
        // Gold sufficiency check
        if (state.gold < price) {
            AudioSynth.playDefeat();
            alert(`❌ Emas tidak cukup! Saldo Anda: ${state.gold} Gold, Harga: ${price} Gold.`);
            return;
        }
        
        // Gold Deduction
        state.gold -= price;
        // Add to inventory
        state.inventory.push(itemName);
        
        // Chime chime SFX
        setTimeout(() => {
            AudioSynth.playCoin();
            logSystemEvent(`Berhasil membeli ${itemName} dari Toko Gold! (-${price} Gold)`);
            alert(`🎉 Selamat! Anda berhasil membeli "${itemName}" seharga ${price} Gold. Badge baru ditambahkan ke Profil Anda!`);
            syncAllUI();
        }, 300);
    };
    
    // 🛡️ Badge Sabuk Hitam (Harga: 50 Gold)
    btnBuyBeltEl.addEventListener('click', () => handlePurchase('🛡️ Badge Sabuk Hitam', 50));
    
    // ⚡ Sepatu Sayap Hermes (Harga: 100 Gold)
    btnBuyBootsEl.addEventListener('click', () => handlePurchase('⚡ Sepatu Sayap Hermes', 100));
}

/**
 * Registers modals buttons and storage reset events
 */
function bindUtilityEvents() {
    // 1. Victory modal close
    btnClaimVictory.addEventListener('click', () => {
        AudioSynth.playClick();
        hideModal(modalVictory);
        syncAllUI();
        resetQuestStateUI();
    });
    
    // 2. Defeat modal close
    btnClaimDefeat.addEventListener('click', () => {
        AudioSynth.playClick();
        hideModal(modalDefeat);
        resetQuestStateUI();
    });
    
    // 3. Level Up modal close
    btnCloseLevelUp.addEventListener('click', () => {
        AudioSynth.playLevelUp();
        hideModal(modalLevelUp);
        syncAllUI();
        resetQuestStateUI();
    });
    
    // 4. Character Reset Data purge
    btnResetDataEl.addEventListener('click', () => {
        if (confirm("⚠️ PERINGATAN KERAS: Apakah Anda yakin ingin menyetel ulang seluruh progres dasbor kebugaran RPG Anda? Level, Emas, Atribut (STR, AGI, END, INT), Misi Olahraga, Kalori Harian, Air Minum, Jurnal Tidur, Inventori Badge, dan Riwayat Buku Log akan dihapus secara permanen!")) {
            resetGameState();
            
            // Reload default state
            state = loadGameState();
            
            AudioSynth.playClick();
            syncAllUI();
            resetQuestStateUI();
            
            alert("🧹 Seluruh progres data karakter dasbor Anda berhasil disetel ulang ke setelan awal!");
        }
    });
}

/**
 * Smooth Modal View managers
 */
function showModal(modal) {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.firstElementChild.classList.remove('scale-90');
    modal.firstElementChild.classList.add('scale-100');
}

function hideModal(modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.firstElementChild.classList.remove('scale-100');
    modal.firstElementChild.classList.add('scale-90');
}

// Load App Startup on DOM Content Load
document.addEventListener('DOMContentLoaded', initApp);
