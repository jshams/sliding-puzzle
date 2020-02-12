import React, { Component } from 'react';
import Box from './Box'

class Board extends Component {
    constructor(props) {
        super(props)
        let { length, width } = props
        this.numRows = length // number of rows
        this.numCols = width // number of columns
        this.blockMatrix = []
        this.state = {
            boardMatrix: []
        }
        this.init()
        this.render()
    }

    init() {
        // creates a shuffled matrix of Box components
        for (let col = 0; col < this.numCols; col++) {
            let newRow = []
            for (let row = 0; row < this.numRows; row++) {
                let newBox = (
                    <Box num={(col * this.numCols) + row} />
                )
                newRow.push(newBox)
            }
            this.blockMatrix.push(newRow)
        }
        this.shuffleBoard()
    }

    shuffleBoard() {
        // shuffle the board
        this.shuffleMatrix(this.blockMatrix)
        // this.setState({
        //     board: this.blockMatrix
        // })
    }

    shuffleMatrix(matrix) {
        let len = matrix.length
        let wid = matrix[0].length
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < wid; j++) {
                let swapRow = Math.floor(Math.random() * len)
                let swapCol = Math.floor(Math.random() * wid)
                let placeHolder = matrix[swapRow][swapCol]
                matrix[swapRow][swapCol] = matrix[i][j]
                matrix[i][j] = placeHolder
            }
        }
    }

    render() {
        return this.blockMatrix
    }
}

// const blockStlye = {
//     .{b1} {
//     grid-area: b1;
//     }
//     .{b2} {
//     grid-area: b2;
//     }
//     .{b3} {
//     grid-area: b3;
//     }
//     .{b4} {
//     grid-area: b4;
//     }

//     .container {
//     display: grid;
//     grid-template-columns: repeat({this.numCols}, 1fr);
//     grid-template-rows: auto;
//     grid-template-areas: 
//         {this.}
//         "header header header header"
//         "main main . sidebar"
//         "footer footer footer footer";
//     }

// };

export default Board