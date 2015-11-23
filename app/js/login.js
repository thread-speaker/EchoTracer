import React from "react";

var Login = React.createClass({
	render: function() {
		return (
			<div>
				<label htmlFor="username">User Name: </label>
				<input type="text" id="username" /><br />
				<label htmlFor="password">Password: </label>
				<input type="password" id="password" /><br />
				<button>GO!</button>
			</div>
		);
	}
});

export default Login;
