import Dashboard from "./dashboard";
import Profile from "./profile";
import Register from "./register";
import Login from "./login";
import Auth from "./auth";

import { IndexRoute } from 'react-router'

var React = require("react");
var ReactDOM = require('react-dom');
var ReactRouter = require("react-router");
var Navbar = require("react-bootstrap").Navbar;
var Nav = require("react-bootstrap").Nav;
var NavItem = require("react-bootstrap").NavItem;
var NavDropdown = require("react-bootstrap").NavDropdown;
var MenuItem = require("react-bootstrap").MenuItem;

var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
var History = ReactRouter.History;

var Router = ReactRouter.Router;


var styles = require("../css/styles.css")
var auth = require("./auth.js");

var App = React.createClass({
  mixins: [ History ],

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

  getLocation: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        alert(position.coords.latitude + ", " + position.coords.longitude);
      });
    }
    else {
      alert("Geolocation lookup failed!");
    }
  },


  render: function() {
    return (
      <div>
        <Navbar inverse role="navigation">
          <Navbar.Header>
            <Navbar.Brand>
                <Link className="navbar-brand" to="/">
                  <span className="logo">
                    <span className="logoInitial">G</span>eo
                    <span className="logoInitial">P</span>ro
                  </span>
                  <span className="logoTrail">
                    [file]
                  </span>
                </Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            {this.state.loggedIn
              ? ( <Nav pullRight>
                    <NavItem>Hello </NavItem>
                    <NavDropdown title={localStorage.username} className="welcomeName" id="basic-nav-dropdown">
                      <MenuItem ><Link to="profile" className="navDropItem">Profile</Link></MenuItem>
                      <MenuItem divider />
                      <MenuItem ><input type="button" onClick={this.getLocation} className="navCacheButton" value="Cache me here" /></MenuItem>
                    </NavDropdown>
                    <NavItem>|</NavItem>
                    <NavItem><a to="dashboard" onClick={this.logout} className="rightNavItem glyphicon glyphicon-log-out"> Logout</a></NavItem>
                  </Nav>)
              : ( <Nav pullRight>
                    <NavItem><Link to="register" className="rightNavItem"><span className="glyphicon glyphicon-user"></span> Sign Up</Link></NavItem>
                    <NavItem><Link to="login" className="rightNavItem"><span className="glyphicon glyphicon-log-in"></span> Login</Link></NavItem>
                  </Nav>)
            }
          </Navbar.Collapse>
        </Navbar>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App}>
          <IndexRoute component={Dashboard} />
          <Route name="profile" path="/profile" component={Profile} />
          <Route name="register" path="/register" component={Register} />
          <Route name="login" path="/login" component={Login} />
          <Route names="dashboard" path="/dashboard" component={Dashboard}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('app-content'));
