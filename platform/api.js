var app = require('./express.js');
var User = require('./user.js');

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

/*
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
});*/
