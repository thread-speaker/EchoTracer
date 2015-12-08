var $ = require("jquery");

// API object
var api = {
  //Get the current user's profile
  getUserProfile: function(cb) {
    // submit request to server
    var url = "/api/profile";
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      headers: {'Authorization': localStorage.token},
      success: function(res) {
        // on success, store a login token
        if (cb)
          cb(true, res);
      }.bind(this),
      error: function(xhr, status, err) {
        // if there is an error, remove any login token
        delete localStorage.token;
        if (cb)
          cb(false, status);
      }.bind(this)
    });
  },

  //Get all the profiles
  getAllProfiles: function(cb) {
    // submit request to server
    var url = "/api/profile/all";
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      headers: {'Authorization': localStorage.token},
      success: function(res) {
        // on success, store a login token
        if (cb)
          cb(true, res);
      }.bind(this),
      error: function(xhr, status, err) {
        // if there is an error, remove any login token
        delete localStorage.token;
        if (cb)
          cb(false, status);
      }.bind(this)
    });
  },

  // update a profile, call the callback when complete
  updateProfile: function(item, cb) {
    var url = "/api/profile/";
    $.ajax({
      url: url,
      contentType: 'application/json',
      data: JSON.stringify({
        profile: {
          username: item.username,
          caches: item.caches,
          tags: item.tags
        }
      }),
      type: 'PUT',
      headers: {'Authorization': localStorage.token},
      success: function(res) {
        if (cb)
          cb(true, res);
      },
      error: function(xhr, status, err) {
        // if there is any error, remove any login token
        delete localStorage.token;
        if (cb)
          cb(false, status);
      }
    });
  },

  distanceBetween: function(lat1, lon1, lat2, lon2) {
    var R = 6371000; // metres
    var phi1 = lat1.toRadians();
    var phi2 = lat2.toRadians();
    var deltaPhi = (lat2-lat1).toRadians();
    var deltaLambda = (lon2-lon1).toRadians();

    var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
  },
};

module.exports = api;
