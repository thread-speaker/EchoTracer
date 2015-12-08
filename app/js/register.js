var React = require("react");
var ReactRouter = require("react-router");
var History = ReactRouter.History;

import "../css/login-styles.css";

var auth = require("./auth.js");


var Register = React.createClass({
	mixins: [ History ],

	// initial state
	getInitialState: function() {
		return {
		  // there was an error registering
		  message: ""
		};
	},

	// handle regiser button submit
	register: function(event) {
		// prevent default browser submit
		event.preventDefault();
		// get data from form
		var username = this.refs.username.value;
		var password = this.refs.password.value;
		var passwordConfirm = this.refs.passwordConfirm.value;
		if (!username || !password || !passwordConfirm) {
			return this.setState({
				message: "Please fill out all fields."
			})
			return;
		} else if (password != passwordConfirm) {
			return this.setState({
				message: "Passwords do not match."
			})
		}

		// register via the API
		auth.register(username, password, function(loggedIn) {
		  // register callback
			if (!loggedIn)
			    return this.setState({
			      message: "Username already in use."
			    });
			else
				this.history.pushState(null, "/dashboard");				
		}.bind(this));
	},

	// show the registration form
	render: function() {
		return (
			<div>
				<h2>Register</h2>
				<form className="registerForm" onSubmit={this.register}>
					<input type="text" placeholder="Username" ref="username" autoFocus={true} /><br/>
					<input type="password" placeholder="Password" ref="password"/><br/>
					<input type="password" placeholder="Confirm Password" ref="passwordConfirm"/><br/>
					<input className="btn btn-warning" type="submit" value="Register" />
					<div className="alert">{this.state.message}</div>
				</form>
			</div>
		);
	}
});

export default Register;
