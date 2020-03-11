const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')
const NUMMOVES = document.getElementById('num-moves')
const SHUFFLEBTN = document.getElementById('shuffle-btn')
const CONGRATS = document.getElementById('congrats')
const DROPDOWN = document.getElementById('dropdown')
const DROPDOWNS = document.getElementsByClassName("dropdown-content")


function fillRectBorderRadius(x, y, width, height, borderRadius, color) {
    /**
    * similar to ctx.fillRect with added borderRadius and color choices
    * draws to the canvas a rectangle x amd y starting positions
    * of size width and height, with a rounded border of size borderRadius.
    * color or "fillstyle" can also be customized
    */
    ctx.fillStyle = color
    ctx.beginPath()
    // draw vertical (taller) rectangle
    ctx.rect(x + borderRadius, y, width - 2 * borderRadius, height)
    // draw horizontal (wider) rectangle
    ctx.rect(x, y + borderRadius, width, height - 2 * borderRadius)
    // ctx.arc(left, top, radius, faces right + (0...2)*Math.pi, draw till (0...2)*Math.pi)
    // ctx.fillStyle = 'blue'
    // draw top left circle
    ctx.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, 1.5 * Math.PI)
    // ctx.fill()
    // draw top right circle
    ctx.arc(x + width - borderRadius, y + borderRadius, borderRadius, 1.5 * Math.PI, 0)
    // ctx.fill()
    // draw bottom left circle
    ctx.arc(x + borderRadius, y + height - borderRadius, borderRadius, 0.5 * Math.PI, Math.PI)
    // ctx.fill()
    // draw bottom right circle
    ctx.arc(x + width - borderRadius, y + height - borderRadius, borderRadius, 0, 0.5 * Math.PI)
    ctx.fill()
}


class Tile {
    constructor(num, width, x, y) {
        this.num = num
        this.width = width
        this.x = x
        this.y = y
        this.color = 'yellow'
        this.fontsize = Math.floor(this.width / 2.4)
    }

    draw() {
        // ctx.fillStyle = 'white'
        // ctx.fillStyle(this.x, this.y, this.width, this.width)
        ctx.fillStyle = 'black'
        // ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.width - 4)
        fillRectBorderRadius(this.x + 4, this.y + 4, this.width - 8, this.width - 8, this.width / 5, 'black')
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.width - 20)
        ctx.fillStyle = '#53FE08'
        ctx.font = `${this.fontsize}px Courier New`
        // ctx.font = `${this.fontsize}px Lucida Console`
        ctx.fillText(this.num.toString(), this.x + this.width / 2.5, this.y + this.width / 1.6)
    }

    // t = game.board.tiles[1][0]
    // for (let i=0; i < 28; i++) {wait(100); t.move(0, -10)}

    move(x_inc, y_inc) {
        ctx.clearRect(this.x, this.y, this.width, this.width)
        this.x += x_inc
        this.y += y_inc
        this.draw()
    }
}

class Board {
    constructor(state) {
        this.state = state
        this.width = state[0].length
        this.height = state.length
        this.pixelWidth = 600
        // boardState is a 2d arr or tuple with the tile locations
        // solved state for 3x3: ((1, 2, 3), (4, 5, 6), (7, 8, 0))
        this.boardState = state
        this.canvasWidth = null
        this.canvasHeight = null
        this.tileWidth = null
        //get measurements to fill in the nulls
        this.getMeasurements()
        // update the camvas with measurements
        canvas.width = this.canvasWidth
        canvas.height = this.canvasHeight
        // create tiles arr to store tiles
        this.tiles = []
        this.zeroLoc = this.findZeroLoc()
        // create boxes
        this.createBoxes()
        // display the board
        // this.display()
    }

