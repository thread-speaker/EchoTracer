import React from 'react';
import {Gmaps, Marker} from 'react-gmaps';

var GameMap = React.createClass({
	getInitialState: function() {
		return {
			coords: null,
			error: null,
		};
	},

	componentDidMount: function() {
		var showPosition = function(position) {
			this.state.coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			};
			this.setState(this.state);
		}.bind(this);

		var showError = function(error) {
			this.state.error = "Location serivices must be enabled in order to participate in any games.";
			this.setState(this.state);
		}.bind(this);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			this.state.error = "Location serivices are not supported by your browser.";
			this.setState(this.state);
		}
	},

	onMapCreated: function(map) {
		map.setOptions({
			disableDefaultUI: true
		});
	},

	render: function() {
		const {children, ...props} = this.props;

		return (<div>
			{this.state.coords ?
				<div className="mapDisplay">
					<Gmaps width={'100%'} height={'100%'} lat={this.state.coords.lat} lng={this.state.coords.lng} zoom={18} loadingMessage={'Loading Echoes...'}>
						<Marker
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							draggable={false} />
						{children}
					</Gmaps>
					<div className="button echoBtn">Leave echo here</div>
				</div>
			:
				<div className="error">
					{this.state.error}
				</div>
			}
		</div>);
	}
});
/**
example ofsoem possible children
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';

<Marker
	lat={this.state.coords.lat}
	lng={this.state.coords.lng}
	draggable={false} />
<InfoWindow
	lat={this.state.coords.lat}
	lng={this.state.coords.lng}
	content={'Hello, React :)'} />
<Circle
	lat={this.state.coords.lat}
	lng={this.state.coords.lng}
	radius={1} />
**/

export default GameMap;