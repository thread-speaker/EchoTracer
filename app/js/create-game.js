var React = require("react");
var ReactDOM = require('react-dom');
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

import api from "./api";
import auth from "./auth";

var CreateGame = React.createClass({
	getInitialState: function() {
		return {
			// the user is logged in
			loggedIn: auth.loggedIn(),
			profile: null,
		};
	},

	componentDidMount: function() {
		api.getUserProfile(function(status, user) {
			if (status) {
				this.state.profile = user;
				this.setState(this.state);
			}
		}.bind(this));
	},

	create: function() {
		var game = {
			name: this.myGameName.getDOMNode().value
		};

		api.createGame(game, function(status, data) {
			//Redirect to the game page?
		});
	},

  	render: function() {
		if (this.state.loggedIn) {
			return (
				<div>
					<p>Game Name: <input id="name" type="text" ref={(ref) => this.myGameName = ref} /></p>
					<div className="button" title="Create Game Button" style={{float: 'right'}} onClick={this.create}>Create It!</div>
				</div>
			);
		}
		else {
			return (
				<div>
					<Link to="login" className="btn btn-warning">Login</Link> or <Link to="register" className="btn btn-default">Register</Link>
				</div>
			);
		}
	}
});

export default CreateGame;