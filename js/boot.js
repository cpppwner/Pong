/**
 * boot.js - Contains the phaser startup code for our game
 *
 * @type {c.Game}
 */

var bootState = function(game) {

    // The preload function is use to load assets into the game
    var preload = function () {
        // load graphic assets
        game.load.image(graphicAssets.ballName, graphicAssets.ballURL);
        game.load.image(graphicAssets.paddleName, graphicAssets.paddleURL);

        // load sound assets
        game.load.audio(soundAssets.ballBounceName, [soundAssets.ballBounceURL+soundAssets.mp4URL, soundAssets.ballBounceURL+soundAssets.oggURL]);
        game.load.audio(soundAssets.ballHitName, [soundAssets.ballHitURL+soundAssets.mp4URL, soundAssets.ballHitURL+soundAssets.oggURL]);
        game.load.audio(soundAssets.ballMissedName, [soundAssets.ballMissedURL+soundAssets.mp4URL, soundAssets.ballMissedURL+soundAssets.oggURL]);
    };

    // The create function is called after all assets are loaded and ready for use. This is where we add all our sprites, sounds, levels, text, etc.
    var create = function () {
        // advance to the next state, which is the menu
        game.state.start(gameStates.MENU);
    };

    return {
        preload: preload,
        create: create
    }
};

// Initialise the Phaser framework by creating an instance of a Phaser.Game object and assigning it to a local variable called 'game'.
// The first two arguments are the width and the height of the canvas element. In this case 640 x 480 pixels. You can resize this in the gameProperties object above.
// The third argument is the renderer that will be used. Phaser.AUTO is used to automatically detect whether to use the WebGL or Canvas renderer.
// The fourth argument is 'gameDiv', which is the id of the DOM element we used above in the index.html file where the canvas element is inserted.
var game = new Phaser.Game(gameDimensions.screenWidth, gameDimensions.screenHeight, Phaser.AUTO, 'gameDiv');

// Here we declare and add a state to the game object.
// The first argument is the state name that will is used to switch between states
// The second argument is the object name that will used when a state name is called
game.state.add(gameStates.BOOT, bootState);
game.state.add(gameStates.MENU, menuState);
game.state.add(gameStates.MENU_DIFFICULTY, menuDifficultyState);
game.state.add(gameStates.GAME, mainState);

// We are using the 'main' state name as the argument to load our new state.
game.state.start(gameStates.BOOT);
