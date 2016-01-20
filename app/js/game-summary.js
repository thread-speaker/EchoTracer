var React = require('react');
var api = require('./api.js');

import GameMap from './game-map';

var GameSummary = React.createClass({
	getInitialState: function() {
		return {
			// the user is logged in
			loggedIn: auth.loggedIn(),
			game: null,
		};
	},

	componentDidMount: function() {
		var { gameId, ...context } = this.context.router.getCurrentQuery();

		api.getGame(gameId, function(status, game) {
			if (status) {
				this.state.game = game;
				this.setState(this.state);
			}
		}.bind(this));
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