    getMeasurements() {
        if (this.width == this.height) {
            this.canvasHeight = this.pixelWidth
            this.canvasWidth = this.pixelWidth
            this.tileWidth = this.pixelWidth / this.width
        }
        else if (this.width < this.height) {
            this.canvasHeight = this.pixelWidth
            this.tileWidth = this.pixelWidth / this.height
            this.canvasWidth = this.tileWidth * this.width
        }
        else {
            this.canvasWidth = this.pixelWidth
            this.tileWidth = this.pixelWidth / this.width
            this.canvasHeight = this.tileWidth * this.height
        }
    }

    createBoxes() {
        for (let y = 0; y < this.height; y++) {
            let rowTiles = []
            for (let x = 0; x < this.width; x++) {
                if (this.state[y][x] == 0) {
                    rowTiles.push(0)
                }
                else {
                    let newBox = new Tile(
                        this.state[y][x],
                        this.tileWidth,
                        x * this.tileWidth,
                        y * this.tileWidth
                    )
                    rowTiles.push(newBox)
                }
            }
            this.tiles.push(rowTiles)
        }
    }

    findZeroLoc() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.state[y][x] == 0) { return [y, x] }
            }
        }
    }

    display() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let currTile = this.tiles[y][x]
                if (currTile != 0) {
                    currTile.draw()
                }
            }
        }
    }

    isValidMove(tileCoordinates) {
        // if the x coordinates are invalid return false
        if ((tileCoordinates[0] < 0) || (tileCoordinates[0] >= this.height)) {
            console.log('invalid move: y coordinate out of bounds')
            return false
        }
        // if the y coordinates are invalid return false
        if ((tileCoordinates[1] < 0) || (tileCoordinates[1] >= this.width)) {
            console.log('invalid move: x coordinate out of bounds')
            return false
        }
        let xdiff = tileCoordinates[0] - this.zeroLoc[0]
        let ydiff = tileCoordinates[1] - this.zeroLoc[1]
        let dist = Math.abs(xdiff) + Math.abs(ydiff)
        // if the distance of tile from empty is not 1 its an invalid swap
        if (dist != 1) {
            console.log('invalid move: tile not next to empty tile')
            return false
        }
        return true
    }

    move(tileCoordinates) {
        // move the tile at this coordinate to the zero coordinate
        if (!this.isValidMove(tileCoordinates)) {
            return
        }
        let xdiff = -5 * (tileCoordinates[0] - this.zeroLoc[0])
        let ydiff = -5 * (tileCoordinates[1] - this.zeroLoc[1])
        // get the current tile
        let tile = this.tiles[tileCoordinates[0]][tileCoordinates[1]]
        var numIters = this.tileWidth / 5
        var iterNum = 1

        function moveTile() {
            tile.move(ydiff, xdiff)
            // console.log(iterNum, this.tileWidth)
            if (++iterNum > numIters) {
                clearInterval(animation)
            }
        }

        var animation = setInterval(moveTile, 2)

        // update state, tile locations, and zero loc
        this.tiles[this.zeroLoc[0]][this.zeroLoc[1]] = this.tiles[tileCoordinates[0]][tileCoordinates[1]]
        this.tiles[tileCoordinates[0]][tileCoordinates[1]] = 0
        this.state[this.zeroLoc[0]][this.zeroLoc[1]] = this.state[tileCoordinates[0]][tileCoordinates[1]]
        this.state[tileCoordinates[0]][tileCoordinates[1]] = 0
        this.zeroLoc = tileCoordinates
        return true
    }

    isSolved() {
        // for x in range(len(puzzle)):
        for (let y = 0; y < this.height; y++) {
            //     for y in range(len(puzzle[-1])):
            for (let x = 0; x < this.width; x++) {
                // if x == len(puzzle) - 1 and y == len(puzzle[-1]) - 1:
                if ((x === this.width - 1) && (y === this.height - 1)) {
                    // continue
                    continue
                }
                // if puzzle[x][y] != (x*len(puzzle[-1])) + (y + 1):
                const realVal = this.state[y][x]
                const desiredVal = (y * this.width) + (x + 1)
                if (realVal != desiredVal) {
                    return false
                }
            }
        }
        return true
    }
}

