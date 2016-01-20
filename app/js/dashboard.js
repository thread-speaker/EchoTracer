var React = require("react");
var ReactRouter = require("react-router");
var Bootstrap = require("react-bootstrap");
var Link = ReactRouter.Link;
var Modal = Bootstrap.Modal;

import api from "./api";
import auth from "./auth";
import GameList from "./game-list";

var Dashboard = React.createClass({
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
							<GameList user={this.state.profile} />
							<div className="button">game search</div>
							<Link to="create"><div className="button">create game</div></Link>
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

export default Dashboard;
