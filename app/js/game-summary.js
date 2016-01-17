var React = require('react');
var auth = require('./auth.js');
var api = require('./api.js');

import GameMap from './game-map';

var GameSummary = React.createClass({
	getInitialState: function() {
		var { game, ...context } = this.context.router.getCurrentQuery();
		return {
			ready: true,
		};
	},

	render: function() {
		return (
			<div className='mapDisplay'>
				<GameMap/>
			</div>
		);
	}
});

export default GameSummary;
