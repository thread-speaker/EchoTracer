var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var auth = require("./auth.js");
var api = require("./api.js");

var Tags = React.createClass({
	saveTag: function() {
		var newTag = document.getElementById("newTag").value;
		var newMessage = document.getElementById("newMessage").value;

		if (newTag && newMessage && newTag !== "" && newMessage !== "") {
			var tag = {
				tag: newTag,
				message: newMessage,
			};
			this.props.addTag(tag);
		}
	},

	render: function() {
		var showList = [];
		for (var i = 0; i < this.props.list.length; i++) {
			showList.push(<li key={"tagList"+i}><div>{this.props.list[i].tag}</div><div>{this.props.list[i].message}</div></li>);
		}

		return (<div>
				<ul>
					{showList}
				</ul>
				<div><input type="text" id="newTag" placeholder="Add a new tag"></input><input type="text" id="newMessage"></input><div onClick={this.saveTag}>GO!</div></div>
		</div>);
	}
});

var Caches = React.createClass({
	saveCaches: function() {
		caches = [];
		for (var i = 0; i < this.props.list.length; i++) {
			caches.push({
				lat: this.props.list[i].lat,
				lon: this.props.list[i].lon,
				placed: this.props.list[i].placed,
				nickname: document.getElementById("cache"+i).value
			});
		}
		this.props.saveCaches(caches);
	},

	render: function() {
		var showList = [];
		for (var i = 0; i < this.props.list.length; i++) {
			showList.push(
				<li key={"cacheList"+i}>
					<div>
						{this.props.list[i].lat}, 
						{this.props.list[i].lon}
					</div>
					<div>
						<input id={'cache'+i} placeholder={this.props.list[i].nickname || 'nickname'} onchange={this.saveCaches}></input>
					</div>
				</li>);
		}

		return (<div>
				<ul>
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
				console.log(data);
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
	},

	saveCaches: function(caches) {
		console.log("here");
		this.state.profile.caches = caches;
	},

	saveProfile: function() {
		api.updateProfile(this.state.profile, function(status, data) {
			if (status) {
				//Saved just dandy
			} else {
				//Couldn't save
			}
		});
	},

  	render: function() {
	    return (
	      	<div>
		        {this.state.loggedIn
		            ? 	(<div>
			       	        <h1>Dashboard</h1>
						{this.state.profile?
							<div>
								<Tags list={this.state.profile.tags} addTag={this.addTag} />
								<Caches list={this.state.profile.caches} saveCaches={this.saveCaches} />
								<div onClick={this.saveProfile}>Save</div>
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
