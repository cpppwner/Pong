/**
 * menu.js Contains the code for Pong's main menu.
 */

var menuState = function(game) {

    var headerText = "Pong Clone by Stefan Eberl";

    var selectedIndex = 0;

    /**
     * Sorted list of menu entries.
     *
     * NOTE: Index must be consecutive and sorted.
     */
    var menuEntries = [
        { text: function() { return "Single Player Game"; }, action: function() { startSinglePlayerGame(); } },
        { text: function() { return "Multi Player Game"; }, action: function() { startMultiPlayerGame(); } },
        { text: function() { return "Game Difficulty [" + getGameDifficulty(game.state.states[gameStates.GAME].getDifficulty()) + "]"; }, action: function() { selectDifficulty(); } }
    ];

    var menu = null;


    // The create function is called after all assets are loaded and ready for use. This is where we add all our sprites, sounds, levels, text, etc.
    var create = function () {

        menu = menuUtil(game, headerText, menuEntries);
        menu.show(selectedIndex);
    };

    var startSinglePlayerGame = function() {

        selectedIndex = menu.getSelectedIndex();
        console.log('single player');
    };

    var startMultiPlayerGame = function() {

        selectedIndex = menu.getSelectedIndex();
        console.log('multi player');
    };

    var selectDifficulty = function() {

        selectedIndex = menu.getSelectedIndex();
        game.state.start(gameStates.MENU_DIFFICULTY);
    };

    return {
        create: create
    };
};
