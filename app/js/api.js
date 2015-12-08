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
};

module.exports = api;
