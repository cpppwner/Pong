/**
 * menu.js Contains some menu helper stuff
 */

var menuUtil = function(game, headerText, menuEntries) {

    var keyUp = null;
    var keyDown = null;
    var keyEnter = null;

    var ballSprite = null;
    var sndBallBounce = null;

    var ballOffsetPixels = 20;

    var fontSizePixels = 24; // font size in pixels of each menu entry
    var menuSpacePixels = 10; // space in pixels between each menu entry

    //------------------------------------------------------------------------------------------------------------------
    // menu specific font assets
    //------------------------------------------------------------------------------------------------------------------
    var fontAssets = {
        headerFontStyle: {font: '32px Arial', fill: '#FFFFFF', align: 'center'},
        menuFontStyle: {font: fontSizePixels.toString()+'px Arial', fill: '#FFFFFF', align: 'center'},
        hintFontStyle: {font: '16px Arial', fill: '#FFFFFF', align: 'center'}
    };

    var hintText = "UP and DOWN arrow keys to navigate.\nENTER key to confirm selection.";

    var menuSpace = (menuEntries.length * fontSizePixels) + ((menuEntries.length - 1) * menuSpacePixels);
    var menuOffset_y = (gameDimensions.screenHeight - menuSpace) / 2;

    var ballOffset_x = null;
    var tf_Entries = [];

    var selectedMenuIndex = 0;

    var show = function(selectedIndex) {

        setSelectedIndex(selectedIndex);
        initHeader();
        initMenu();
        initHintText();
        initKeyboard();
        initSounds();
    };

    var hide = function() {

        tf_Entries.forEach(function(e) {
           e.visible = false;
           e.destroy();
        });
        game.input.reset();
        ballSprite.destroy();
        sndBallBounce.destroy();
    };

    var setSelectedIndex = function(selectedIndex) {
        selectedMenuIndex = selectedIndex;
    };

    var getSelectedIndex = function() {
        return selectedMenuIndex;
    };

    var initHeader = function() {

        var tf_Header =  game.add.text(game.world.centerX, 100, headerText, fontAssets.headerFontStyle);
        tf_Header.anchor.set(0.5, 0.5);
        tf_Entries.push(tf_Header);
    };

    var initMenu = function() {

        var maxWidth = 0;

        for (var i = 0; i < menuEntries.length; i++) {

            var text = menuEntries[i].text();
            var y_offset = i === 0 ? menuOffset_y : menuOffset_y + (i * (fontSizePixels + menuSpacePixels));
            var tf_Entry = game.add.text(game.world.centerX, y_offset, text, fontAssets.menuFontStyle);
            tf_Entry.anchor.set(0.5, 0.5);
            tf_Entries.push(tf_Entry);

            // house keeping avoid double looping
            maxWidth = maxWidth > tf_Entry.width ? maxWidth : tf_Entry.width;
        }

        ballOffset_x =  ((gameDimensions.screenWidth - maxWidth) / 2) - ballOffsetPixels;
        ballSprite = game.add.sprite(ballOffset_x, 0, graphicAssets.ballName);
        ballSprite.anchor.set(0.5, 0.5);
        ballSprite.y = getBallOffsetY();
    };

    var initHintText = function() {

        var tf_Hint = game.add.text(game.world.centerX, gameDimensions.screenHeight - 100, hintText, fontAssets.hintFontStyle);
        tf_Hint.anchor.set(0.5, 0.5);
        tf_Entries.push(tf_Hint);
    };


    var initKeyboard = function() {

        keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        keyUp.enabled = true;
        keyUp.onUp.add(onUpArrowKeyUp, this);
        keyDown.enabled = true;
        keyDown.onUp.add(onDownArrowKeyUp, this);
        keyEnter.enabled = true;
        keyEnter.onUp.add(function() { menuEntries[selectedMenuIndex].action();}, this);
    };
    var initSounds = function() {

        sndBallBounce = game.add.audio(soundAssets.ballBounceName);
    };

    var getBallOffsetY = function() {

        var result = menuOffset_y + selectedMenuIndex * (fontSizePixels + menuSpacePixels);
        return result - (ballSprite.height / 2);
    };

    var onUpArrowKeyUp = function() {
        if (selectedMenuIndex > 0) {
            selectedMenuIndex--;
            updateMenu();
        }
    };

    var onDownArrowKeyUp = function() {
        if (selectedMenuIndex < (menuEntries.length - 1)) {
            selectedMenuIndex++;
            updateMenu();
        }
    };

    var updateMenu = function() {

        // update ball sprite
        ballSprite.y = getBallOffsetY();
        // and also play bouncing sound
        sndBallBounce.play();
    };

    return {
        show: show,
        hide: hide,
        getSelectedIndex: getSelectedIndex,
        setSelectedIndex: setSelectedIndex
    };
};