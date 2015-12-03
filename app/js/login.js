import React from "react";
import "../css/login-styles.css";
var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var Login = React.createClass({
	render: function() {
		return (
			<div className="loginForm">
				<label htmlFor="username">User Name: </label>
				<input type="text" id="username" /><br />
				<label htmlFor="password">Password: </label>
				<input type="password" id="password" /><br />
				<button>GO!</button><br />
				<Link to="register">Don't have an account? Register here!</Link>
			</div>
		);
	}
});

export default Login;
