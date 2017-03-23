/**
 * menu.js Contains the code for Pong's main menu.
 */

var menuDifficultyState = function(game) {

    var headerText = "Choose Game Difficulty";

    /**
     * Sorted list of menu entries.
     *
     * NOTE: Index must be consecutive and sorted.
     */
    var menuEntries = [
        { text: function() { return getGameDifficulty(gameDifficulty.EASY); }, action: function() { selectDifficulty(gameDifficulty.EASY); } },
        { text: function() { return getGameDifficulty(gameDifficulty.MEDIUM); }, action: function() { selectDifficulty(gameDifficulty.MEDIUM); } },
        { text: function() { return getGameDifficulty(gameDifficulty.DIFFICULT); }, action: function() { selectDifficulty(gameDifficulty.DIFFICULT); } }
    ];

    var menu = null;


    // The create function is called after all assets are loaded and ready for use. This is where we add all our sprites, sounds, levels, text, etc.
    var create = function () {

        menu = menuUtil(game, headerText, menuEntries);
        menu.show(game.state.states[gameStates.GAME].getDifficulty() - 1);
    };

    var selectDifficulty = function(difficulty) {

        game.state.states[gameStates.GAME].setDifficulty(difficulty);
        game.state.start(gameStates.MENU);
    };

    return {
        create: create
    };
};
