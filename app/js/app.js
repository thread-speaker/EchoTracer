import Dashboard from "./dashboard";
import Profile from "./profile";
import Register from "./register";
import Login from "./login";
import Auth from "./auth";

var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var styles = require("../css/styles.css")
var auth = require("./auth.js");

var App = React.createClass({
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
        <nav className="navbar navbar-inverse" role="navigation">
          <div className="container-fluid">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">Beginning</Link>
              </div>
              <div>
                <ul className="nav navbar-nav">
                  <li><Link to="/dashboard">Dashboard</Link></li>
                </ul>
                {this.state.loggedIn
                  ? (<ul className="nav navbar-nav navbar-right">
                      <li className="welcome">Hello <span className="welcomeName">{localStorage.name}</span>|</li>
                      <li><a href="#" onClick={this.logout} className="glyphicon glyphicon-log-out">Logout</a></li>
                    </ul>)
                  : (<ul className="nav navbar-nav navbar-right">
                      <li><Link to="register"><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
                      <li><Link to="login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                    </ul>)

                }
              </div>
            </div>
        </nav>

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
          <Route name="profile" path="/profile" component={Profile} />
          <Route name="register" path="/register" component={Register} />
          <Route name="login" path="/login" component={Login} />
          <Route path="*" component={Dashboard}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('app-content'));
