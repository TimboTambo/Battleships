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
        let displayedType = isDisplayed ? layout[i][j] : "Q";
        let type = layout[i][j];
        row.push({type: type, displayedType: displayedType, isDisplayed: isDisplayed, setDisplayType: function(newDisplayType) {
          this.displayedType = this.isDisplayed ? this.displayedType : newDisplayType;
        }});

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
        if (point.displayedType !== point.type) {
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
    
    let squareToLeft = x > 0 ? grid[y][x-1] : {};
    let squareToRight = x < grid.length - 1 ? grid[y][x+1] : {};
    let squareToTop = y > 0 ? grid[y-1][x] : {};
    let squareToBottom = y < grid.length - 1 ? grid[y+1][x] : {};
    
    if (square.displayedType === "Q") {
      square.setDisplayType("W");
    }
    else if (square.displayedType === "W") {
      squareToLeft = x > 0 ? grid[y][x-1] : {};
      squareToRight = x < grid.length - 1 ? grid[y][x+1] : {};
      squareToTop = y > 0 ? grid[y-1][x] : {};
      squareToBottom = y < grid.length - 1 ? grid[y+1][x] : {};

      if ((squareToLeft.displayedType === "L" || squareToLeft.displayedType === "M") && (squareToRight.displayedType === "M" || squareToRight.displayedType === "R")) {
        square.setDisplayType("M");
      }
      else if (squareToLeft.displayedType === "L" || squareToLeft.displayedType === "M") {
        square.setDisplayType("R");
      }
      else if (squareToLeft.displayedType === "R") {
        squareToLeft.setDisplayType("M");
        square.setDisplayType("R");
      }
      else if (squareToLeft.displayedType === "S") {
        squareToLeft.setDisplayType("L");
        square.setDisplayType("R");
      }
      else if (squareToRight.displayedType === "R" || squareToRight.displayedType === "M") {
        square.setDisplayType("L");
      }
      else if (squareToRight.displayedType === "L") {
        squareToRight.setDisplayType("M");
        square.setDisplayType("L");
      }
      else if (squareToRight.displayedType === "S") {
        squareToRight.setDisplayType("R");
        square.setDisplayType("L");
      }
      else if ((squareToTop.displayedType === "T" || squareToTop.displayedType === "M") && (squareToBottom.displayedType === "B" || squareToBottom.displayedType === "M")) {
        square.setDisplayType("M");
      }
      else if (squareToTop.displayedType === "T" || squareToTop.displayedType === "M") {
        square.setDisplayType("B");
      }
      else if (squareToTop.displayedType === "B") {
        squareToTop.setDisplayType("M");
        square.setDisplayType("B");
      }
      else if (squareToTop.displayedType === "S") {
        squareToTop.setDisplayType("T");
        square.setDisplayType("B");
      }
      else if (squareToBottom.displayedType === "B" || squareToBottom.displayedType === "M") {
        square.setDisplayType("T");
      }
      else if (squareToBottom.displayedType === "T") {
        squareToBottom.setDisplayType("M");
        square.setDisplayType("T");
      }
      else if (squareToBottom.displayedType === "S") {
        squareToBottom.setDisplayType("B");
        square.setDisplayType("T");
      }
      else {
        square.setDisplayType("S");
      }
    }
    else {
      square.setDisplayType("Q");

      if (squareToLeft.displayedType === "M") {
        squareToLeft.setDisplayType("R");
      }
      else if (squareToLeft.displayedType === "L") {
        squareToLeft.setDisplayType("S");
      }
      
      if (squareToRight.displayedType === "M") {
        squareToRight.setDisplayType("L");
      }
      else if (squareToRight.displayedType === "R") {
        squareToRight.setDisplayType("S");
      }
      
      if (squareToTop.displayedType === "M") {
        squareToTop.setDisplayType("B");
      }
      else if (squareToTop.displayedType === "T") {
        squareToTop.setDisplayType("S");
      }
    
      if (squareToBottom.displayedType === "M") {
        squareToBottom.setDisplayType("T");
      }
      else if (squareToBottom.displayedType === "B"){
        squareToBottom.setDisplayType("S");
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
            <Square x={j} y={i} displayedType={squareProps.displayedType} styleName={squareProps.isDisplayed ? squareProps.type + " fixed" : squareProps.displayedType} onClick={this.handleClick} key={i + ' ' + j}/>
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
