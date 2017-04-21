var React = require('react');
var ReactDOM = require('react-dom');

require('./style.css');

// Game Variables
var width = 50;
var height = 30;
var totalSquares = width * height;
var generation = 0;

var Board = React.createClass({
    getInitialState: function() {
        return {
            gridWidth: width,
            gridHeight: height,
            game: new Array(totalSquares).fill(false)
        }
    },
    render: function() {
        return(
            <div>
                <h1>Conway's Game of Life</h1>
                <Grid ref="grid" cellArray={this.state.game} toggle={this.toggleCell} update={this.updateCells} />
                <button onClick={this.onNew}>New</button>
                <button onClick={this.onNext}>Next</button>
                <button onClick={this.onStart}>Start</button>
                <button onClick={this.onClear}>Clear</button>
            </div>
        );
    },
    toggleCell: function(index) {
        var cellArray = this.state.game;
        cellArray[index] = !cellArray[index];

        this.setState(
            {game: cellArray}
        )
    },
    updateCells: function(cells) {
        this.setState(
            {game: cells}
        )
    },
    onNew: function() {
        for (var i = 0; i < totalSquares / 3; i++) {
            var rand = Math.floor(Math.random() * totalSquares);
            this.toggleCell(rand);
        }
    },
    onNext: function() {
        generation++;
        this.refs.grid.calculateNextGen();
    },
    onStart: function() {
        this.simId;

        if(!this.simId) {
            this.simId = setInterval(this.onNext, 300);
        } else {
            clearInterval(this.simId);
            this.simId = null;           
        }
    },
    onClear: function() {
        generation = 0;
        this.setState({
            game: new Array(totalSquares).fill(false)
        })
    }
});

var Grid = React.createClass({
    render: function() {
        var _this = this;
        return(
            <div className="grid">
                {_this.props.cellArray.map(function(liveCell, index) {
                    if(liveCell === false){
                        return(
                            <div className="cell" onClick={_this.handleClick.bind(_this, index)} key={index}></div>
                         )
                    } else {
                        return (
                            <div className="cell alive" onClick={_this.handleClick.bind(_this, index)} key={index}></div>
                        )
                    }
            })}
            </div>
        )
    },
    handleClick: function(index) {
        this.props.toggle(index);
    },
    getNeighbors: function(index) {
        var offset = width + 1;
        var offsetArray;

        if (index % width === 0) {
            // left edge
            offsetArray = [-offset+1, -offset+2, 1, offset-1, offset]
        } else if ((index+1) % width === 0){
            // right edge
            offsetArray = [-offset, -offset+1, -1, offset-2, offset-1]
        } else {
            offsetArray = [-offset, -offset+1, -offset+2, -1, 1, offset-2, offset-1, offset]
        }

        var inbound = function(num){                                                                  
            return num >= 0 && num < totalSquares
        }
        var neighbors = offsetArray.map(function(offset) {return index + offset}).filter(inbound);
        
        return neighbors;
    },
    countLiveNeighbors: function(index) {
        var neighbors = this.getNeighbors(index);
        var that = this;
        var neighborsStatus = neighbors.map(function(n) {return that.props.cellArray[n]});
        var liveNeighbors = neighborsStatus.reduce(function(a, b) {
            return a + b;
        }, 0);
        
        return liveNeighbors;
    },
    calculateNextGen: function() {
        var cells = this.props.cellArray;
        var deltas = [];
        var that = this;
        
        cells.forEach(function(cell, index) {
            var liveNeighbors = that.countLiveNeighbors(index);

            if (cell) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    deltas.push(index);
                }
            }

            if(!cell) {
                if (liveNeighbors === 3) {
                    deltas.push(index);
                }
            }
        })

        // update changes
        deltas.forEach(function(idx) {
            cells[idx] = !cells[idx];
        })

        this.props.update(cells);
    },
})

ReactDOM.render(<Board />, document.getElementById('root'));