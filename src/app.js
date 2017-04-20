var React = require('react');
var ReactDOM = require('react-dom');

require('./style.css');

// Game Variables
var width = 50;
var height = 30;


var Board = React.createClass({
    getInitialState: function() {
        return {
            gridWidth: width,
            gridHeight: height,
            game: new Array(width * height).fill(false)
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
                {_this.props.cellArray.map(function(cellState, index) {
                    if(cellState === false){
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
        console.log(index)
        this.props.toggle(index);
    }
})

ReactDOM.render(<Board />, document.getElementById('root'));