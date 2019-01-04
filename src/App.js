import React, { Component } from 'react';
import { Grid } from './Grid.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-Body">
          <div className="AppTitle">
            <h2>Play Battleships!</h2>
          </div>
          <div className="grid-container">
            <Grid />
          </div>  
        </div>
      </div>
    );
  }
}

export default App;
