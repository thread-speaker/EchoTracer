var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var jquery = require("jquery");

var auth = require("./auth.js");
var api = require("./api.js");

import GameMap from './game-map';
import GameList from './game-list';

var Profile = React.createClass({
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

	render: function() {
		if (this.state.loggedIn) {
			return (
				<div>
					{this.state.profile?
						<div>
							<div className="profileUser">
								<h1 className="profileHeader">{this.state.profile.username}</h1>
							</div>
							<div className="mapDisplay">
								<GameMap />
							</div>
							<GameList user={this.state.profile} />
						</div>
					:
						<p>"loading..."</p>
					}
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

export default Profile;
