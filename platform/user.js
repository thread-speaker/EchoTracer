// setup json web token
var jwt = require('jsonwebtoken');
var SECRET = 'vXV4I55iTil2lAAypvbdCOXUwhFF682ezlJp2cIq';

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
					var nameRef = new Firebase('https://echotracer.firebaseio.com/users/' + authData.uid + '/username');
					nameRef.once("value", function(data) {
						cb(null, {
							uid: authData.uid,
							email: email,
							username: data.val(),
						});
					});
				}
			}
		});
	},

	// Generate a token for a client
	generateToken: function(email) {
		return jwt.sign({ email: email }, SECRET);
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
			var user;
			userRef.orderByValue().on("value", function(snapshot) {
				snapshot.forEach(function(data) {
					if (!user && data.val().email === decoded.email) {
						user = data.val();
						user.uid = data.key();
						cb(user);
					}
				});
			});
		});
	},
};

module.exports = User;
