import React from 'react';

var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var History = ReactRouter.History;

var GameList = React.createClass({
	mixins: [History ],

	viewGame: function(key) {
		alert(key);
		this.history.pushState(null, 'game?uid='+key);
	},

	render: function() {
		const {user, ...props} = this.props;

		var that = this;
		var gameList = [];
		if (user.games) {
			for (var key in user.games) {
				if (user.games.hasOwnProperty(key)) {
					gameList.push(
						<li key={"gameList"+key}>
							<div className="gameListItem"><b>{user.games[key].name}</b>: {user.games[key].userState}
								<div className="button" title="View Game Button" style={{float: 'right'}} onClick={that.viewGame.bind(this, key)}>View Game</div>
							</div>
						</li>
					);
				}
			}
		}

		return(
			<ul className="gameList">
				{gameList}
			</ul>
		);
	}
});

export default GameList;
