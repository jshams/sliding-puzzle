import React from 'react';
import logo from './logo.svg';
import './App.css';
import Box from './Box.js'
import Board from './Board'

function App() {
  return (
    <div className="App">

      <Board
        length={3}
        width={3}
      />

    </div >
  );
}

export default App;
