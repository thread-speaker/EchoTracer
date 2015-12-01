// setup Express
var app = require('./models/express.js');

// setup mongoose
var mongoose = require('mongoose');
var mongoURI = "mongodb://localhost:27017/profileCacher";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) { 
	console.log(err.message);
 });
MongoDB.once('open', function() {
  console.log("mongodb connection open");
});

// models
var api = require('./models/api.js');
var User = require('./models/user.js');
var Item = require('./models/item.js');

// start the server
var server = app.listen(3000, function () {
  console.log("Started on port 3000");
  var host = server.address().address;
  var port = server.address().port;
});
