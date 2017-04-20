var React = require('react');
var ReactDOM = require('react-dom');

require('./style.css');

var Board = React.createClass({
    render: function() {
        return(
            <div>
                Hello World!
            </div>
        );
    }
});

ReactDOM.render(<Board />, document.getElementById('root'));