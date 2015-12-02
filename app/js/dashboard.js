import Auth from "./auth";

var auth = require("./auth.js");

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      // the user is logged in
      loggedIn: auth.loggedIn()
    };
  },

  // callback when user is logged in
  setStateOnAuth: function(loggedIn) {
    this.setState({loggedIn:loggedIn});
  },

  // when the component loads, setup the callback
  componentWillMount: function() {
    auth.onChange = this.setStateOnAuth;
  },

  // logout the user and redirect to home page
  logout: function(event) {
    auth.logout();
    this.history.pushState(null, '/');
  },

  render: function() {
    return (
      <div>
        {this.state.loggedIn
          ? (<span>
              <h1>Dashboard</h1>
              <p> Content goes here? </p>
            </span>)
          : <p> Not Logged In!</p>
        }
      </div>
    );
  }
});

export default Dashboard;
