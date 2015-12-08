import Dashboard from "./dashboard";
import Profile from "./profile";
import Register from "./register";
import Login from "./login";
import Auth from "./auth";

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
    location.reload();
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
              <LinkContainer to="dashboard">          
                <span className="logoMain">
                  <span className="logo">
                    <span className="logoInitial">G</span>eo
                    <span className="logoInitial">P</span>ro
                  </span>
                  <span className="logoTrail">
                    [file]
                  </span>
                </span>
              </LinkContainer>
            </Navbar.Brand>
        </Navbar.Header>
          <Navbar.Collapse>
            {this.state.loggedIn
              ? ( <Nav pullRight>
                    <NavItem>Hello </NavItem>
                    <NavDropdown title={localStorage.username} className="welcomeName" id="basic-nav-dropdown">
                      <LinkContainer to="profile">
                        <MenuItem id="navProfileItem" to="profile" className="navDropItem">Profile</MenuItem>
                      </LinkContainer>
                      <MenuItem divider />
                      <MenuItem ><input type="button" onClick={this.getLocation} className="navCacheButton" value="Cache me here" /></MenuItem>
                    </NavDropdown>
                    <NavItem disabled>|</NavItem>                    
                    <NavItem ><span onClick={this.logout}><span className="glyphicon glyphicon-log-out"></span> Logout</span></NavItem>
                  </Nav>)
              : ( <Nav pullRight>
                    <LinkContainer to="register">
                      <NavItem ><span className="glyphicon glyphicon-user"></span> Sign Up</NavItem>
                    </LinkContainer>
                    <LinkContainer to="login">
                      <NavItem ><span className="glyphicon glyphicon-log-in"></span> Login</NavItem>
                    </LinkContainer>
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
