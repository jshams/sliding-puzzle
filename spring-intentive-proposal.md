# Juniors Spring Intensive Deliverable Proposal


Dates 4/13-5/8

**My Name: Jake Shams** 


**Project Name: Sliding Puzzle Solver** 


**Is your project New or Old? Old**


**Is your project Solo or Team? Solo**


## Description

**Sliding Puzzle is an online playable sliding puzzle game. You can play by clicking on the tiles or using your keyboard keys. If you get stuck there is also an AI button that you can click and watch as the computer solves the puzzle.**

## Challenges I Anticipate

**The biggest challenge I have now is that all my code is in one file and it is extremely hard to navigate. This is going to require a refactor.**  
**The next challenge is whether solving a 6x6 is even posslible by a computer. In my research I haven't seen any solvers that can solve anything greater than a 5x5 in acceptable time. And the 5x5s I've seen are extremely slow.**

## Skateboard

**The skateboard was already implemented. It was a working sliding puzzle visual with the ability to click on tiles and move them (already done)** 

<img height="300" src="https://media.giphy.com/media/Kc2BimDt39cKYV89wu/giphy.gif"/>

<a href="https://giphy.com/gifs/slidingpuzzle-Kc2BimDt39cKYV89wu">via GIPHY</a>

## Bike
**The game has functionality and it can alert you when you have solved the puzzle. You can also shuffle the puzzle and change its size. (already done)** 

## Car
**The AI can solve the puzzle. This is already done but only for 2x2 and 3x3 puzzles. My most important goal of this intensive is to improve the AI solver.** 

<img height="300" src="https://media.giphy.com/media/Rki0Obx78hOMNZeqzf/giphy.gif"/>

<a href="https://giphy.com/gifs/slidingpuzzle-Rki0Obx78hOMNZeqzf">via GIPHY</a>


## Personal Achievement Goals:

**I'd like to improve sliding puzzle by implementing the solve for up to 5x5 puzzle boards. The current AI can only solve 3x3 though I already have a python prototype that can solve some 5x5 boards. I'd also like to give the project a file structure. I was having issues with JavaScript import so everything is in one JS file.**

### My Goals

#### Goal 1
Split up the large JS file into multiple smaller files so the project is easier to navigate.
Steps to completion:

1. Research different ways of using imports with vanilla JS
    - Import directly into HTML file
    - Webpack JS
    - Bundle JS
2. Decide ON PAPER how to split up the files
    - Draw it out before doing it
2. Rearchitect the files
    - split up the large file into multiple small files

#### Goal 2
Improve the AI to use A* method. This will allow the AI to solve up to 4x4 sliding puzzles.

1. Implement a priority queue class in JS
    - This allows the AI to prioritize closer solves in the game tree.
2. Create the heuristic
    - Use manhattan distance to guide the AI.
    - This will help ensure the game tree can cut branches that go in the wrong direction.
3. Create the improved solver.

#### Goal 3
Improve the AI to work with 5x5 sliding puzzles. This one is far more complicated than the previous and will require a more advanced algorithm, and lots of testing. The steps below are ideas on how it can work.

1. Use an extra heurisics.
    - With an added heuristiic we may be able to prioritize boards differently.
2. Baby steps.
    - Instead of solving the whole puzzle at once, only focus on on row or column at a time.
    - This will require its own algorithm and heuristic.
3. Do research
    - See how other more complex games tackle these issues using AI
4. Find out if Deep Learning can be applied. (I'd hope so).
5. Create a hybrid algorithm that uses both DFS and BFS.

#### Goal 4
Add terminal window on the frontend. This is in the wireframe and it will show the user what functions are called in the code when they click certain buttons. I think it will make the game look more *techy*. It can be seen in the wireframes.

1. Create a text container on the frontend to store the terminal text.
    - Give it a set height and allow scrolling
    - black background
    - find out how to color some of the text (use a span?)
2. Create some functions that allow it to update the inner text.
3. When the puzzle is solving, display the solution.
    - in python I have implemented a display solution method.
    - recreate this in JavaScript and try to add the fancy colors.
    - it might be important to add a seperate move function for when the AI is moving vs when the user is moving.



## Wireframes
<img height="200" src="https://cdn.filestackcontent.com/9AQ1nce0Tqi1Yy0sbscQ"/>

**[View the wireframes on figma](https://www.figma.com/file/BuXxboosB21dnLdgpmMt2P/Sliding-Puzzle?node-id=0%3A1)**


## Evaluation

**You must meet the following criteria in order to pass the intensive:**

- Students must get proposal approved before starting the project to pass
- SOLO 
    - must score an average above a 2.5 on the [rubric]
- Pitch your product

[rubric]:https://docs.google.com/document/d/1IOQDmohLBEBT-hyr-2vgw1mbZUNsq3fHxVfH0oRmVt0/edit


## Approval Checklist
- [ ] If I have a team project, I wrote this proposal to represent my work and only my work
- [ ] I have completed all the necessary parts of this proposal
- [ ] I linked my proposal in the Spring Intensive Tracker

### Sign off

**Student Name:**                
> Jake Shams / April 13, 2020
**Make School Advisor Name**
> TBD