var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var Bootstrap = require("react-bootstrap");
var Modal = Bootstrap.Modal;

var api = require("./api.js");
var auth = require("./auth.js");

var Dashboard = React.createClass({
	getInitialState: function() {
		var loginOK = auth.loggedIn();


		if(loginOK) {
			this.getProximityTags();
		} 

		return {
			loggedIn: loginOK,
			tags: [],
			expansionState: []
		};
	},

	getProximityTags: function() {
		//User's profile for comparisons
		var myProfile = {};
		api.getUserProfile(function(status, data){
			if(status) {
				myProfile = data.profile
				this.getLocation(function(myPos){
					//myTags will be the dataSource of our page.
					//An array of JSON, each object represents a tag.
					//Each object contains an array of all the proximity tags we found.
					var myTags = [];
					for(var i = 0; i < myProfile.tags.length; i++){
						myTags.push({
							tagName: myProfile.tags[i].tag,
							tagEntries: []
						});
					}

					api.getAllProfiles(function(status, data){
						if(status){
							var profiles = data.profiles;
							
							//Find all profiles with a cache in range
							var closeProfiles = [];
							for(var i = 0; i < profiles.length; i++){
								var p = profiles[i];
								if(p.user === myProfile.user)
									continue;
								
								//Iterate over caches backwards to get most recent cache
								for(var j = p.caches.length - 1; j >= 0; j--){ 
									var cache = p.caches[j];
									var lat = parseFloat(cache.lat);
									var lon = parseFloat(cache.lon);
									var myLat = parseFloat(myPos.latitude);
									var myLon = parseFloat(myPos.longitude);

									//5 km placeholder until dynamic radius is implemented
									if(api.distanceBetween(myLat, myLon, lat, lon) <= 5000){
										//Store the profile and the date this cache was placed
										closeProfiles.push({
											profile: p,
											date: cache.placed
										});
										break;
									}
								}
							}

							//Build tags+tagEntries for each closeProfile
							for(var i = 0; i < closeProfiles.length; i++){
								var p = closeProfiles[i];

								for(var j = 0; j < p.profile.tags.length; j++){
									var tagName = p.profile.tags[j].tag;

									var found = -1;
									for (var k = 0; k < myTags.length; k++) {
										if (myTags[k].tagName.toLowerCase() === tagName.toLowerCase()) {
											found = k;
											break;
										}
									}
									
									//Add tagEntry to the myTags dataSource										
									if(found > -1){
										myTags[k].tagEntries.push({
											author: p.profile.username,
											message: p.profile.tags[i].message,
											date: p.date
										})
									}
								}
							}

							//The expansionState controls whether tags are collapsed or not.
							//When children are reordered, the parent still knows which tags to expand.
							var expansionStateInit = [];
							for(var i = 0; i < myTags.length; i++){
								expansionStateInit.push(true);
							}

							this.setState({
								loggedIn: auth.loggedIn(),
								tags: myTags,
								expansionState: expansionStateInit
							})
						}
					}.bind(this));
				}.bind(this));
			}
		}.bind(this));
	},

	getLocation: function(cb) {
		//Returns the user's GPS Latitude/Longitude as /strings/
		if (navigator.geolocation) {
			var result = {};
			navigator.geolocation.getCurrentPosition(function(position) {
				result = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				if (cb) {
					cb(result);
				}
			});
		} else {
			if (cb) {
				cb(null);
			}
		}
	},

	saveCache: function() {
		//A cache will be added to the user's profile for this location
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				api.getUserProfile(function(status, data) {
					var newCache = {
						lat: position.coords.latitude,
						lon: position.coords.longitude,
						nickname: "",
					};
					var profile = data.profile;

					//User can only have 5 caches. Check with user before deleting oldest cache to add this new one.
					if(profile.caches.length < 5 
						|| confirm("You have cached your profile at the maximum number of locations (5). " 
							+ "Caching this location will delete your oldest cache. Proceed?"))
					{
						profile.caches.push(newCache);
						while (profile.caches.length > 5) {
							profile.caches.shift();
						}

						//save profile
						api.updateProfile(profile, function(status, data) {
							if (status) {
								alert("Profile cached at this location")
								//success
							} else {
								//failure
							}
						});
					}
				});
			});
		}
		else {
			alert("Geolocation lookup failed!");
		}
	},

	raisePriority: function(i) {
		//Move tag at index i up on the dashboard permanently
		if(i > 0) {
			var newState = this.state;
			var sender = newState.tags[i];
			newState.tags.splice(i, 1);
			newState.tags.splice(i-1, 0, sender);

			var expanded = newState.expansionState[i];
			newState.expansionState.splice(i,1);
			newState.expansionState.splice(i-1, 0, expanded);

			this.setState(newState);

			//save reorder
			api.getUserProfile(function(status, data) {
				if (status) {
					var profile = data.profile;
					var tag = profile.tags[i];
					profile.tags.splice(i,1);
					profile.tags.splice(i-1, 0, tag);

					//save reorder
					api.updateProfile(profile, function(status, data) {
						if (status) {
							//success
						} else {
							//failure
						}
					});
				}
			});
		}
	},

	dropPriority: function(i) {
		//Lower tag at index i on the dashboard permanently
		if(i < this.state.tags.length) {
			var newState = this.state;
			var sender = newState.tags[i];
			newState.tags.splice(i, 1);
			newState.tags.splice(i+1, 0, sender);

			var expanded = newState.expansionState[i];
			newState.expansionState.splice(i,1);
			newState.expansionState.splice(i+1, 0, expanded);

			this.setState(newState);

			api.getUserProfile(function(status, data) {
				if (status) {
					var profile = data.profile;
					var tag = profile.tags[i];
					profile.tags.splice(i,1);
					profile.tags.splice(i+1, 0, tag);

					//save reorder
					api.updateProfile(profile, function(status, data) {
						if (status) {
							//success
						} else {
							//failure
						}
					});
				}
			});
		}
	},

	removeTag: function(i) {
		//Unregister tag at index i from the user's profile permanently
		if(confirm("Unregister this tag? (Other users will no longer see your message listed under this tag)")) {
			var newState = this.state;
			newState.tags.splice(i, 1);
			newState.expansionState.splice(i, 1);

			this.setState(newState);

			api.getUserProfile(function(status, data) {
				if (status) {
					var profile = data.profile;
					profile.tags.splice(i,1);

					//save reorder
					api.updateProfile(profile, function(status, data) {
						if (status) {
							//success
						} else {
							//failure
						}
					});
				}
			});
		}
	},

	expandChange: function(i) {
		//Each time a tag is collapsed or expanded, call this to track the dashboard's expansion state.
		//This lets the parent component Dashboard remember how to expand tags during reorders.
		var newState = this.state;
		newState.expansionState[i] = !newState.expansionState[i];
		this.setState(newState);
	},


  	render: function() {
  		//For each tag in the myTags proximity tested dataSource, push and databind a group of components
		var tags = [];
		for(var i = 0; i < this.state.tags.length; i++){
			var priorityChangers = (
					<div key={"prioChange" + i}>
						<div title="Raise Priority" className="priorityChange glyphicon glyphicon-chevron-up" onClick={ this.raisePriority.bind(this, i) } key={"chevUp" + i}></div> 
						<div title="Lower Priority" className="priorityChange glyphicon glyphicon-chevron-down" onClick={ this.dropPriority.bind(this, i) } key={"chevDown" + i}></div> 
						<div title="Unregister Tag" className="priorityChange glyphicon glyphicon-remove" onClick={ this.removeTag.bind(this, i) } key={"remove" + i}></div> 
					</div>
				);
			tags.push(
					<Tag dataSource={this.state.tags[i]} key={"tag" + i} expanded={this.state.expansionState[i]} index={i} onExpandChange={ this.expandChange } priorityChange={priorityChangers} />
				);
		}

	    return (
			<div>
				{this.state.loggedIn
				    ? 	(
				    	<span className="dashboardMain">
				    		{tags}
				    		<div className="dividerBar" />
							<input type="button" className="cacheButton" onClick={ this.saveCache } value="Cache me here"/>
						</span>)
				    : 	(<span>
				    		<Link to="login" className="buttonDefault">Login</Link> or <Link to="register" className="buttonAlt">Register</Link>
				    	</span>)
				}
			</div>
	    );
	}
});

