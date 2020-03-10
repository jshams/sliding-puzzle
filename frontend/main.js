const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')


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
        fillRectBorderRadius(this.x + 2, this.y + 2, this.width - 4, this.width - 4, 40, 'black')
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.width - 20)
        ctx.fillStyle = '#53FE08'
        ctx.font = `${this.fontsize}px Courier New`
        // ctx.font = `${this.fontsize}px Lucida Console`
        ctx.fillText(this.num.toString(), this.x + this.width / 2.5, this.y + this.width / 1.6)
    }

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
            this.canvasHeight = 840
            this.canvasWidth = 840
            this.tileWidth = 840 / this.width
        }
        else if (this.width < this.height) {
            this.canvasHeight = 840
            this.tileWidth = 840 / this.height
            this.canvasWidth = this.tileWidth * this.width
        }
        else {
            this.canvasWidth = 840
            this.tileWidth = 840 / this.width
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

    move(tileCoordinates) {
        // move the tile at this coordinate to the zero coordinate
        let xdiff = tileCoordinates[0] - this.zeroLoc[0]
        let ydiff = tileCoordinates[1] - this.zeroLoc[1]
        let dist = Math.abs(xdiff) + Math.abs(ydiff)
        // if the distance is not 1 its an invalid swap
        if (dist != 1) {
            console.log('invalid move')
            // do nothing
            return
        }
        // get the current tile
        let tile = this.tiles[tileCoordinates[0]][tileCoordinates[1]]
        for (let i = 0; i < this.tileWidth; i++) {
            tile.move(-ydiff, -xdiff)
            // add some sleep to make it dramatic
        }
        // update state, tile locations, and zero loc
        this.tiles[this.zeroLoc[0]][this.zeroLoc[1]] = this.tiles[tileCoordinates[0]][tileCoordinates[1]]
        this.tiles[tileCoordinates[0]][tileCoordinates[1]] = 0
        this.state[this.zeroLoc[0]][this.zeroLoc[1]] = this.state[tileCoordinates[0]][tileCoordinates[1]]
        this.state[tileCoordinates[0]][tileCoordinates[1]] = 0
        this.zeroLoc = tileCoordinates
    }
}

class Game {
    constructor(len, width) {
        this.len = len
        this.wid = width
        this.state = this.newState()
        this.board = new Board(this.state)
        ctx.clearRect(0, 0, this.board.canvasWidth, this.board.canvasHeight)
        this.board.display()
    }

    newState() {
        const boardMatrix = []
        // creates a 2d matrix with a solved state
        let newRow = []
        for (let i = 1; i < this.len * this.wid; i++) {
            if ((i - 1) % this.wid === 0) {
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
}

const state = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
]

const state3x4 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 0]
]

const state4x4 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
]
const board = new Board(state4x4)
board.display()


canvas.onclick = function (e) {
    let boardEl = document.getElementById('board')
    offX = boardEl.offsetLeft
    offY = boardEl.offsetTop
    console.log('Offset x,y', offX, offY)
    console.log('Expected (49, 7)')
    let x = e.layerX
    let y = e.layerY
    console.log('x', x)
    console.log('y', y)
    console.log("box", Math.floor((y - offY) / board.tileWidth), Math.floor((x - offX) / board.tileWidth))
    let moveX = Math.floor((y - offY) / board.tileWidth)
    let moveY = Math.floor((x - offX) / board.tileWidth)
    board.move([moveX, moveY])
}