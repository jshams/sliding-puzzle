const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')

// figure out a solution to stop the solve instead of having this
// change the AI solve button to a red stop button while solving
var DISABLEUSERACTIVITY = false


const width = 3
const height = 3
let game = new Game(width, height)
game.shuffle()


function newGame(width, height) {
    game = new Game(width, height)
}

canvas.onclick = function (e) {
    game.handleClick(e)
}

function shuffleClick() {
    game.shuffle()
}

function undoClick() {
    game.undo()
}

function solveClick() {
    if (game.width > 3) {
        alert("Ai needs improvement")
        return
    }
    game.solve()
}

document.onkeydown = function (event) {
    game.keyPress(event)
};