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
        return false
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
