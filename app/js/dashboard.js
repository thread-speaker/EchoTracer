var Dashboard = React.createClass({

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
        <h1>Dashboard</h1>
        <div className="save-location">
          <div className="button" onMouseDown={this.getLocation}>Record My Location</div>
          <p id="location-message">Hello World!</p>
        </div>
      </div>
    );
  }
});

export default Dashboard;
