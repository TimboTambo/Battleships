import React, { Component } from 'react';
import './App.css';

class Square extends Component {
  render() {
    return (<td x={this.props.x} y={this.props.y} onClick={this.props.onClick.bind(null, this.props.x, this.props.y)}>{this.props.displayText}</td>);
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.gridSize = 10;
    this.state.grid = [];
    let layout = "WSWSSWWWWW";
    let isDisplayedLookup = "FTTFFFFFFTF";
    for (let i = 0; i < this.state.gridSize; i++) {
      let row = [];
      for (let j = 0; j < this.state.gridSize; j++) {
        let isDisplayed = isDisplayedLookup[j] === "T";
        let displayText = isDisplayed ? layout[j] : "?";
        row.push({type: layout[j], displayText: displayText, isDisplayed: isDisplayed});
      }
      this.state.grid.push(row);
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(x, y) {
    let grid = this.state.grid;
    let square = grid[y][x];
    if (square.isDisplayed) {
      return;
    }
    square.displayText = square.displayText === "W" ? "S" : "W";
    this.setState({grid: grid});
  }

  render() {
    return (
      <table>
        <tbody>
            {this.state.grid.map((row, i) => <tr key={i}>{row.map((squareProps, j) => 
            <Square x={j} y={i} displayText={squareProps.displayText} onClick={this.handleClick} key={i + ' ' + j}/>)
            }</tr>)}
        </tbody>
      </table>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-Body">
          <h2>Play Battleships!</h2>
            <Grid />
        </div>
      </div>
    );
  }
}

export default App;
