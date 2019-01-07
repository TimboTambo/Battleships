import React, { Component } from 'react';
import { ShipList } from './ShipList.js';

class Square extends Component {
    render() {
      return (<td className={this.props.styleName + " backgroundImage"} x={this.props.x} y={this.props.y} onClick={this.props.onClick.bind(null, this.props.x, this.props.y)}></td>);
    }
  }

class GridPoint {
    constructor(type, displayedType, isDisplayed) {
        this.type = type;
        this.displayedType = displayedType;
        this.isDisplayed = isDisplayed;
    }

    setDisplayType = (newDisplayType) => this.displayedType = this.isDisplayed ? this.displayedType : newDisplayType;

    setToWater = () => this.setDisplayType("W");
    setToTopOfShip = () => this.setDisplayType("T");
    setToBottomOfShip = () => this.setDisplayType("B");
    setToMiddleOfShip = () => this.setDisplayType("M");
    setToLeftOfShip = () => this.setDisplayType("L");
    setToRightOfShip = () => this.setDisplayType("R");
    setToSingleShip = () => this.setDisplayType("S");
    setToUnknownType = () => this.setDisplayType("Q");

    isSingleShip = () => this.displayedType === "S"; 
    isTopOfShip = () => this.displayedType === "T"; 
    isBottomOfShip = () => this.displayedType === "B"; 
    isMiddleOfShip = () => this.displayedType === "M"; 
    isLeftOfShip = () => this.displayedType === "L"; 
    isRightOfShip = () => this.displayedType === "R"; 
    isWater = () => this.displayedType === "W"; 
    isUnknownType = () => this.displayedType === "Q";
}

export class Grid extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.state.gridSize = 10;
      this.shipList = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

      this.initialiseGrid(this.state.gridSize, this.shipList);

      this.handleClick = this.handleClick.bind(this);
      this.updateSquares = this.updateSquares.bind(this);
    }
  
    initialiseGrid(size, ships) {
      let layout = this.generateShipLayout(size, ships);
      let isDisplayedLookup = this.generateSquaresToShow(layout);
      this.rowCounts = Array(size).fill(0)
      this.columnCounts = Array(size).fill(0);
      let grid = [];
      for (let y = 0; y < size; y++) {
        let row = [];
      
        for (let x = 0; x < size; x++) {
          let isDisplayed = isDisplayedLookup[y][x] === "T";
          let type = layout[y][x];
          let displayedType = isDisplayed ? type : "Q";
        
          row.push(new GridPoint(type, displayedType, isDisplayed));
  
          if (type !== "W") {
            this.rowCounts[y]++;
            this.columnCounts[x]++;
          }
        }
        grid.push(row);
      }
      this.state.grid = grid;
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

    generateShipLayout(size, shipsToGenerate) {
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
        return showGrid;
    }

    updateSquares(x, y) {
      let grid = this.state.grid;
      let square = grid[y][x];
      
      if (square.isDisplayed) {
        return;
      }
      
      let squareToLeft = x > 0 ? grid[y][x-1] : new GridPoint();
      let squareToRight = x < grid.length - 1 ? grid[y][x+1] : new GridPoint();
      let squareToTop = y > 0 ? grid[y-1][x] : new GridPoint();
      let squareToBottom = y < grid.length - 1 ? grid[y+1][x] : new GridPoint();
      
      if (square.isUnknownType()) {
        square.setToWater();
      }
      else if (square.isWater()) {
        if ((squareToLeft.isLeftOfShip() || squareToLeft.isMiddleOfShip()) && (squareToRight.isMiddleOfShip() || squareToRight.isRightOfShip())) {
          square.setToMiddleOfShip();
        }
        else if (squareToLeft.isSingleShip() && squareToRight.isSingleShip()) {
          squareToLeft.setToLeftOfShip();
          squareToRight.setToRightOfShip();
          square.setToMiddleOfShip();
        }
        else if (squareToLeft.isLeftOfShip() || squareToLeft.isMiddleOfShip()) {
          square.setToRightOfShip();
        }
        else if (squareToLeft.isRightOfShip() && squareToRight.isLeftOfShip()) {
            square.setToMiddleOfShip();
            squareToLeft.setToMiddleOfShip();
            squareToRight.setToMiddleOfShip();
        }
        else if (squareToLeft.isRightOfShip()) {
          squareToLeft.setToMiddleOfShip();
          square.setToRightOfShip();
        }
        else if (squareToLeft.isSingleShip()) {
          squareToLeft.setToLeftOfShip();
          square.setToRightOfShip();
        }
        else if (squareToRight.isRightOfShip() || squareToRight.isMiddleOfShip()) {
          square.setToLeftOfShip();
        }
        else if (squareToRight.isLeftOfShip()) {
          squareToRight.setToMiddleOfShip();
          square.setToLeftOfShip();
        }
        else if (squareToRight.isSingleShip()) {
          squareToRight.setToRightOfShip();
          square.setToLeftOfShip();
        }
        else if ((squareToTop.isTopOfShip() || squareToTop.isMiddleOfShip()) && (squareToBottom.isBottomOfShip() || squareToBottom.isMiddleOfShip())) {
          square.setToMiddleOfShip();
        }
        else if (squareToTop.isSingleShip() && squareToBottom.isSingleShip()) {
            squareToTop.setToTopOfShip();
            squareToBottom.setToBottomOfShip();
            square.setToMiddleOfShip();
        }
        else if (squareToTop.isTopOfShip() || squareToTop.isMiddleOfShip()) {
          square.setToBottomOfShip();
        }
        else if (squareToTop.isBottomOfShip() && squareToBottom.isTopOfShip()) {
            square.setToMiddleOfShip();
            squareToTop.setToMiddleOfShip();
            squareToBottom.setToMiddleOfShip();
        }
        else if (squareToTop.isBottomOfShip()) {
          squareToTop.setToMiddleOfShip();
          square.setToBottomOfShip();
        }
        else if (squareToTop.isSingleShip()) {
          squareToTop.setToTopOfShip();
          square.setToBottomOfShip();
        }
        else if (squareToBottom.isBottomOfShip() || squareToBottom.isMiddleOfShip()) {
          square.setToTopOfShip();
        }
        else if (squareToBottom.isTopOfShip()) {
          squareToBottom.setToMiddleOfShip();
          square.setToTopOfShip();
        }
        else if (squareToBottom.isSingleShip()) {
          squareToBottom.setToBottomOfShip();
          square.setToTopOfShip();
        }
        else {
          square.setToSingleShip();
        }
      }
      else {
        square.setToUnknownType();
  
        if (squareToLeft.isMiddleOfShip()) {
          squareToLeft.setToRightOfShip();
        }
        else if (squareToLeft.isLeftOfShip()) {
          squareToLeft.setToSingleShip();
        }
        
        if (squareToRight.isMiddleOfShip()) {
          squareToRight.setToLeftOfShip();
        }
        else if (squareToRight.isRightOfShip()) {
          squareToRight.setToSingleShip();
        }
        
        if (squareToTop.isMiddleOfShip()) {
          squareToTop.setToBottomOfShip();
        }
        else if (squareToTop.isTopOfShip()) {
          squareToTop.setToSingleShip();
        }
      
        if (squareToBottom.isMiddleOfShip()) {
          squareToBottom.setToTopOfShip();
        }
        else if (squareToBottom.isBottomOfShip()){
          squareToBottom.setToSingleShip();
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