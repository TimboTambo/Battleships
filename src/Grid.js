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
      let layout = this.generateGrid(this.state.gridSize);
      console.log(layout);
      let isDisplayedLookup = this.generateSquaresToShow(layout);
      this.rowCounts = Array(this.state.gridSize).fill(0)
      this.columnCounts = Array(this.state.gridSize).fill(0);
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
                      break;
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
  
    getRandomCoord(max) {
        return [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
    }

    getRandomDirection() {
        let directions = ["down", "across"];
        return directions[Math.round(Math.random())];
    }

    placeShip(grid, shipLength) {
        let coord = this.getRandomCoord(grid.length);
        let direction = this.getRandomDirection();
        let x = coord[0];
        let y = coord[1];

        if (direction === "down") {
            if (y + shipLength > grid.length) {
                return false;
            }
            for (let j = 0; j < shipLength; j++) {
                if (grid[y + j][x] !== "U") {
                    return false;
                }
            }
            for (let xPos = x - 1; xPos <= x + 1; xPos++) {
                if (xPos < 0 || xPos >= grid.length) {
                    continue;
                }
                for (let yPos = y - 1; yPos <= y + shipLength; yPos++) {
                    if (yPos < 0 || yPos >= grid.length) {
                        continue;
                    }
                    grid[yPos][xPos] = "W";
                }
            }

            for (let yPos = y; yPos < y + shipLength; yPos++) {
                if (shipLength === 1) {
                    grid[yPos][x] = "S";
                }
                else if (yPos === y) {
                    grid[yPos][x] = "T";
                }
                else if (yPos === y + shipLength - 1) {
                    grid[yPos][x] = "B";
                }
                else {
                    grid[yPos][x] = "M";
                }
            }
            return true;
        }

        if (x + shipLength > grid.length) {
            return false;
        }
        for (let j = 0; j < shipLength; j++) {
            if (grid[y][x+j] !== "U") {
                return false;
            }
        }
        for (let yPos = y - 1; yPos <= y + 1; yPos++) {
            if (yPos < 0 || yPos >= grid.length) {
                continue;
            }
            for (let xPos = x - 1; xPos <= x + shipLength; xPos++) {
                if (xPos < 0 || xPos >= grid.length) {
                    continue;
                }
                grid[yPos][xPos] = "W";
            }
        }

        for (let xPos = x; xPos < x + shipLength; xPos++) {
            if (shipLength === 1) {
                grid[y][xPos] = "S";
            }
            else if (xPos === x) {
                grid[y][xPos] = "L";
            }
            else if (xPos === x + shipLength - 1) {
                grid[y][xPos] = "R";
            }
            else {
                grid[y][xPos] = "M";
            }
        }

        return true;
    }

    generateGrid(size) {
        var shipsToGenerate = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        var grid = [];
        for (let i = 0; i < size; i++) {
            grid.push(Array(size).fill("U"));
        }

        for (let i = 0; i < shipsToGenerate.length; i++) {
            let shipLength = shipsToGenerate[i];
            let shipPlaced = false;

            while (!shipPlaced) {
                shipPlaced = this.placeShip(grid, shipLength)
            }
        }
        console.log(grid);
        return grid.map(row => row.map(square => square === "U" ? "W" : square));
    }

    generateSquaresToShow(grid) {
        let shipSquaresToShow = 5;
        let nonShipSquaresToShow = 5;

        let showGrid = [];
        for (let i = 0; i < grid.length; i++) {
            showGrid.push(Array(grid.length).fill("F"));
        }

        while (shipSquaresToShow > 0 || nonShipSquaresToShow > 0) {
            let coord = this.getRandomCoord(grid.length);
            let x = coord[0];
            let y = coord[1];
            if (showGrid[y][x] === "T") {
                continue;
            }
            if (grid[y][x] === "W") {
                if (nonShipSquaresToShow > 0) {
                    showGrid[y][x] = "T";
                    nonShipSquaresToShow--;
                }
            }
            else {
                if (shipSquaresToShow > 0) {
                    showGrid[y][x] = "T";
                    shipSquaresToShow--;
                }
            }
        }
        console.log(showGrid);
        return showGrid;
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
        else if (squareToLeft.displayedType === "R" && squareToRight.displayedType === "L") {
            square.setDisplayType("M");
            squareToLeft.setDisplayType("M");
            squareToRight.setDisplayType("M");
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
        else if (squareToTop.displayedType === "B" && squareToBottom.displayedType === "T") {
            square.setDisplayType("M");
            squareToTop.setDisplayType("M");
            squareToBottom.setDisplayType("M");
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
        <div className={this.state.finished ? "success" : ""}>
            <div className="gridTitle">Can you find them all?</div>
            <div className="successMessage">Success! Refresh to see a new puzzle.</div>
            <table className="grid">
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