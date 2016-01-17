import Dashboard from "./dashboard";
import Profile from "./profile";
import Register from "./register";
import Login from "./login";
import Auth from "./auth";
import GameSummary from "./game-summary";

import { IndexRoute } from 'react-router'

var React = require("react");
var ReactDOM = require('react-dom');
var ReactRouter = require("react-router");
var Bootstrap = require("react-bootstrap");
var Navbar = Bootstrap.Navbar;
var Nav = Bootstrap.Nav;
var NavItem = Bootstrap.NavItem;
var NavDropdown = Bootstrap.NavDropdown;
var MenuItem = Bootstrap.MenuItem;
var RouterBootstrap = require("react-router-bootstrap");
var LinkContainer = RouterBootstrap.LinkContainer;
var MenuItemLink = RouterBootstrap.MenuItemLink;
var NavItemLink = RouterBootstrap.NavItemLink;

var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
var History = ReactRouter.History;

var Router = ReactRouter.Router;


var styles = require("../css/styles.css");
var auth = require("./auth.js");
var api = require("./api.js");

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
    location.reload();
  },

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
                alert("Profile cached at this location");
                location.reload();
                //success
              } else {
                //failure
              }
            }.bind(this));
          }
        }.bind(this));
      }.bind(this));
    }
    else {
      alert("Geolocation lookup failed!");
    }
  },

  render: function() {
    const navbarInstance = (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="dashboard">
          <span className="logoMain">
            <span className="logo">
              <span className="logoInitial">E</span>cho Tracer
            </span>
          </span>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    {this.state.loggedIn ?
    <Navbar.Collapse>
      <Nav>
        <NavItem href="#/dashboard">My games</NavItem>
      </Nav>
      <Nav pullRight>
        <NavItem>Make Echo</NavItem>
        <NavItem href="#/profile">Profile</NavItem>
        <NavItem ><span onClick={this.logout}><span className="glyphicon glyphicon-log-out"></span> Logout</span></NavItem>
      </Nav>
    </Navbar.Collapse>
    :
    <Navbar.Collapse>
      <Nav pullRight>
        <NavItem href="#/register"><span className="glyphicon glyphicon-user"></span> Sign Up</NavItem>
        <NavItem href="#/login" ><span className="glyphicon glyphicon-log-in"></span> Login</NavItem>
      </Nav>
    </Navbar.Collapse>
    }
  </Navbar>
); //More examples at https://react-bootstrap.github.io/components.html#navbars-mobile-friendly

    return (
      <div>
        {navbarInstance}
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
          <Route name="dashboard" path="/dashboard" component={Dashboard}/>
          <Route name="game" path="/game" component={GameSummary}/>
          <Route path="#" component={Login} />
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('app-content'));
