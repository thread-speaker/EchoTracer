// setup json web token
var jwt = require('jsonwebtoken');
var SECRET = '\x1f\x1e1\x8a\x8djO\x9e\xe4\xcb\x9d`\x13\x02\xfb+\xbb\x89q"F\x8a\xe0a';

// setup bcrypt
var bcrypt = require('bcrypt');
var SALT = bcrypt.genSaltSync();

// setup firebase
var Firebase = require('firebase');
var rootRef = new Firebase('https://echotracer.firebaseio.com/');
var userRef = new Firebase('https://echotracer.firebaseio.com/users');

var User = {
	addUser: function(email, username, password, cb) {
		rootRef.createUser({
			email: email,
			password: password,
		}, function(error, userData) {
			if (error) {
				if (cb) {
					cb(error, null);
				}
			} else {
				userRef.child(userData.uid).set({
					email: email,
					username: username,
				});

				if (cb) {
					cb(null, {
						uid: userData.uid,
						email: email,
						username: username,
					});
				}
			}
		});
	},

	loginUser: function(email, password, cb) {
		rootRef.authWithPassword({
			email: email,
			password: password
		}, function(error, authData) {
			if (error) {
				if (cb) {
					cb(error, null);
				}
			} else {
				if (cb) {
					userRef.orderByKey().on("child_added", function(snapshot) {
						console.log(snapshot.key());
					});
					cb(null, authData);
				}
			}
		});
	},

	// Generate a token for a client
	generateToken: function(username) {
		return jwt.sign({ username: username }, SECRET);
	},

	// Verify the token from a client. Call the callback with a user object if successful or null otherwise.
	verifyToken: function(token,cb) {
		if (!token) {
			cb(null);
			return;
		}
		// decrypt the token and verify that the encoded user id is valid
		jwt.verify(token, SECRET, function(err, decoded) {
			if (!decoded) {
				cb(null);
	  			return;
			}
			var found = false;
			userRef.orderByValue().on("value", function(snapshot) {
				snapshot.forEach(function(data) {
					if (!found && data.val() === decoded.username) {
						found = true;
					}
				});
			});
			if (found) {
				cb(user);
			} else {
				cb(null);
			}
		});
	},
};

console.log("hi");

module.exports = User;
