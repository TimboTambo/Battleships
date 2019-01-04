import React, { Component } from 'react';
import './App.css';

class Square extends Component {
  render() {
    return (<td className={this.props.styleName} x={this.props.x} y={this.props.y} onClick={this.props.onClick.bind(null, this.props.x, this.props.y)}></td>);
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.gridSize = 10;
    this.state.grid = [];
    let layout = [
      "TWWWWWWWWW",
      "BWWWWWWLMR",
      "WWWWWWWWWW",
      "SWWWLMMMRW",
      "WWSWWWWWWW",
      "WWWWWSWWTW",
      "WWWWWWWWMW",
      "WWWWLRWWMW",
      "WWTWWWWWBW",
      "SWBWLMRWWW"];
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
        let displayText = isDisplayed ? layout[i][j] : "Q";
        let type = layout[i][j];
        row.push({type: type, displayText: displayText, isDisplayed: isDisplayed});

        if (type !== "W") {
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
    let squareToLeft, squareToRight, squareToTop, squareToBottom;
    if (square.isDisplayed) {
      return;
    }
    
    if (square.displayText === "Q") {
      square.displayText = "W";
    }
    else if (square.displayText === "W") {
      squareToLeft = x > 0 ? grid[y][x-1] : {};
      squareToRight = x < grid.length - 1 ? grid[y][x+1] : {};
      squareToTop = y > 0 ? grid[y-1][x] : {};
      squareToBottom = y < grid.length - 1 ? grid[y+1][x] : {};

      if ((squareToLeft.displayText === "L" || squareToLeft.displayText === "M") && (squareToRight.displayText === "M" || squareToRight.displayText === "R")) {
        square.displayText = "M";
      }
      else if (squareToLeft.displayText === "L" || squareToLeft.displayText === "M") {
        square.displayText = "R";
      }
      else if (squareToLeft.displayText === "R") {
        if (!squareToLeft.isDisplayed) {
          squareToLeft.displayText = "M";
        }
        square.displayText = "R";
      }
      else if (squareToLeft.displayText === "S") {
        if (!squareToLeft.isDisplayed) {
          squareToLeft.displayText = "L";
        }
        square.displayText = "R";
      }
      else if (squareToRight.displayText === "R" || squareToRight.displayText === "M") {
        square.displayText = "L";
      }
      else if (squareToRight.displayText === "L") {
        if (!squareToRight.isDisplayed) {
          squareToRight.displayText = "M";
        }
        square.displayText = "L";
      }
      else if (squareToRight.displayText === "S") {
        if (!squareToRight.isDisplayed) {
          squareToRight.displayText = "R";
        }
        square.displayText = "L";
      }
      else if ((squareToTop.displayText === "T" || squareToTop.displayText === "M") && (squareToBottom.displayText === "B" || squareToBottom.displayText === "M")) {
        square.displayText = "M";
      }
      else if (squareToTop.displayText === "T" || squareToTop.displayText === "M") {
        square.displayText = "B";
      }
      else if (squareToTop.displayText === "B") {
        if (!squareToTop.isDisplayed) {
          squareToTop.displayText = "M";
        }
        square.displayText = "B";
      }
      else if (squareToTop.displayText === "S") {
        if (!squareToTop.isDisplayed) {
          squareToTop.displayText = "T";
        }
        square.displayText = "B";
      }
      else if (squareToBottom.displayText === "B" || squareToBottom.displayText === "M") {
        square.displayText = "T";
      }
      else if (squareToBottom.displayText === "T") {
        if (!squareToBottom.isDisplayed) {
          squareToBottom.displayText = "M";
        }
        square.displayText = "T";
      }
      else if (squareToBottom.displayText === "S") {
        if (!squareToBottom.isDisplayed) {
          squareToBottom.displayText = "B";
        }
        square.displayText = "T";
      }
      else {
        square.displayText = "S";
      }
    }
    else {
      square.displayText = "Q";

      squareToLeft = x > 0 ? grid[y][x-1] : {};
      squareToRight = x < grid.length - 1 ? grid[y][x+1] : {};
      squareToTop = y > 0 ? grid[y-1][x] : {};
      squareToBottom = y < grid.length - 1 ? grid[y+1][x] : {};

      if (!squareToLeft.isDisplayed) {
        if (squareToLeft.displayText === "M") {
          squareToLeft.displayText = "R";
        }
        else if (squareToLeft.displayText === "L") {
          squareToLeft.displayText = "S";
        }
      }
      if (!squareToRight.isDisplayed) {
        if (squareToRight.displayText === "M") {
          squareToRight.displayText = "L";
        }
        else if (squareToRight.displayText === "R") {
          squareToRight.displayText = "S";
        }
      }
      if (!squareToTop.isDisplayed) {
        if (squareToTop.displayText === "M") {
          squareToTop.displayText = "B";
        }
        else if (squareToTop.displayText === "T") {
          squareToTop.displayText = "S";
        }
      }
      if (!squareToBottom.isDisplayed) {
        if (squareToBottom.displayText === "M") {
          squareToBottom.displayText = "T";
        }
        else if (squareToBottom.displayText === "B"){
          squareToBottom.displayText = "S";
        }
      }
    }

    let isFinished = this.isGridCorrect(grid);
    this.setState({grid: grid, finished: isFinished});
  }

  render() {
    return (
      <table className={this.state.finished ? "finished grid" : "grid"}>
        <tbody>
            {this.state.grid.map((row, i) => <tr key={i}>{row.map((squareProps, j) => 
            <Square x={j} y={i} displayText={squareProps.displayText} styleName={squareProps.displayText + (squareProps.isDisplayed ? " fixed" : "")} onClick={this.handleClick} key={i + ' ' + j}/>
            )}<td className="total">{this.rowCounts[i]}</td></tr>)}
            <tr>
              {this.columnCounts.map((count, n) => <td className="total" key={n}>{count}</td>)}
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
          <div className="grid-container">
            <Grid />
          </div>  
        </div>
      </div>
    );
  }
}

export default App;
