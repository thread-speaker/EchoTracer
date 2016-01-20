var User = require('./user');

// setup firebase
var Firebase = require('firebase');
var gameURI = 'https://echotracer.firebaseio.com/games/';
var gameRef = new Firebase(gameURI);

var Game = {
	find: function(uid, cb) {
		var found = false;
		gameRef.child(uid).once("value", function(data) {
			found = true;
			if (cb) {
				var result = data.val();
				result.uid = data.key();
				cb (null, result);
				return;
			}
		});
		if (!found){
			if (cb) {
				cb("Something's wrong!", null);
			}
		}
	},

	create: function(game, cb) {
		//create game
		var created = gameRef.push(game);
		gameRef.child(created.key()).child("uid").set(created.key());

		//connect foreign keys
		if (game.creator) {
			User.find(game.creator, function(err, data) {
				if (!err) {
					data.ownedGames = data.ownedGames || [];
					data.ownedGames.push({uid: created.key(), name: game.name});

					User.update(data);
				}
			});
		}
		if (cb) {
			cb(null, true);
		}
	},
};

module.exports = Game;
