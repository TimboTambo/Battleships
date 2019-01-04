import React, { Component } from 'react';
import { ShipList } from './ShipList.js';

class Square extends Component {
    render() {
      return (<td className={this.props.styleName + " backgroundImage"} x={this.props.x} y={this.props.y} onClick={this.props.onClick.bind(null, this.props.x, this.props.y)}></td>);
    }
  }

export class Grid extends Component {
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
      this.shipList = [];
      for (let y = 0; y < this.state.gridSize; y++) {
        let row = [];
      
        for (let x = 0; x < this.state.gridSize; x++) {
          let isDisplayed = isDisplayedLookup[y][x] === "T";
          let type = layout[y][x];
          let displayedType = isDisplayed ? type : "Q";
        
          row.push({type: type, displayedType: displayedType, isDisplayed: isDisplayed, setDisplayType: function(newDisplayType) {
            this.displayedType = this.isDisplayed ? this.displayedType : newDisplayType;
          }});
  
          if (type === "S") {
              this.shipList.push(1);
          }
          else if (type === "T") {
              for (let n = y + 1; n < this.state.gridSize; n++) {
                  if (layout[n][x] === "B") {
                      this.shipList.push(n - y + 1);
                      break;
                  }
              }
          }
          else if (type === "L") {
              for (let n = x + 1; n < this.state.gridSize; n++) {
                  if (layout[y][n] === "R") {
                      this.shipList.push(n - x + 1);
                  }
              }
          }
          if (type !== "W") {
            this.rowCounts[y]++;
            this.columnCounts[x]++;
          }
        }
        this.state.grid.push(row);
      }
      
      this.shipList = this.shipList.sort((a, b) => b - a);

      this.handleClick = this.handleClick.bind(this);
      this.updateSquares = this.updateSquares.bind(this);
    }
  
    updateSquares(x, y) {
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
        else if (squareToLeft.displayedType === "S" && squareToRight.displayedType === "S") {
          squareToLeft.setDisplayType("L");
          squareToRight.setDisplayType("R");
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
        else if (squareToTop.displayedType === "S" && squareToBottom.displayedType === "S") {
            squareToTop.setDisplayType("T");
            squareToBottom.setDisplayType("B");
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
      this.updateSquares(x, y);
      this.setState({grid: this.state.grid, finished: this.isGridCorrect(this.state.grid)});
    }
  
    render() {
      return (
        <div>
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
            <ShipList list={this.shipList}/>
        </div>
      );
    }
  }