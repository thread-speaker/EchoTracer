var app = require('./express.js');
var User = require('./user.js');
var Game = require('./game.js');

// setup body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//
// API
//

// register a user
app.post('/api/users/register', function (req, res) {
	User.addUser(req.body.email, req.body.name, req.body.password, function(err, user) {
		if (err) {
			res.sendStatus('403');
		}
		// create a token
		var token = User.generateToken(req.body.email);
		// return value is JSON containing the user's name and token
		res.json({email: req.body.email, username: req.body.name, token: token});
	});
});

// login a user
app.post('/api/users/login', function (req, res) {
	User.loginUser(req.body.email, req.body.password, function(err, auth) {
		if (err) {
			res.sendStatus('403');
		}
		// create a token
		var token = User.generateToken(req.body.email);
		// return value is JSON containing the user's name and token
		res.json({
			email: auth.email,
			username: auth.username,
			token: token
		});
	});
});

// get the profile for the user
app.get('/api/profile', function (req,res) {
	// validate the supplied token
	User.verifyToken(req.headers.authorization, function(user) {
		if (user) {
			// if the token is valid, find the user's profile and return it
			res.json(user);
		} else {
			res.sendStatus(403);
		}
	});
});

// get a game
app.get('/api/game/:uid', function (req,res) {
  // validate the supplied token
  User.verifyToken(req.headers.authorization, function(user) {
    if (user) {
      // if the token is valid, then find the requested profile
      Game.find(uid, function(err, game) {
      	if (err) {
      	  res.sendStatus(403);
      	  return;
      	}
        // TODO: get the game if the user is a player in it, or is the owner
        if (false) {
          res.sendStatus(403);
          return;
        }

        //If the user isn't the owner, hide some information
        if (user.uid != game.creator) {
          game.joinCode = null;
          game.created = null;
        }
        res.json({game:game});
      });
    } else {
      res.sendStatus(403);
    }
  });
});

app.post('/api/game', function (req, res) {
  User.verifyToken(req.headers.authorization, function (user) {
    if (user) {
      var newGame = req.body.game;
      newGame.joinCode = randomString(4);
      newGame.creator = user.uid;
      newGame.created = Date.now();
      newGame.state = "Waiting";
      Game.create(newGame, function (err, created) {
        if (err) {
          res.sendStatus(403);
        }
        else {
          res.json({saved:true, created:created});
        }
      });
    }
    else {
      res.sendStatus(403);
    }
  });
});
/*
// get all profiles, for searching
app.get('/api/profile/all', function (req,res) {
  // validate the supplied token
  user = User.verifyToken(req.headers.authorization, function(user) {
    if (user) {
      // if the token is valid, then find the requested profile
      Profile.find(function(err, profiles) {
	if (err) {
	  res.sendStatus(403);
	  return;
	}
        // return value is the profile as JSON
        res.json({profiles:profiles});
      });
    } else {
      res.sendStatus(403);
    }
  });
});

// update a profile
app.put('/api/profile', function (req,res) {
  // validate the supplied token
  user = User.verifyToken(req.headers.authorization, function(user) {
    if (user) {
      // if the token is valid, then find the requested profile
      Profile.find({user:user.id}, function(err,profiles) {
	if (err) {
	  res.sendStatus(403);
	  return;
	}
	if (profiles.length > 0) {
	  foundProfile = profiles[0];
          foundProfile.caches = req.body.profile.caches;
          foundProfile.tags = req.body.profile.tags;
          foundProfile.save(function(err) {
            if (err) {
              res.sendStatus(403);
              return;
            }
            // return value is the profile as JSON
            res.json({profile:foundProfile});
          });
        }
      });
    } else {
      res.sendStatus(403);
    }
  });
});*/

const chars = "346789ABCDEFGHJMNPQRTUVWXY";
function randomString(length) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}