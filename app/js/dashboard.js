var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var api = require("./api.js");
var auth = require("./auth.js");

var Dashboard = React.createClass({
	getInitialState: function() {
		var tagArray = [{
				tagName: "foo"
			}, {
				tagName: "bar"
			}, {
				tagName: "smash"
			}, {
				tagName: "bros"
			}];
		return {
			loggedIn: auth.loggedIn(),
			tags: tagArray
		};
	},

	getLocation: function() {
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
					console.log(profile);
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
			console.log("raise");
			var sender = this.state.tags[i];
			var newTags = this.state.tags;
			newTags.splice(i, 1);
			newTags.splice(i-1, 0, sender);

			this.setState({
				tags: newTags
			});
		}
	},

	dropPriority: function(i) {
		if(i < this.state.tags.length) {
			console.log("drop");
			var sender = this.state.tags[i];
			var newTags = this.state.tags;
			newTags.splice(i, 1);
			newTags.splice(i+1, 0, sender);

			this.setState({
				tags: newTags
			});
		}
	},

	removeTag: function(i) {
		console.log("remove");
		var sender = this.state.tags[i];
		var newTags = this.state.tags;
		newTags.splice(i, 1);

		this.setState({
			tags: newTags
		});
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
					<Tag dataSource={this.state.tags[i]} key={"tag" + i} priorityChange={priorityChangers} />
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
				    		<Link to="login" className="btn btn-warning">Login</Link> or <Link to="register" className="btn btn-default">Register</Link>
				    	</span>)
				}
			</div>
	    );
	}
});

var Tag = React.createClass({
	getInitialState: function() {
		var tagEntryArray = [{ //placeholder array for layout testing
				shortMessage: "Hi!"
			}, {
				shortMessage: "Hello!"
			}, {
				shortMessage: "I am not such a short message after all!"
			}, {
				shortMessage: "I am a short message that should require multiple lines, potentially, I hope. Maybe? Can I trigger some overflow ellipses please?"
			}];
		return {
			expanded: true,
			tagEntries: tagEntryArray
		};
	},

	toggleExpand: function() {
		this.setState({ expanded: !this.state.expanded});
	},

	render: function() {
		var tagEntries = []
		for(var i = 0; i < this.state.tagEntries.length; i++){
			tagEntries.push(
					<TagEntry key={"tagEntry" + i} dataSource={ this.state.tagEntries[i] } />
				);
		}
		return (
			<div>
				{this.state.expanded
					? (	<div className="expandable" onClick={ this.toggleExpand }>
							<div className="glyphicon glyphicon-minus" ></div>
						</div>
						)
					: (	<div className="expandable" onClick={ this.toggleExpand }>
							<div className="glyphicon glyphicon-plus" ></div>
						</div>
						)
				}
				<div className="tagHeader" onClick={ this.toggleExpand }>{this.props.dataSource.tagName}</div>
				<div className="priorityDiv">
					{this.props.priorityChange}
				</div>
				<br/>
				{this.state.expanded
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
	render: function() {
		return (
			<div className="tagEntry">
				{this.props.dataSource.shortMessage}
				<br/>
			</div>
		)
	}
});

export default Dashboard;
