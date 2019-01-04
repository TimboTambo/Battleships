import React, { Component } from 'react';

class Ship extends Component {
    constructor(props) {
        super(props);
        this.state = { found: false };
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e) {
        this.setState({found: !this.state.found});
    }

    render() {
        if (this.props.shipLength === 1) {
            return <div onClick={this.handleClick} className={"ship shipSquare backgroundImage S" + (this.state.found ? " found" : "")}><span>✓</span></div>
        }
        
        let shipJsx = [<div className="shipSquare backgroundImage L"><span>✓</span></div>];
        for (let i = 1; i < this.props.shipLength - 1; i++) {
            shipJsx.push(<div className="shipSquare backgroundImage M"><span>✓</span></div>);
        }
        shipJsx.push(<div className="shipSquare backgroundImage R"><span>✓</span></div>);
        return <div onClick={this.handleClick} className={"ship" + (this.state.found ? " found" : "")}>{shipJsx}</div>;
    }
}

class ShipsOfSize extends Component {
    render() {
        let jsx = [];
        for (let i = 0; i < this.props.numberOfShips; i++) {
            jsx.push(<Ship shipLength={this.props.shipLength}/>);
        }
        return <div>{jsx}</div>;
    }
}

export class ShipList extends Component
{
    render() {
        let ships = [];
        let previousLength = 0;
        let numOfShipsOfLength = 0;
        for (let i = 0; i < this.props.list.length; i++) {
            var length = this.props.list[i];
            
            if (length !== previousLength) {
                ships.push(<ShipsOfSize numberOfShips={numOfShipsOfLength} shipLength={previousLength}/>);
                previousLength = length;
                numOfShipsOfLength = 1;
            }
            else {
                numOfShipsOfLength++;
                if (i === this.props.list.length - 1) {
                    ships.push(<ShipsOfSize numberOfShips={numOfShipsOfLength} shipLength={length}/>);
                }
            }
        }
        return (<div className="shipsContainer">
            <h3 className="shipsListHeader">Ships to find</h3>
            <div className="shipsListDescription">
                Click ships you've found to keep track of the ones still missing.
            </div>
            {ships}
        </div>);
    }
}