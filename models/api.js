var app = require('./express.js');
var User = require('./user.js');
var Profile = require('./profile.js');

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
  // find or create the user with the given username
  User.findOrCreate({username: req.body.username}, function(err, user, created) {
    if (created) {
      // if this username is not taken, then create a user record
      user.name = req.body.name;
      user.set_password(req.body.password);
      user.save(function(err) {
	if (err) {
	  res.sendStatus("403");
	  return;
	}
	Profile.create({username:req.body.username,caches:[],tags:[],user:user.id}, function(err,profile) {
		if (err) {
			res.sendStatus(403);
			return;
		}
	});
        // create a token
	var token = User.generateToken(user.username);
        // return value is JSON containing the user's name and token
        res.json({username: user.username, token: token});
      });
    } else {
      // return an error if the username is taken
      res.sendStatus("403");
    }
  });
});

// login a user
app.post('/api/users/login', function (req, res) {
  // find the user with the given username
  User.findOne({username: req.body.username}, function(err,user) {
    if (err) {
      res.sendStatus(403);
      return;
    }
    // validate the user exists and the password is correct
    if (user && user.checkPassword(req.body.password)) {
      // create a token
      var token = User.generateToken(user.username);
      // return value is JSON containing user's name and token
      res.json({username: user.username, token: token});
    } else {
      res.sendStatus(403);
    }
  });
});

// get the profile for the user
app.get('/api/profile', function (req,res) {
  // validate the supplied token
  user = User.verifyToken(req.headers.authorization, function(user) {
    if (user) {
      // if the token is valid, find the user's profile and return it
      Profile.find({user:user.id}, function(err, profiles) {
	if (err) {
	  res.sendStatus(403);
	  return;
	}
	if (profiles.length > 0) {
          // return value is the list of user's profiles. They only have one, and this code could be streamlined...
          res.json({profile: profiles[0]});
        }
      });
    } else {
      res.sendStatus(403);
    }
  });
});

// get a profile
app.get('/api/profile/user/:user_id', function (req,res) {
  // validate the supplied token
  user = User.verifyToken(req.headers.authorization, function(user) {
    if (user) {
      // if the token is valid, then find the requested profile
      Profile.find({user:user_id}, function(err, profile) {
	if (err) {
	  res.sendStatus(403);
	  return;
	}
        // get the profile if it belongs to the user, otherwise return an error
        if (profile.user != user) {
          res.sendStatus(403);
	  return;
        }
        // return value is the profile as JSON
        res.json({profile:profile});
      });
    } else {
      res.sendStatus(403);
    }
  });
});

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
});
