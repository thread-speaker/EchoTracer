var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var Bootstrap = require("react-bootstrap");
var Modal = Bootstrap.Modal;

var api = require("./api.js");
var auth = require("./auth.js");

var Dashboard = React.createClass({
	getInitialState: function() {
		var tagArray = [{
				tagName: "foo",
				tagEntries: [{
					author: "dabok",
					dateCached: "Dec. 7, 2015",
					shortMessage: "Hi!"
				}, {
					author: "p3",
					dateCached: "Dec. 7, 2015",
					shortMessage: "Hello!"					
				}]
			}, {
				tagName: "really long tag name",
				tagEntries: [{
					author: "thread",
					dateCached: "Dec. 7, 2015",
					shortMessage: "I am not such a short message after all!"
				}, {
					author: "longUsername",
					dateCached: "Dec. 7, 2015",
					shortMessage: "I am a short message that should require multiple lines, potentially, I hope. Maybe? Can I trigger some overflow ellipses please?"
				}]
			}, {
				tagName: "smash",
				tagEntries: [{
					author: "dabok",
					dateCached: "Dec. 7, 2015",
					shortMessage: "Hi!"
				}, {
					author: "p3",
					dateCached: "Dec. 7, 2015",
					shortMessage: "Hello!"					
				}]
			}, {
				tagName: "bros",
				tagEntries: [{
					author: "thread",
					dateCached: "Dec. 7, 2015",
					shortMessage: "I am not such a short message after all!"
				}, {
					author: "longUsername",
					dateCached: "Dec. 7, 2015",
					shortMessage: "I am a short message that should require multiple lines, potentially, I hope. Maybe? Can I trigger some overflow ellipses please?"
				}]
			}];

		var expansionStateInit = [];
		for(var i = 0; i < tagArray.length; i++){
			expansionStateInit.push(true);
		}

		return {
			loggedIn: auth.loggedIn(),
			tags: tagArray,
			expansionState: expansionStateInit
		};
	},

	getLocation: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				return {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					coords: position.coords
				};
			}
		}
		return null;
	}

	saveCache: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				//alert(position.coords.latitude + ", " + position.coords.longitude);
				api.getUserProfile(function(status, data) {
					var newCache = {
						lat: position.coords.latitude,
						lon: position.coords.longitude,
						nickname: "",
					};
					var profile = data.profile;
					profile.caches.push(newCache);
					while(profile.caches.length > 5) {
						profile.shift();
					}
					//save profile
					api.updateProfile(profile, function(status, data) {
						if (status) {
							//success
						} else {
							//failure
						}
					});
				});
			});
		}
		else {
			alert("Geolocation lookup failed!");
		}
	},

	raisePriority: function(i) {
		if(i > 0) {
			var newState = this.state;
			var sender = newState.tags[i];
			newState.tags.splice(i, 1);
			newState.tags.splice(i-1, 0, sender);

			var expanded = newState.expansionState[i];
			newState.expansionState.splice(i,1);
			newState.expansionState.splice(i-1, 0, expanded);

			this.setState(newState);
		}
	},

	dropPriority: function(i) {
		if(i < this.state.tags.length) {
			var newState = this.state;
			var sender = newState.tags[i];
			newState.tags.splice(i, 1);
			newState.tags.splice(i+1, 0, sender);

			var expanded = newState.expansionState[i];
			newState.expansionState.splice(i,1);
			newState.expansionState.splice(i+1, 0, expanded);

			this.setState(newState);
		}
	},

	removeTag: function(i) {
		if(confirm("Unregister this tag? (Other users will no longer see your message listed under this tag)")) {
			var newState = this.state;
			newState.tags.splice(i, 1);
			newState.expansionState.splice(i, 1);

			this.setState(newState);
		}
	},

	expandChange: function(i) {
		var newState = this.state;
		newState.expansionState[i] = !newState.expansionState[i];
		this.setState(newState);
	},


  	render: function() {
		var tags = [];
		for(var i = 0; i < this.state.tags.length; i++){
			var priorityChangers = (
					<div key={"prioChange" + i}>
						<div title="Raise priority" className="priorityChange glyphicon glyphicon-chevron-up" onClick={ this.raisePriority.bind(this, i) } key={"chevUp" + i}></div> 
						<div title="Lower priority" className="priorityChange glyphicon glyphicon-chevron-down" onClick={ this.dropPriority.bind(this, i) } key={"chevDown" + i}></div> 
						<div title="Remove tag" className="priorityChange glyphicon glyphicon-remove" onClick={ this.removeTag.bind(this, i) } key={"remove" + i}></div> 
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
							<input type="button" className="cacheButton" onClick={ this.getLocation } value="Cache me here"/>
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
		this.props.onExpandChange(this.props.index);
	},

	render: function() {
		var tagEntries = [];
		for(var i = 0; i < this.props.dataSource.tagEntries.length; i++){
			tagEntries.push(
					<TagEntry key={"tagEntry" + i} dataSource={ this.props.dataSource.tagEntries[i] } />
				);
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
		return (
			<div title="Show Details" className="tagEntry" onClick={this.showDetails}>
				<span className="tagAuthor">@{this.props.dataSource.author}: &nbsp;</span> {this.props.dataSource.shortMessage}
				<br/>
				<Modal show={this.state.showModal} onHide={this.hideDetails}>
					<Modal.Header closeButton>
						<Modal.Title>
							<span className="detailsHeader">Author: </span><span className="detailsAuthor">@{this.props.dataSource.author}</span>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<span className="detailsBody">Message: </span><div className="detailsMessage">{this.props.dataSource.shortMessage}</div>
					</Modal.Body>
					<Modal.Footer>
						<span className="detailsFooter">Date Cached: </span><span className="detailsDate">{this.props.dataSource.dateCached}</span>
						<div className="modalClose" onClick={this.hideDetails}>Close</div>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
});

export default Dashboard;
