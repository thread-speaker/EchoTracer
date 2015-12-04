var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var auth = require("./auth.js");

var Dashboard = React.createClass({
	getInitialState: function() {
		return {
			// the user is logged in
			loggedIn: auth.loggedIn()
		};
	},

	getLocation: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				alert(position.coords.latitude + ", " + position.coords.longitude);
			});
		}
		else {
			alert("Geolocation lookup failed!");
		}
	},

  	render: function() {
	    return (
			<div>
				{this.state.loggedIn
				    ? 	(<span>
					        <h1>Dashboard</h1>
				        	<p> Content goes here? </p>
						<div className="save-location-button">
							<div className="button" onClick={ this.getLocation }>Save This Location</div>
						</div>
					</span>)
				    : 	(<span>
				    		<Link to="login" className="btn btn-warning">Login</Link> or <Link to="register" className="btn btn-default">Register</Link>
				    	</span>)
				}
			</div>
	    );
	}
});

export default Dashboard;
