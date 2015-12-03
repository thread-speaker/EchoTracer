var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

import "../css/login-styles.css";
var auth = require("./auth.js");

var Login = React.createClass({
	// initial state
	getInitialState: function() {
		return {
			// there was an error on logging in
			error: false
		};
	},

	// handle login button submit
	login: function(event) {
		// prevent default browser submit
		event.preventDefault();
		// get data from form
		var username = this.refs.username.value;
		var password = this.refs.password.value;
		if (!username || !password) {
			return;
		}
		// login via API
		auth.login(username, password, function(loggedIn) {
		// login callback
			if (!loggedIn)
				return this.setState({
					error: true
				});
		}.bind(this));
	},

	// show the login form
	render: function() {
	return (
		<div>
			<h2>Login</h2>
			<form className="loginForm" onSubmit={this.login}>
				<input type="text" placeholder="Username" ref="username" autoFocus={true} /><br/>
				<input type="password" placeholder="Password" ref="password"/><br/>
				<input className="btn btn-warning" type="submit" value="Login" /><br/>
				<Link to="register">-or Register here-</Link>
				{this.state.error ? (
					<div className="alert">Invalid username or password.</div>
				) : null}
			</form>
		</div>
		);
	}
});

export default Login;
