import React, { Component } from 'react';
import { render } from 'react-dom';

class Box extends Component {
    constructor(props) {
        super(props)
        let { num } = props
        this.num = num
        this.id = 'b' + toString(num)
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
            <div className={this.id} style={this.BoxStyle}>
                <h1>{this.num}</h1>
            </div>
        )
    }
}


export default Box