class Game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = new Board(this.newState())
        ctx.clearRect(0, 0, this.board.canvasWidth, this.board.canvasHeight)
        // this.shuffle(10)
        this.board.display()
        this.numMoves = 0
        this.isSolved = false
    }

    handleClick(e) {
        let x = e.clientX - canvas.offsetLeft
        let y = e.clientY - canvas.offsetTop

        console.log('x', x)
        console.log('y', y)
        console.log("box", Math.floor(y / this.board.tileWidth), Math.floor(x / this.board.tileWidth))
        let moveX = Math.floor(y / this.board.tileWidth)
        let moveY = Math.floor(x / this.board.tileWidth)
        console.log('tilewidth:', this.board.tileWidth)
        const didMove = this.board.move([moveX, moveY])
        if (didMove) {
            this.incNumMoves()
            if (this.isSolved) {
                this.isSolved = false
                this.discongratulate()
                this.numMoves = 0
                this.incNumMoves()
            }
            if (this.board.isSolved()) {
                this.congratulate()
                this.isSolved = true
            }
        }
    }

    newState() {
        const boardMatrix = []
        // creates a 2d matrix with a solved state
        let newRow = []
        for (let i = 1; i < this.width * this.height; i++) {
            if ((i - 1) % this.width === 0) {
                if (newRow.length > 1) {
                    boardMatrix.push(newRow)
                    newRow = []
                }
            }
            newRow.push(i)
        }
        newRow.push(0)
        boardMatrix.push(newRow)
        return boardMatrix
    }

    shuffle(n) {
        for (let i = 0; i < n; i++) {
            this.randomMove()
        }
        this.numMoves = -1
        this.incNumMoves()
        if (this.board.isSolved()) {
            this.shuffle(n)
        }
    }

    randomMove() {
        const zeroLoc = this.board.zeroLoc
        const nextMoves = this.getNextMoves(zeroLoc)
        const randomMoveChoice = this.randomChoice(nextMoves)
        this.board.move(randomMoveChoice)
    }

    getNextMoves(zeroLoc) {
        const x = zeroLoc[0]
        const y = zeroLoc[1]
        let nextMoves = []
        // (x - 1, y) if x > 0
        if (x > 0) {
            nextMoves.push([x - 1, y])
        }
        // (x + 1, y) if x < len(puzzle) - 1
        if (x < this.board.width - 1) {
            nextMoves.push([x + 1, y])
        }
        // (x, y - 1) if y > 0
        if (y > 0) {
            nextMoves.push([x, y - 1])
        }
        // (x, y + 1) if y < len(puzzle[-1]) - 1
        if (y < this.board.height - 1) {
            nextMoves.push([x, y + 1])
        }
        return nextMoves
    }

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    incNumMoves() {
        this.numMoves += 1
        NUMMOVES.innerHTML = this.numMoves.toString()
    }

    congratulate() {
        CONGRATS.innerHTML = `Solved!`
        CONGRATS.classList.add("solved")
        CONGRATS.classList.remove("unsolved");
    }

    discongratulate() {
        CONGRATS.innerHTML = 'Unsolved'
        CONGRATS.classList.add("unsolved");
        CONGRATS.classList.remove("solved")
    }
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdown() {
    DROPDOWN.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        for (let i = 0; i < DROPDOWNS.length; i++) {
            if (DROPDOWNS[i].classList.contains('show')) {
                DROPDOWNS[i].classList.remove('show');
            }
        }
    }
}

const width = 3
const height = 3
let game = new Game(width, height)
game.shuffle((width * height) ** 2)


function newGame(width, height) {
    game = new Game(width, height)
    game.shuffle((width * height) ** 2)
}



canvas.onclick = function (e) {
    game.handleClick(e)
}

function shuffleClick() {
    game.shuffle((width * height) ** 2)
    game.discongratulate()
}