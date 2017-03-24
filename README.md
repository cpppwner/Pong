# Pong
Pong game based on the tutorial http://www.zekechan.net/getting-started-html5-game-development-pong1/

## Changes compared to the original tutorial
1. Code refactorings & re-styling - get rid of IntelliJ warnings.
2. Implement a menu with the following points:
   * Player can set the game difficulty.
   * Player can specify whether to play alone (against "AI") or with two human players. 

## Game difficulty
Depending on the game difficulty ("Easy", "Medium", "Difficult") the ball starts
with different speeds, starting with slower one when set to "Easy" and highest one
for "Difficult".

## Game AI
Based on the selected game difficulty the AI is more or less "intelligent".
Since it's just for testing purposes, it's not a real AI, but rather calculates
movement based on the ball's position with certain offsets.
The more difficult the game is, the less offset is used for moving the left paddle.
Therefore it might happen that the AI cannot serve balls with steep angle or
flat balls.
If you really want a serious opponent set difficulty to "Difficult" in Single player
games. :)

## Known Issues (bugs)
1. Sometimes it happens that the ball bounces somewhere on the game field, but
this happened also with the original tutorial code for me. Up to now I did not
really figure out why it happens or when it happens.
2. It also appears that for very high speeds the ball does not collide
with the paddle any more, but goes through.