import Home from "./home";
import Page from "./page";
import Login from "./login";

var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var App = React.createClass({
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
                  <li><Link to="page">Page</Link></li>

                </ul><ul className="nav navbar-nav navbar-right">
                  <li><Link to="#"><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
                  <li><Link to="login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
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
          <Route name="page" path="/page" component={Page} />
          <Route name="login" path="/login" component={Login} />
          <Route path="*" component={Home}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('app-content'));
