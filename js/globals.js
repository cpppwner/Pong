/**
 * globals for the Pong game.
 */

/**
 * Constants for game states.
 * @type {{BOOT: string, MENU: string, GAME: string}}
 */
var gameStates = {
    BOOT: 'boot',
    MENU: 'menu',
    MENU_DIFFICULTY: 'menu_difficulty',
    GAME: 'game'
};

/**
 * Game difficulty
 * @type {{EASY: number, MEDIUM: number, DIFFICULT: number}}
 */
var gameDifficulty = {
    EASY: 1,
    MEDIUM: 2,
    DIFFICULT: 3
};

/**
 * Game mode
 *
 * Either one human player or two human players.
 *
 * @type {{SINGLE_PLAYER: number, MULTI_PLAYER: number}}
 */
var gameMode = {
    SINGLE_PLAYER: 1,
    MULTI_PLAYER: 2
};

/**
 * game dimensions
 * @type {{screenWidth: number, screenHeight: number}}
 */
var gameDimensions = {
    screenWidth: 640,
    screenHeight: 480
};

var getGameDifficulty = function(difficulty) {
    switch (difficulty){
        case gameDifficulty.EASY:
            return "Easy";
        case gameDifficulty.MEDIUM:
            return "Medium";
        case gameDifficulty.DIFFICULT:
            return "Difficult";
    }
};