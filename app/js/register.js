import React from "react";
import "../css/login-styles.css";

var Register = React.createClass({

	// initial state
	getInitialState: function() {
		return {
		  // there was an error registering
		  error: false,
		  message: "Invalid username or password."
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
		  return;
		} else if (password != passwordConfirm) {
			return this.setState({
				error: true,
				message: "Passwords do not match."
			})
		}

		// register via the API
		auth.register(username, password, function(loggedIn) {
		  // register callback
		  if (!loggedIn)
		    return this.setState({
		      error: true,
		      message: "Username already in use."
		    });
		}.bind(this));
	},

	// show the registration form
	render: function() {
		return (
			<div>
				<h2>Register</h2>
				<form className="registerForm" onSubmit={this.register}>
					<input type="text" placeholder="Username" ref="username"/><br/>
					<input type="password" placeholder="Password" ref="password"/><br/>
					<input type="password" placeholder="Confirm Password" ref="passwordConfirm"/><br/>
					<input className="btn" type="submit" value="Register" />
					{this.state.error 
						? (<div className="alert">{this.state.message}</div>)
						: null 
					}
				</form>
			</div>
		);
	}
});

export default Register;
