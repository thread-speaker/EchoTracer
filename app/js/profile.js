var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var jquery = require("jquery");

var auth = require("./auth.js");
var api = require("./api.js");

import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';

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
				this.setState({
					loggedIn: this.state.loggedIn,
					profile: user
				});
			}
		}.bind(this));
	},

	onMapCreated(map) {
		map.setOptions({
			disableDefaultUI: true
		});
	},

	getLocation: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
		} else { 
			alert("Geolocation is not supported by this browser.");
		}
	},

	showPosition: function(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		alert("you are at: " + lat + ", " + lon);
	},

	showError: function(error) {
		alert(error.code);
	},

	render: function() {
		var coords = {
			lat: 51.5258541,
			lng: -0.08040660000006028,
		};

		return (
			<div>
				{this.state.loggedIn ?
					(<div>
						{this.state.profile?
							<div>
								<div className="profileUser">
								<h1 className="profileHeader">{this.state.profile.username}</h1>
								<div className="photoLarge"></div></div>
								<Gmaps width={'50rem'} height={'35rem'} lat={coords.lat} lng={coords.lng} zoom={12} loadingMessage={'Loading Echoes...'}>
									<Marker
										lat={coords.lat}
										lng={coords.lng}
										draggable={false} />
									<InfoWindow
										lat={coords.lat}
										lng={coords.lng}
										content={'Hello, React :)'} />
									<Circle
										lat={coords.lat}
										lng={coords.lng}
										radius={1} />
								</Gmaps>
								<div>Leave echo here</div>
								<p>Friends?</p>
							</div>
						:
							<p>"loading..."</p>
						}
					</div>)
					: 
					(<span>
						<Link to="login" className="btn btn-warning">Login</Link> or <Link to="register" className="btn btn-default">Register</Link>
					</span>)
				}
			</div>
		);
	}
});

export default Profile;
