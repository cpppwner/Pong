// The main state that contains our game. Think of states like pages or screens such as the splash screen, main menu, game screen, high scores, inventory, etc.
var mainState = function(game) {
// The game properties object that currently only contains the screen dimensions
    var gameProperties = {
        screenWidth: 640,
        screenHeight: 480,

        dashSize: 5,

        paddleLeft_x: 50,
        paddleRight_x: 590,
        paddleVelocity: 600,
        paddleSegmentsMax: 4,
        paddleSegmentHeight: 4,
        paddleSegmentAngle: 15,
        paddleTopGap: 22,

        ballVelocityEasy: 450,
        ballVelocityMedium: 475,
        ballVelocityDifficult: 500,


        ballRandomStartingAngleLeft: [-120, 120],
        ballRandomStartingAngleRight: [-60, 60],
        ballStartDelay: 2,
        ballVelocityIncrement: 25,
        ballReturnCount: 4,

        scoreToWin: 11,

        gameDifficulty: gameDifficulty.MEDIUM,
        gameMode: gameMode.MULTI_PLAYER
    };

//----------------------------------------------------------------------------------------------------------------------
// font assets
//----------------------------------------------------------------------------------------------------------------------
    var fontAssets = {
        scoreLeft_x: gameProperties.screenWidth * 0.25,
        scoreRight_x: gameProperties.screenWidth * 0.75,
        scoreTop_y: 10,

        scoreFontStyle:{font: '80px Arial', fill: '#FFFFFF', align: 'center'},
        instructionsFontStyle:{font: '24px Arial', fill: '#FFFFFF', align: 'center'}
    };

    var labels = {
        clickToStartSinglePlayer: 'Paddle: UP and DOWN arrow keys.\n\n- click to start -',
        clickToStart: 'Left paddle: A to move up, Z to move down.\n\nRight paddle: UP and DOWN arrow keys.\n\n- click to start -',
        winner: 'Winner!'
    };


    var backgroundGraphics = null;
    var ballSprite = null;
    var paddleLeftSprite = null;
    var paddleRightSprite = null;
    var paddleGroup = null;

    var paddleLeft_up = null;
    var paddleLeft_down = null;
    var paddleRight_up = null;
    var paddleRight_down = null;

    var missedSide = null;

    var scoreLeft = null;
    var scoreRight = null;

    var tf_scoreLeft = null;
    var tf_scoreRight = null;

    var sndBallHit = null;
    var sndBallBounce = null;
    var sndBallMissed = null;

    var instructions = null;
    var winnerLeft = null;
    var winnerRight = null;

    var ballVelocity = null;

    var ballReturnCount = 0;

    // The create function is called after all assets are loaded and ready for use. This is where we add all our sprites, sounds, levels, text, etc.
    var create = function () {
        initGraphics();
        initPhysics();
        initKeyboard();
        initSounds();
        startDemo();
    };

    // The update function is run every frame. The default frame rate is 60 frames per second, so the update function is run 60 times per second
    var update = function () {
        moveLeftPaddle();
        moveRightPaddle();
        game.physics.arcade.overlap(ballSprite, paddleGroup, collideWithPaddle, null, this);

        if (ballSprite.body.blocked.up || ballSprite.body.blocked.down || ballSprite.body.blocked.left || ballSprite.body.blocked.right) {
            console.log(ballSprite.body.blocked);
            sndBallBounce.play();
        }
    };

    var initGraphics = function () {
        backgroundGraphics = game.add.graphics(0, 0);
        backgroundGraphics.lineStyle(2, 0xFFFFFF, 1);

        for (var y = 0; y < gameProperties.screenHeight; y += gameProperties.dashSize * 2) {
            backgroundGraphics.moveTo(game.world.centerX, y);
            backgroundGraphics.lineTo(game.world.centerX, y + gameProperties.dashSize);
        }

        ballSprite = game.add.sprite(game.world.centerX, game.world.centerY, graphicAssets.ballName);
        ballSprite.anchor.set(0.5, 0.5);

        paddleLeftSprite = game.add.sprite(gameProperties.paddleLeft_x, game.world.centerY, graphicAssets.paddleName);
        paddleLeftSprite.anchor.set(0.5, 0.5);

        paddleRightSprite = game.add.sprite(gameProperties.paddleRight_x, game.world.centerY, graphicAssets.paddleName);
        paddleRightSprite.anchor.set(0.5, 0.5);

        tf_scoreLeft = game.add.text(fontAssets.scoreLeft_x, fontAssets.scoreTop_y, "0", fontAssets.scoreFontStyle);
        tf_scoreLeft.anchor.set(0.5, 0);

        tf_scoreRight = game.add.text(fontAssets.scoreRight_x, fontAssets.scoreTop_y, "0", fontAssets.scoreFontStyle);
        tf_scoreRight.anchor.set(0.5, 0);

        instructions = game.add.text(game.world.centerX,
                                     game.world.centerY,
                                     gameProperties.gameMode === gameMode.SINGLE_PLAYER ? labels.clickToStartSinglePlayer : labels.clickToStart,
                                     fontAssets.instructionsFontStyle);
        instructions.anchor.set(0.5, 0.5);

        winnerLeft = game.add.text(gameProperties.screenWidth * 0.25, gameProperties.screenHeight * 0.25, labels.winner, fontAssets.instructionsFontStyle);
        winnerLeft.anchor.set(0.5, 0.5);

        winnerRight = game.add.text(gameProperties.screenWidth * 0.75, gameProperties.screenHeight * 0.25, labels.winner, fontAssets.instructionsFontStyle);
        winnerRight.anchor.set(0.5, 0.5);

        hideTextFields();
    };

    var initPhysics = function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(ballSprite, Phaser.Physics.ARCADE);

        ballSprite.checkWorldBounds = true;
        ballSprite.body.collideWorldBounds = true;
        ballSprite.body.immovable = true;
        ballSprite.body.bounce.set(1);
        ballSprite.events.onOutOfBounds.add(ballOutOfBounds, this);

        paddleGroup = game.add.group();
        paddleGroup.enableBody = true;
        paddleGroup.physicsBodyType = Phaser.Physics.ARCADE;

        paddleGroup.add(paddleLeftSprite);
        paddleGroup.add(paddleRightSprite);

        paddleGroup.setAll('checkWorldBounds', true);
        paddleGroup.setAll('body.collideWorldBounds', true);
        paddleGroup.setAll('body.immovable', true);
    };

    var initKeyboard = function () {

        if (gameProperties.gameMode === gameMode.MULTI_PLAYER) {
            // only enable left paddle controls for multi player
            paddleLeft_up = game.input.keyboard.addKey(Phaser.Keyboard.A);
            paddleLeft_down = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        }

        paddleRight_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        paddleRight_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    };

    var initSounds = function () {
        sndBallHit = game.add.audio(soundAssets.ballHitName);
        sndBallBounce = game.add.audio(soundAssets.ballBounceName);
        sndBallMissed = game.add.audio(soundAssets.ballMissedName);
    };

    var startDemo = function () {
        ballSprite.visible = false;
        resetBall();
        enablePaddles(false);
        enableBoundaries(true);
        game.input.onDown.add(startGame, this);

        instructions.visible = true;
    };

    var startGame = function () {
        game.input.onDown.remove(startGame, this);

        enablePaddles(true);
        enableBoundaries(false);
        resetBall();
        resetScores();
        hideTextFields();
    };

    var startBall = function () {
        ballVelocity = getInitialBallVelocity();
        ballReturnCount = 0;
        ballSprite.visible = true;

        var randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleRight.concat(gameProperties.ballRandomStartingAngleLeft));

        if (missedSide === 'right') {
            randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleRight);
        } else if (missedSide === 'left') {
            randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleLeft);
        }

        game.physics.arcade.velocityFromAngle(randomAngle, getInitialBallVelocity(), ballSprite.body.velocity);
    };

    var resetBall = function () {
        ballSprite.reset(game.world.centerX, game.rnd.between(0, gameProperties.screenHeight));
        ballSprite.visible = false;
        game.time.events.add(Phaser.Timer.SECOND * gameProperties.ballStartDelay, startBall, this);
    };

    var enablePaddles = function (enabled) {
        paddleGroup.setAll('visible', enabled);
        paddleGroup.setAll('body.enable', enabled);

        if (gameProperties.gameMode === gameMode.MULTI_PLAYER) {
            paddleLeft_up.enabled = enabled;
            paddleLeft_down.enabled = enabled;
        }
        paddleRight_up.enabled = enabled;
        paddleRight_down.enabled = enabled;

        paddleLeftSprite.y = game.world.centerY;
        paddleRightSprite.y = game.world.centerY;
    };

    var enableBoundaries = function (enabled) {
        game.physics.arcade.checkCollision.left = enabled;
        game.physics.arcade.checkCollision.right = enabled;
    };

    var moveLeftPaddle = function () {
        if (gameProperties.gameMode === gameMode.SINGLE_PLAYER) {
            aiUpdateLeftPaddle();
       } else {
            if (paddleLeft_up.isDown) {
                paddleLeftSprite.body.velocity.y = -gameProperties.paddleVelocity;
            }
            else if (paddleLeft_down.isDown) {
                paddleLeftSprite.body.velocity.y = gameProperties.paddleVelocity;
            } else {
                paddleLeftSprite.body.velocity.y = 0;
            }
        }

        if (paddleLeftSprite.body.y < gameProperties.paddleTopGap) {
            paddleLeftSprite.body.y = gameProperties.paddleTopGap;
        }
    };

    var aiUpdateLeftPaddle = function() {

        var threshhold = 1;
        if (gameProperties.gameDifficulty === gameDifficulty.EASY) {
            threshhold = paddleLeftSprite.height / 3;
        } else if (gameProperties.gameDifficulty === gameDifficulty.MEDIUM) {
            threshhold = paddleLeftSprite.height / 6;
        }

        if ((ballSprite.world.y - paddleLeftSprite.world.y) > threshhold) {
            // ball is below paddle
            if (ballSprite.body.velocity.y < 0) {
                // ball is moving up
                paddleLeftSprite.body.velocity.setTo(-ballSprite.body.velocity.y);
            } else {
                // ball is moving down
                paddleLeftSprite.body.velocity.setTo(ballSprite.body.velocity.y)
            }

        } else if ((ballSprite.world.y - paddleLeftSprite.position.y) < -1 * threshhold) {
            // ball is above paddle
            if (ballSprite.body.velocity.y < 0) {
                // ball is moving up
                paddleLeftSprite.body.velocity.setTo(ballSprite.body.velocity.y);
            } else {
                // ball is moving down
                paddleLeftSprite.body.velocity.setTo(-ballSprite.body.velocity.y)
            }
        }
        paddleLeftSprite.body.maxVelocity.y = gameProperties.paddleVelocity;
        paddleLeftSprite.body.velocity.x = 0;
    };

    var moveRightPaddle = function () {
        if (paddleRight_up.isDown)
        {
            paddleRightSprite.body.velocity.y = -gameProperties.paddleVelocity;
        }
        else if (paddleRight_down.isDown)
        {
            paddleRightSprite.body.velocity.y = gameProperties.paddleVelocity;
        } else {
            paddleRightSprite.body.velocity.y = 0;
        }

        if (paddleRightSprite.body.y < gameProperties.paddleTopGap) {
            paddleRightSprite.body.y = gameProperties.paddleTopGap;
        }
    };

    var collideWithPaddle = function (ball, paddle) {
        sndBallHit.play();

        var returnAngle;
        var segmentHit = Math.floor((ball.y - paddle.y)/gameProperties.paddleSegmentHeight);

        if (segmentHit >= gameProperties.paddleSegmentsMax) {
            segmentHit = gameProperties.paddleSegmentsMax - 1;
        } else if (segmentHit <= -gameProperties.paddleSegmentsMax) {
            segmentHit = -(gameProperties.paddleSegmentsMax - 1);
        }

        if (paddle.x < gameProperties.screenWidth * 0.5) {
            returnAngle = segmentHit * gameProperties.paddleSegmentAngle;
            game.physics.arcade.velocityFromAngle(returnAngle, ballVelocity, ballSprite.body.velocity);
        } else {
            returnAngle = 180 - (segmentHit * gameProperties.paddleSegmentAngle);
            if (returnAngle > 180) {
                returnAngle -= 360;
            }

            game.physics.arcade.velocityFromAngle(returnAngle, ballVelocity, ballSprite.body.velocity);
        }

        ballReturnCount++;

        if(ballReturnCount >= gameProperties.ballReturnCount) {
            ballReturnCount = 0;
            ballVelocity += gameProperties.ballVelocityIncrement;
        }
    };

    var ballOutOfBounds = function () {
        sndBallMissed.play();

        if (ballSprite.x < 0) {
            missedSide = 'left';
            scoreRight++;
        } else if (ballSprite.x > gameProperties.screenWidth) {
            missedSide = 'right';
            scoreLeft++;
        }

        updateScoreTextFields();

        if (scoreLeft >= gameProperties.scoreToWin) {
            winnerLeft.visible = true;
            startDemo();
        } else if (scoreRight >= gameProperties.scoreToWin) {
            winnerRight.visible = true;
            startDemo();
        } else {
            resetBall();
        }
    };

    var resetScores = function () {
        scoreLeft = 0;
        scoreRight = 0;
        updateScoreTextFields();
    };

    var updateScoreTextFields = function () {
        tf_scoreLeft.text = scoreLeft;
        tf_scoreRight.text = scoreRight;
    };

    var hideTextFields = function () {
        instructions.visible = false;
        winnerLeft.visible = false;
        winnerRight.visible = false;
    };

    var getInitialBallVelocity = function() {

        switch(gameProperties.gameDifficulty) {
            case gameDifficulty.EASY:
                return gameProperties.ballVelocityEasy;
            case gameDifficulty.MEDIUM:
                return gameProperties.ballVelocityMedium;
            case gameDifficulty.DIFFICULT:
                return gameProperties.ballVelocityDifficult;
        }
    };

    var getDifficulty = function() {
        return gameProperties.gameDifficulty;
    };

    var setDifficulty = function(difficulty) {
        gameProperties.gameDifficulty = difficulty;
    };

    var setGameMode = function(gameMode) {
        gameProperties.gameMode = gameMode;
    };

    return {
        create: create,
        update: update,
        getDifficulty: getDifficulty,
        setDifficulty: setDifficulty,
        setGameMode: setGameMode
    };
};