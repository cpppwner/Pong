/**
 * menu.js Contains the code for Pong's main menu.
 */

var menuState = function(game) {

    // The create function is called after all assets are loaded and ready for use. This is where we add all our sprites, sounds, levels, text, etc.
    var create = function () {
        // immediately advance to game state now
        game.state.start(gameStates.GAME);
    };

    return {
        create: create
    }
};
