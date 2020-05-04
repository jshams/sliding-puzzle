class Solver {
    constructor(state) {
        this.state = state
        this.seen = {}
        this.queue = []
        this.solution = null
    }

    enqueueFirstBoard() {
        // create the first board instance of starting state
        let firstBoard = new Board(this.state, false)
        if (firstBoard.isSolved()) {
            this.solution = []
            return
        }
        // find the zero location (only once)
        firstBoard.zeroLoc = firstBoard.findZeroLoc()
        firstBoard.moves = []
        this.queue.push(firstBoard)
        this.seen[firstBoard.state] = true
    }

    move(board, tileCoordinates) {
        // create a copy of the board state
        let newState = board.state.map(arr => [...arr])
        // this.state[this.zeroLoc[0]][this.zeroLoc[1]] = this.state[tileCoordinates[0]][tileCoordinates[1]]
        newState[board.zeroLoc[0]][board.zeroLoc[1]] = newState[tileCoordinates[0]][tileCoordinates[1]]
        newState[tileCoordinates[0]][tileCoordinates[1]] = 0
        let newBoard = new Board(newState, false)
        newBoard.zeroLoc = tileCoordinates
        newBoard.moves = [...board.moves]
        newBoard.moves.push(tileCoordinates)
        return newBoard
    }

    getNextStates(board) {
        let nextMoves = board.getNextMoves()
        let newBoards = []
        for (let i = 0; i < nextMoves.length; i++) {
            let newBoard = this.move(board, nextMoves[i])
            newBoards.push(newBoard)
        }
        return newBoards
    }

    solve() {
        this.enqueueFirstBoard()
        if (this.solution != null) {
            return this.solution
        }
        while (this.queue.length > 0) {
            let currBoard = this.queue.shift()
            let newBoards = this.getNextStates(currBoard)
            for (let i = 0; i < newBoards.length; i++) {
                let newBoard = newBoards[i]
                if (this.seen[newBoard.state] === undefined) {
                    if (newBoard.isSolved()) {
                        this.solution = newBoard.moves
                        return newBoard.moves
                    }
                    this.seen[newBoard.state] = true
                    this.queue.push(newBoard)
                }
            }
        }
        console.log('UNSOLVEABLE')
    }
}

class AdvancedSolver extends Solver {
    constructor(state) {
        super(state)
        this.queue = new PriorityQueue()
    }

    enqueueFirstBoard() {
        // create the first board instance of starting state
        let firstBoard = new Board(this.state, false)
        if (firstBoard.isSolved()) {
            this.solution = []
            return
        }
        // find the zero location (only once)
        firstBoard.zeroLoc = firstBoard.findZeroLoc()
        firstBoard.manDist = firstBoard.manhattanDistance()
        firstBoard.moves = []
        this.queue.push(firstBoard, firstBoard.manDist)
        this.seen[firstBoard.state] = true
    }

    getNextManDist(board, move) {
        // get the number that is in this position
        let currentVal = board.state[move[0]][move[1]]
        // calculate the desired x and y positions of the number
        let desY = Math.floor((currentVal - 1) / this.width)
        let desX = (currentVal - 1) % this.width
        // add the differences of actual and desired vals to dist
        const currentDist = Math.abs(move[1] - desX) + Math.abs(move[0] - desY)
        const newDist = Math.abs(board.zeroLoc[1] - desX) + Math.abs(board.zeroLoc[1] - desY)
        return board.manDist - (currentDist - newDist)
    }

    getNextStates(board) {
        // get the next board states but update their manhattan distances as well
        let nextMoves = board.getNextMoves()
        let newBoards = []
        for (let i = 0; i < nextMoves.length; i++) {
            let newBoard = this.move(board, nextMoves[i])
            // newBoard.manDist = this.getNextManDist(board, nextMoves[i])
            newBoards.push(newBoard)
        }
        return newBoards
    }

    solve() {
        this.enqueueFirstBoard()
        if (this.solution != null) {
            return this.solution
        }
        while (!this.queue.empty()) {
            const currBoard = this.queue.pop().data
            // console.log('current board mandist', currBoard.manDist)
            const newBoards = this.getNextStates(currBoard)
            for (let i = 0; i < newBoards.length; i++) {
                let newBoard = newBoards[i]
                if (this.seen[newBoard.state] === undefined) {
                    if (newBoard.isSolved()) {
                        this.solution = newBoard.moves
                        return newBoard.moves
                    }
                    this.seen[newBoard.state] = true
                    // console.log("man dist", newBoard.manDist)
                    this.queue.push(newBoard, newBoard.manhattanDistance())
                }
            }
        }
        console.log('UNSOLVEABLE')
    }
}