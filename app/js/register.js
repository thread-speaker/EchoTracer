import React from "react";
import "./login-styles.css";

var Register = React.createClass({
	render: function() {
		return (
			<div className="registerForm">
				<label htmlFor="username">User Name: </label>
				<input type="text" id="username" /><br />
				<label htmlFor="password">Password: </label>
				<input type="password" id="password" /><br />
				<label htmlFor="password">Password: </label>
				<input type="password" id="password" /><br />
				<button>Get me in!</button>
			</div>
		);
	}
});

export default Register;
