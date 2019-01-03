import React, { Component } from 'react';
import './App.css';

class Square extends Component {
  render() {
    return (<td class={this.props.styleName} x={this.props.x} y={this.props.y} onClick={this.props.onClick.bind(null, this.props.x, this.props.y)}>{this.props.displayText}</td>);
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.gridSize = 10;
    this.state.grid = [];
    let layout = [
      "SWWWWWWWWW",
      "SWWWWWWSSS",
      "WWWWWWWWWW",
      "SWWWSSSSSW",
      "WWSWWWWWWW",
      "WWWWWSWWSW",
      "WWWWWWWWSW",
      "WWWWSSWWSW",
      "WWSWWWWWSW",
      "SWSWSSSWWW"];
    let isDisplayedLookup = [
      "FFFFFFFFFF",
      "TFFFFFFTFT",
      "FFFFFFFFFF",
      "FFFFFFFFFF",
      "FFTFFTFFFF",
      "FFFFTFFFFF",
      "FFFFFFFFFF",
      "FFTFFFFFFF",
      "FFFFFFFTFF",
      "FFTFFFFFTF"];
    this.rowCounts = [0,0,0,0,0,0,0,0,0,0];
    this.columnCounts = [0,0,0,0,0,0,0,0,0,0];
    
    for (let i = 0; i < this.state.gridSize; i++) {
      let row = [];
    
      for (let j = 0; j < this.state.gridSize; j++) {
        let isDisplayed = isDisplayedLookup[i][j] === "T";
        let displayText = isDisplayed ? layout[i][j] : "?";
        let type = layout[i][j];
        row.push({type: type, displayText: displayText, isDisplayed: isDisplayed});

        if (type === "S") {
          this.rowCounts[i]++;
          this.columnCounts[j]++;
        }
      }
      this.state.grid.push(row);
    }

    this.handleClick = this.handleClick.bind(this);
  }

  isGridCorrect(grid) {
    for (var i = 0; i < grid.length; i++) {
      var row = grid[i];
      for (var j = 0; j < grid.length; j++) {
        var point = row[j];
        if (point.displayText !== point.type) {
          return false;
        }
      }
    }
    return true;
  }

  handleClick(x, y) {
    let grid = this.state.grid;
    let square = grid[y][x];
    if (square.isDisplayed) {
      return;
    }
    square.displayText = square.displayText === "W" ? "S" : "W";
    let isFinished = this.isGridCorrect(grid);
    this.setState({grid: grid, finished: isFinished});
  }

  render() {
    return (
      <table class={this.state.finished ? "finished grid" : "grid"}>
        <tbody>
            {this.state.grid.map((row, i) => <tr key={i}>{row.map((squareProps, j) => 
            <Square x={j} y={i} displayText={squareProps.displayText} styleName={squareProps.isDisplayed ? "fixed" : null} onClick={this.handleClick} key={i + ' ' + j}/>
            )}<td class="total">{this.rowCounts[i]}</td></tr>)}
            <tr>
              {this.columnCounts.map((count, n) => <td class="total" key={n}>{count}</td>)}
            </tr>
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
          <div class="grid-container">
            <Grid />
          </div>  
        </div>
      </div>
    );
  }
}

export default App;
