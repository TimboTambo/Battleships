import React, { Component } from 'react';
import './App.css';

class SquareClickable extends Component {
  render() {
    return (<td onClick={this.props.onClick}>{this.props.type}</td>);
  }
}

class Square extends Component {
  constructor(props) {
    super(props);
    this.state = { type: "Water"}
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e) {
    this.setState({type: "Ship"});
  }

  render() {
    return <SquareClickable onClick={this.handleClick} type={this.state.type}/>
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.gridSize = 10;
    this.state.grid = [];
    for (let i = 0; i < this.state.gridSize; i++) {
      let row = [];
      for (let j = 0; j < this.state.gridSize; j++) {
        row.push("Water");
      }
      this.state.grid.push(row);
    }
  }

  render() {
    return (
      <table>
        <tbody>
            {this.state.grid.map((row, i) => <tr key={i}>{row.map((squareType, j) => <Square key={i + ' ' + j}/>)}</tr>)}
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