var Tag = React.createClass({
	toggleExpand: function() {
		//Parent tracks tag collapsed/expanded state
		this.props.onExpandChange(this.props.index);
	},

	render: function() {
		var tagEntries = [];
		if(this.props.dataSource.tagEntries.length == 0){
			var emptyEntry = {
				author: "N/A",
				message: "No caches found in proximity",
				date: "N/A"
			}
			tagEntries.push(
					<TagEntry key="tagEntryEmpty" dataSource={emptyEntry} />
				)
		}
		else{
			for(var i = 0; i < this.props.dataSource.tagEntries.length; i++){
				tagEntries.push(
						<TagEntry key={"tagEntry" + i} dataSource={ this.props.dataSource.tagEntries[i] } />
					);
			}
		}
		return (
			<div>
				{this.props.expanded
					? (	<div className="expandable" onClick={ this.toggleExpand }>
							<div className="glyphicon glyphicon-minus" ></div>
						</div>
						)
					: (	<div className="expandable" onClick={ this.toggleExpand }>
							<div className="glyphicon glyphicon-plus" ></div>
						</div>
						)
				}
				<div className="tagHeader" onClick={ this.toggleExpand }>#{this.props.dataSource.tagName}</div>
				<div className="priorityDiv">
					{this.props.priorityChange}
				</div>
				<br/>
				{this.props.expanded
					? (	<span>
					 		{tagEntries} 
					 	</span>)
					: null
				}
			</div>
		);
	}
});

var TagEntry = React.createClass({
	getInitialState: function() {
		return {
			showModal: false
		};
	},

	showDetails: function() {
		this.setState({
			showModal: true
		})
	},

	hideDetails: function() {
		this.setState({
			showModal: false
		})
	},

	render: function() {
		var date = new Date(this.props.dataSource.date);
		return (
			<div title="Show Details" className="tagEntry" onClick={this.showDetails}>
				<span className="tagAuthor">@{this.props.dataSource.author}: &nbsp;</span> {this.props.dataSource.message}
				<br/>
				<Modal show={this.state.showModal} onHide={this.hideDetails}>
					<Modal.Header closeButton>
						<Modal.Title>
							<span className="detailsHeader">Author: </span><span className="detailsAuthor">@{this.props.dataSource.author}</span>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<span className="detailsBody">Message: </span><div className="detailsMessage">{this.props.dataSource.message}</div>
					</Modal.Body>
					<Modal.Footer>
						<span className="detailsFooter">Date Cached: </span><span className="detailsDate">{date.getMonth() ? date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() : "N/A"}</span>
						<div className="modalClose" onClick={this.hideDetails}>Close</div>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
});

export default Dashboard;
