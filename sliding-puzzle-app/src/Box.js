import React, { Component } from 'react';
import { render } from 'react-dom';

class Box extends Component {
    constructor(props) {
        super(props)
        let { num, onClick, X, Y } = props
        this.num = num != 0 ? num : null
        this.x = X
        this.y = Y
        this.BoxStyle = {
            border: 'solid',
            margin: '10px',
            width: '300px',
            height: '300px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '100px'
        }
    }

    render() {
        return (
            <button className="box" className={props.num} style={this.BoxStyle} onClick={props.onClick} >
                <h1>{props.num}</h1>
            </button >
        )
    }
}


export default Box