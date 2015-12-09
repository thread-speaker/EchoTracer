var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var auth = require("./auth.js");
var api = require("./api.js");
var jquery = require("jquery");

var Tags = React.createClass({
	saveTag: function() {
		var newTag = document.getElementById("newTag").value;
		var newMessage = document.getElementById("newMessage").value;

		//If the new tag was defined
		if (newTag && newMessage && newTag !== "" && newMessage !== "") {
			//If the user has the tag already, don't do anything
			for (var i = 0; i < this.props.list.length; i++) {
				if (newTag.toLowerCase() === this.props.list[i].tag.toLowerCase()) {
					return;
				}
			}

			var tag = {
				tag: newTag,
				message: newMessage,
			};
			this.props.addTag(tag);
		}
	},

	deleteTag: function(index) {
		this.props.deleteTag(index);
	},

	render: function() {
		var that = this;
		var showList = [];
		for (var i = 0; i < this.props.list.length; i++) {
			showList.push(
				<li key={"tagList"+i}>
					<div className="profileTagName">{this.props.list[i].tag}</div>:
					<div className="profileTagMessage">{this.props.list[i].message}</div>
					<div className="deleteTag" onClick={that.deleteTag.bind(this, i)}>X</div>
				</li>);
		}

		return (
		<div className="profileListContainer">
			<h2>Tags</h2>
			<ul className="profileList">
				{showList}
			</ul>
			<div className="profileAddTag">
				<input type="text" id="newTag" placeholder="Tag Name"></input>
				<input type="text" id="newMessage" placeholder="Short Message"></input>
				<div className="profileAddTagButton" onClick={this.saveTag}>Add New Tag</div>
			</div>
		</div>);
	}
});

var Caches = React.createClass({
	deleteCache: function(index) {
		this.props.deleteCache(index);
	},

	render: function() {
		var that = this;
		var showList = [];
		for (var i = 0; i < this.props.list.length; i++) {
			showList.push(
				<li key={"cacheList"+i}>
					<div>
						<span>Nickname: </span>
						<input id={'cache'+i} placeholder={this.props.list[i].nickname || 'nickname'} className="cacheNameInput"></input>
						{this.props.list[i].lat}, 
						{this.props.list[i].lon}
						<div className="deleteCache" onClick={that.deleteCache.bind(this, i)}>X</div>
					</div>
				</li>);
		}

		return (<div className="profileListContainer">
			<h2>Caches</h2>
			<ul className="profileList">
				{showList}
			</ul>
		</div>);
	}
});

var Profile = React.createClass({
	getInitialState: function() {
		return {
			// the user is logged in
			loggedIn: auth.loggedIn(),
			profile: null,
		};
	},

	componentDidMount: function() {
		api.getUserProfile(function(status, data) {
			if (status) {
				this.setState({
					loggedIn: this.state.loggedIn,
					profile: data.profile
				});
			}
		}.bind(this));
	},

	addTag: function(tag) {
		this.state.profile.tags.push(tag);

		this.setState({
			loggedIn: this.state.loggedIn,
			profile: this.state.profile
		});

		api.updateProfile(this.state.profile, function(status, data) {
			if (status) {
				//Saved just dandy
			} else {
				//Couldn't save
			}
		});
	},

	deleteTag: function(index) {
		if (index < this.state.profile.tags.length) {
			var state = this.state
			state.profile.tags.splice(index, 1);

			this.setState(state);
			api.updateProfile(this.state.profile, function(status, data) {
				if (status) {
					//Saved just dandy
				} else {
					//Couldn't save
				}
			});
		}
	},

	deleteCache: function(index) {
		if (index < this.state.profile.caches.length) {
			var state = this.state
			state.profile.caches.splice(index, 1);

			this.setState(state);
			api.updateProfile(this.state.profile, function(status, data) {
				if (status) {
					//Saved just dandy
				} else {
					//Couldn't save
				}
			});
		}
	},

	saveProfile: function() {
		var caches = this.state.profile.caches;
		for (var i = 0; i < caches.length; i++) {
			caches[i].nickname = document.getElementById("cache"+i).value || caches[i].nickname;
		}
		this.state.profile.caches = caches;

		api.updateProfile(this.state.profile, function(status, data) {
			if (status) {
				//Saved just dandy
			} else {
				//Couldn't save
			}
		});
	},

	saveCache: function() {
		if (navigator.geolocation) {
			console.log("hi");
			navigator.geolocation.getCurrentPosition(function(position) {
				//alert(position.coords.latitude + ", " + position.coords.longitude);
				api.getUserProfile(function(status, data) {
					console.log("hi");
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

  	render: function() {
	    return (
	      	<div>
		        {this.state.loggedIn
		            ? 	(<div>
		            		{this.state.profile?
		            			<div>
				       	        	<h1 className="profileHeader">{this.state.profile.username}</h1>
									<Tags list={this.state.profile.tags} addTag={this.addTag} deleteTag={this.deleteTag} />
									<Caches list={this.state.profile.caches} deleteCache={this.deleteCache} />
									<div className="profileButton buttonDefault" onClick={ this.saveCache }>Cache me here</div>
									<div onClick={this.saveProfile} className="profileButton-blue buttonDefault">Save my profile</div>
								</div>
							:
								<p>"loading..."</p>
							}
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
