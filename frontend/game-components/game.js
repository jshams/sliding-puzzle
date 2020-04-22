// used by game class
const NUMMOVES = document.getElementById('num-moves')
const CONGRATS = document.getElementById('congrats')
const MANDIST = document.getElementById('man-dist')

class Game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = new Board(this.newState())
        this.manDist = 0
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.shuffle()
        this.board.display()
        this.numMoves = 0
        this.moves = []
        this.isSolved = false
        this.updateManDist()
    }

    keyPress(e) {
        if (DISABLEUSERACTIVITY) { return }
        const moveLoc = [...this.board.zeroLoc]
        let inversion = false
        let one = 1
        if (inversion) {
            one = -one
        }
        // left arrow key press
        if (e.keyCode == 37) {
            moveLoc[1] -= one
        }
        // right arrow key press
        else if (e.keyCode == 39) {
            moveLoc[1] += one
        }
        // up arrow key press
        else if (e.keyCode == 38) {
            moveLoc[0] -= one
        }
        // down arrow key press
        else if (e.keyCode == 40) {
            moveLoc[0] += one
        }
        else {
            if (e.keyCode == 32) {
                this.shuffle()
            }
            else if (e.keyCode == 8) {
                this.undo()
            }
            else if (e.keyCode == 13) {
                if (this.width > 3) { alert("AI needs improvement") }
                else { this.solve() }
            }
            return
        }
        this.move(...moveLoc)
    }

    handleClick(e) {
        if (DISABLEUSERACTIVITY) { return }
        let x = e.clientX - canvas.offsetLeft
        let y = e.clientY - canvas.offsetTop

        console.log('Cursor x:', x)
        console.log('Cursor y:', y)
        console.log("Tile coordinates:", Math.floor(x / this.board.tileWidth), Math.floor(y / this.board.tileWidth))
        let moveX = Math.floor(y / this.board.tileWidth)
        let moveY = Math.floor(x / this.board.tileWidth)
        // console.log('tilewidth:', this.board.tileWidth)
        this.move(moveX, moveY)
    }

    move(x, y) {
        let prevZeroLoc = [...this.board.zeroLoc]
        const didMove = this.board.move([x, y])
        if (!didMove) { return }
        this.incNumMoves()
        this.updateManDist()
        if (this.isSolved) {
            this.isSolved = false
            this.discongratulate()
            this.numMoves = 0
            this.incNumMoves()
            this.moves = []
        }
        if (this.board.isSolved()) {
            this.congratulate()
            this.isSolved = true
        }
        this.addMove(prevZeroLoc)
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

    shuffle(n = null) {
        if (DISABLEUSERACTIVITY) { return }
        if (n === null) {
            const c = (this.width * this.height) ** 2 / 2
            n = Math.floor(Math.random() * c + c)
        }
        for (let i = 0; i < n; i++) {
            this.randomMove()
        }
        this.numMoves = -1
        this.incNumMoves()
        if (this.board.isSolved()) {
            this.shuffle(n)
        }
        this.updateManDist()
        this.discongratulate()
        this.moves = []
    }

    randomMove() {
        const zeroLoc = this.board.zeroLoc
        const nextMoves = this.board.getNextMoves(zeroLoc)
        const randomMoveChoice = this.randomChoice(nextMoves)
        this.board.move(randomMoveChoice)
    }

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    incNumMoves(n = 1) {
        this.numMoves += n
        NUMMOVES.innerHTML = this.numMoves.toString()
    }

    addMove(prevZeroLoc) {
        this.moves.push(prevZeroLoc)
    }

    undo() {
        if (DISABLEUSERACTIVITY) { return }
        // if no previous moves do nothing
        if (this.moves.length == 0) {
            return
        }
        if (this.isSolved) {
            this.isSolved = false
            this.discongratulate()
        }
        let lastMove = this.moves.pop()
        this.move(...lastMove)
        this.moves.pop()
        this.incNumMoves(-2)
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

    updateManDist() {
        this.manDist = this.board.manhattanDistance()
        MANDIST.innerHTML = this.manDist.toString()
    }

    solve() {
        if (DISABLEUSERACTIVITY) { return }
        let solver = new Solver(this.board.state)
        let solution = solver.solve()
        if (solution.length == 0) { return }

        DISABLEUSERACTIVITY = true
        var iterNum = 0
        var self = this

        function moveTile() {
            self.move(...solution[iterNum])
            if (++iterNum == solution.length) {
                clearInterval(animation)
            }
        }

        let animationInterval = 500
        var animation = setInterval(moveTile, animationInterval)
        setTimeout(() => DISABLEUSERACTIVITY = false, animationInterval * solution.length)
    }
}