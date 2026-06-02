/**
 * ==========================================================================
 * FITJOURNEY - STORAGE MANAGEMENT SYSTEM (ADVANCED FULL-SCALE)
 * Handles persisting and loading character RPG statistics and dashboard
 * metrics using HTML5 localStorage.
 * ==========================================================================
 */

const STORAGE_KEY = 'fitjourney_full_state';

/**
 * Standard default state structure for first-time players.
 */
const DEFAULT_GAME_STATE = {
    level: 1,
    xp: 0,
    gold: 0,
    attributes: {
        strength: 10,
        agility: 10,
        endurance: 10,
        intelligence: 10
    },
    inventory: [], // Badges purchased in Gold Shop
    activityLog: [], // System events history logs
    waterGlasses: 0, // Water tracker cups
    dailyCalories: 0, // Local calorie tracker intake
    calorieBonusClaimed: false, // Whether the sweet-spot bonus was claimed
    sleepHours: 0, // sleep tracker input hours
    sleepStatus: 'Normal' // Current sleeping adviser status
};

/**
 * Saves the current game state object into browser localStorage.
 * @param {Object} state - The current game state variables.
 */
function saveGameState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
        console.error("FitJourney Storage System Error saving state: ", error);
    }
}

/**
 * Retrieves the persisted game state object. If none is found or
 * an error occurs, it constructs and returns a clean DEFAULT_GAME_STATE.
 * @returns {Object} Game state structure.
 */
function loadGameState() {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            // New user initialization
            return JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
        }
        
        const parsedState = JSON.parse(serializedState);
        
        // Deep merge or structure checking to ensure backward-compatibility
        return {
            level: parsedState.level !== undefined ? parseInt(parsedState.level, 10) : DEFAULT_GAME_STATE.level,
            xp: parsedState.xp !== undefined ? parseInt(parsedState.xp, 10) : DEFAULT_GAME_STATE.xp,
            gold: parsedState.gold !== undefined ? parseInt(parsedState.gold, 10) : DEFAULT_GAME_STATE.gold,
            attributes: {
                strength: parsedState.attributes?.strength !== undefined ? parseInt(parsedState.attributes.strength, 10) : DEFAULT_GAME_STATE.attributes.strength,
                agility: parsedState.attributes?.agility !== undefined ? parseInt(parsedState.attributes.agility, 10) : DEFAULT_GAME_STATE.attributes.agility,
                endurance: parsedState.attributes?.endurance !== undefined ? parseInt(parsedState.attributes.endurance, 10) : DEFAULT_GAME_STATE.attributes.endurance,
                intelligence: parsedState.attributes?.intelligence !== undefined ? parseInt(parsedState.attributes.intelligence, 10) : DEFAULT_GAME_STATE.attributes.intelligence
            },
            inventory: Array.isArray(parsedState.inventory) ? parsedState.inventory : DEFAULT_GAME_STATE.inventory,
            activityLog: Array.isArray(parsedState.activityLog) ? parsedState.activityLog : DEFAULT_GAME_STATE.activityLog,
            waterGlasses: parsedState.waterGlasses !== undefined ? parseInt(parsedState.waterGlasses, 10) : DEFAULT_GAME_STATE.waterGlasses,
            dailyCalories: parsedState.dailyCalories !== undefined ? parseInt(parsedState.dailyCalories, 10) : DEFAULT_GAME_STATE.dailyCalories,
            calorieBonusClaimed: parsedState.calorieBonusClaimed !== undefined ? parsedState.calorieBonusClaimed : DEFAULT_GAME_STATE.calorieBonusClaimed,
            sleepHours: parsedState.sleepHours !== undefined ? parseFloat(parsedState.sleepHours) : DEFAULT_GAME_STATE.sleepHours,
            sleepStatus: parsedState.sleepStatus !== undefined ? parsedState.sleepStatus : DEFAULT_GAME_STATE.sleepStatus
        };
    } catch (error) {
        console.error("FitJourney Storage System Error loading state: ", error);
        return JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
    }
}

/**
 * Deletes all stored game data from localStorage.
 */
function resetGameState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("FitJourney Storage System Error resetting state: ", error);
    }
}
