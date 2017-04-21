var React = require('react');
var ReactDOM = require('react-dom');

require('./style.css');

// Game Variables
var width = 10;
var height = 5;
var totalSquares = width * height;

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
                <Grid cellArray={this.state.game} toggle={this.toggleCell}/>
            </div>
        );
    },
    toggleCell: function(index) {
        var cellArray = this.state.game;
        var currentState = cellArray[index];
        cellArray[index] = !currentState;

        this.setState(
            {game: cellArray}
        )
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
        this.countLiveNeighbors(index);
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
    }
})

ReactDOM.render(<Board />, document.getElementById('root'));