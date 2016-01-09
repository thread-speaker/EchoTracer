var $ = require("jquery");

// authentication object
var Auth = {
  register: function(email, username, password, cb) {
    // submit request to server, call the callback when complete
    var url = "/api/users/register";

    $.ajax({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: {
        email, email,
        name: username,
        password: password
      },
      // on success, store a login token
      success: function(res) {
        localStorage.token = res.token;
        localStorage.email = res.email;
        localStorage.username = res.username;
        this.onChange(true);
        if (cb)
          cb(true);
      }.bind(this),
      error: function(xhr, status, err) {
        // if there is an error, remove any login token
        delete localStorage.token;
        this.onChange(false);
        if (cb)
          cb(false);
      }.bind(this)
    });
  },
  // login the user
  login: function(email, password, cb) {
    // submit login request to server, call callback when complete
    cb = arguments[arguments.length - 1];
    // check if token in local storage
    if (localStorage.token) {
      this.onChange(true);
      if (cb)
        cb(true);
      return;
    }

    // submit request to server
    var url = "/api/users/login";
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: {
        email: email,
        password: password
      },
      success: function(res) {
        // on success, store a login token
        localStorage.token = res.token;
        localStorage.email = res.email;
        localStorage.username = res.username;
        this.onChange(true);
        if (cb)
          cb(true);
      }.bind(this),
      error: function(xhr, status, err) {
        // if there is an error, remove any login token
        delete localStorage.token;
        this.onChange(false);
        if (cb)
          cb(false);
      }.bind(this)
    });
  },

  // get the token from local storage
  getToken: function() {
    return localStorage.token;
  },

  getUsername: function() {
    return localStorage.username;
  },
  
  // logout the user, call the callback when complete
  logout: function(cb) {
    delete localStorage.token;
    this.onChange(false);
    if (cb) cb();
  },
  
  // check if user is logged in
  loggedIn: function() {
    return !!localStorage.token;
  },

  // default onChange function
  onChange: function() {},
};

module.exports = Auth;
