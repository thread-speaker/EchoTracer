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
			showList.push(<li key={"tagList"+i}><div className="profileTagName">{this.props.list[i].tag}</div>:<div className="profileTagMessage">{this.props.list[i].message}</div></li>);
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
						<input id={'cache'+i} placeholder={this.props.list[i].nickname || 'nickname'}></input>
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

  	render: function() {
	    return (
	      	<div>
		        {this.state.loggedIn
		            ? 	(<div>
		            		{this.state.profile?
				       	        <h1 className="profileHeader">this.state.profile.username</h1>
								<div>
									<Tags list={this.state.profile.tags} addTag={this.addTag} />
									<Caches list={this.state.profile.caches} />
									<div onClick={this.saveProfile} className="profileButton buttonDefault">Save</div>
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
