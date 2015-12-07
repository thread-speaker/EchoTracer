var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var auth = require("./auth.js");

var Profile = React.createClass({
	getInitialState: function() {
		return {
			// the user is logged in
			loggedIn: auth.loggedIn(),
			profile: auth.getUserProfile()
		};
	},

  	render: function() {
	    return (
	      	<div>
		        {this.state.loggedIn
		            ? 	(<div>
			       	        <h1>Dashboard</h1>
					        <p> Content goes here? </p>
						<p>{profile}</p>
						</div>)
				    : 	(<span>
				    		<Link to="login" className="btn btn-warning">Login</Link> or <Link to="register" className="btn btn-default">Register</Link>
				    	</span>)
		        }
		    </div>
	    );
  	}
});

export default Profile;
