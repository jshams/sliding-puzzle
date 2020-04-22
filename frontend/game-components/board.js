/**
 * Board class stores the tiles, and their postion. It can also be used for
 * drawing to the canvas if gameboard is true (default)
*/
class Board {
    constructor(state, gameBoard = true) {

        // if gameBoard is true Board will find canvas measurements
        // and create tiles otherwise its being used by solver and
        // will not need these extra computations, just its 
        // improvement: make gameBoard a subclass of Board

        // state is a 2d arr with the tile locations
        // solved state for 3x3: [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
        this.state = state
        this.width = state[0].length
        this.height = state.length
        if (!gameBoard) {
            return
        }
        this.pixelWidth = 600
        this.canvasWidth = null
        this.canvasHeight = null
        this.tileWidth = null
        //get measurements to fill in the nulls
        this.getMeasurements()
        // update the canvas with measurements
        // canvas.width = this.canvasWidth
        // canvas.height = this.canvasHeight
        // create tiles arr to store tiles
        this.tiles = []
        this.zeroLoc = this.findZeroLoc()
        // create boxes
        this.createTiles()
        // display the board
        // this.display()
    }

    getMeasurements() {
        // gets the measurements for the canvas based off the length and width
        // of the board.

        // if the width and height are the same, both the width and the height
        // are of length pixelwidth
        if (this.width == this.height) {
            this.canvasHeight = this.pixelWidth
            this.canvasWidth = this.pixelWidth
            this.tileWidth = this.pixelWidth / this.width
        }
        // if the width is less than the height, the width will have a shorter
        // length, and the height will have a length of pixelWidth
        else if (this.width < this.height) {
            this.canvasHeight = this.pixelWidth
            this.tileWidth = this.pixelWidth / this.height
            this.canvasWidth = this.tileWidth * this.width
        }
        // if the width is gretaer than the height, the height will have a shorter
        // length, and the width will have a length of pixelWidth
        else {
            this.canvasWidth = this.pixelWidth
            this.tileWidth = this.pixelWidth / this.width
            this.canvasHeight = this.tileWidth * this.height
        }
    }

    createTiles() {
        /**
         * Create tile objects and adds them to this.tiles. A d2 array of tiles
         * the order of this.state.
         */
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
        // finds and returns the location [y, x] of the empty (0) tile
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.state[y][x] == 0) { return [y, x] }
            }
        }
    }

    display() {
        // draws each tile to the canvas
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
        /**
        * given an arr of tile coordinates [y, x]. returns a boolean
        * indicating whether it is a valid move. A move is considered valid
        * if the tile is next to a zero and not out of bounds.
        */

        // if the x coordinates are out of bounds return false
        if ((tileCoordinates[0] < 0) || (tileCoordinates[0] >= this.height)) {
            console.log('invalid move: y coordinate out of bounds')
            return false
        }
        // if the y coordinates are out of bounds return false
        if ((tileCoordinates[1] < 0) || (tileCoordinates[1] >= this.width)) {
            console.log('invalid move: x coordinate out of bounds')
            return false
        }
        // find the distance of the tile position to the zero position
        let xdiff = tileCoordinates[0] - this.zeroLoc[0]
        let ydiff = tileCoordinates[1] - this.zeroLoc[1]
        let dist = Math.abs(xdiff) + Math.abs(ydiff)
        // if the distance of tile to zero is not 1 its an invalid swap
        if (dist != 1) {
            console.log('invalid move: tile not next to empty tile')
            return false
        }
        return true
    }

    move(tileCoordinates) {
        /**
         * moves a tile on the canvas to the empty postions.
         * returns a boolean indicating whether a move was performed.
         * false is returned when the move is invalid.
         */

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

        var animation = setInterval(moveTile, 1)

        // update state, tile locations, and zero loc
        this.tiles[this.zeroLoc[0]][this.zeroLoc[1]] = this.tiles[tileCoordinates[0]][tileCoordinates[1]]
        this.tiles[tileCoordinates[0]][tileCoordinates[1]] = 0
        this.state[this.zeroLoc[0]][this.zeroLoc[1]] = this.state[tileCoordinates[0]][tileCoordinates[1]]
        this.state[tileCoordinates[0]][tileCoordinates[1]] = 0
        this.zeroLoc = tileCoordinates
        return true
    }

    isSolved() {
        /**
         * returns a boolean indicating whether the board is solved.
         */

        // for every row in the board
        for (let y = 0; y < this.height; y++) {
            // for every row item in the board
            for (let x = 0; x < this.width; x++) {
                // if the position is the bottom right corner of the board
                if ((x === this.width - 1) && (y === this.height - 1)) {
                    // continue
                    continue
                }
                // get the value of the tile at this position
                const realVal = this.state[y][x]
                // get the desires value od this position
                const desiredVal = (y * this.width) + (x + 1)
                // if they are different return false
                if (realVal != desiredVal) {
                    return false
                }
            }
        }
        // if no tiles were found in the wrong position return true
        return true
    }

    getNextMoves() {
        /**
         * retuns a list of valid moves. uses this.zeroLoc to determine
         * valid moves.
         */
        const x = this.zeroLoc[0]
        const y = this.zeroLoc[1]
        let nextMoves = []
        // (x - 1, y) if x > 0
        if (x > 0) {
            nextMoves.push([x - 1, y])
        }
        // (x + 1, y) if x < len(puzzle) - 1
        if (x < this.width - 1) {
            nextMoves.push([x + 1, y])
        }
        // (x, y - 1) if y > 0
        if (y > 0) {
            nextMoves.push([x, y - 1])
        }
        // (x, y + 1) if y < len(puzzle[-1]) - 1
        if (y < this.height - 1) {
            nextMoves.push([x, y + 1])
        }
        return nextMoves
    }

    inversionCount() {
        // # flatten the puzzle and find if the zero height is odd or even
        let flatBoard = []
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const num = this.state[y][x]
                if (num != 0) {
                    flatBoard.push(num)
                }
            }
        }
        let count = 0
        // # for each number in the one d puzzle
        for (let i = 0; i < flatBoard.length; i++) {
            // # for each number succeeding the current number
            for (let j = i + 1; j < flatBoard.length; j++) {
                // # if the number is greater than the latter number
                if (flatBoard[i] > flatBoard[j]) {
                    count += 1
                }
            }
        }
        return count
    }

    manhattanDistance() {
        /**
         * returns a sum of the manhattan distance from each tile to their
         * desired location.
         * A solved board has a man dist of 0
         */

        // dist = 0
        let dist = 0
        // for iterate over x and y in puzzle
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // if the number at this position is 0, skip it
                if (this.state[y][x] != 0) {
                    // get the number that is in this position
                    let currentVal = this.state[y][x]
                    // calculate the desired x and y positions of the number
                    let desY = Math.floor((currentVal - 1) / this.width)
                    let desX = (currentVal - 1) % this.width
                    // add the differences of actual and desired vals to dist
                    dist += Math.abs(x - desX) + Math.abs(y - desY)
                }
            }
        }
        return dist
    }
}