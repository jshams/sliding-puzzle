# Sliding Puzzle

Sliding puzzles, also known as 8-puzzle or 15-puzzle are a game you might recognize from your childhood. This image might ring a bell.

<img src="https://oculusz-online.com/wp-content/uploads/2018/09/1537949833_323_s-l1600.jpg" style="width: 50%; display: block; margin: auto"/>

This project began simply as an algorithm that can solve sliding puzzles, but what's a fancy algorithm without a user interface.

---

## How to play
The goal of the game is to move numbered tiles until the tiles are order. A tile can only be moved into the blank spot. 
### Moving
To move a tile into the blank position click on it with your cursor.  
You can also use up, down, left, and right arrows to move the tiles. The blank moves in the direction of the arrow-direction. By clicking the up arrow, the tile above the blank will move down into the blank (the blank moves up).
### Shuffle
Shuffle by clicking the on-screen **shuffle button** or by pressing **spacebar** on your keyboard.
### Undo
Undo by clicking the on-screen **undo button** or by pressing **backspace** on your keyboard.
### Change the board size
Click the change size button and select your prefered size.
### AI Solve
The AI solve will learn how to solve the puzzle, then perform its solution. It can be called using the on-screen **AI Solve** button (in later versions the **enter** keypress). When the computer is solving all user interactions are disabled until the AI finished its solve (in later versions a stop button will be added). In the current version AI solve is limited to 3x3.

---

## Technologies
The frontend is built using standard HTML, CSS, and JavaScript.

The game is rendered using the JavaScript Canvas API. The Canvas API makes drawing graphics and animations simple.

The game logic, functionality, and algorithms are also written in JavaScipt to bring the canvas to life.

I used Python to prototype the algorithms to make development easier with libraries I'm more comfortable with. The programs are then translated to JS to allow the game to function.