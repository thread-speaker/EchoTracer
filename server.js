// setup server
var app = require('./platform/express.js');
var api = require('./platform/api');

// start the server
var server = app.listen(3000, function () {
  console.log("Started on port 3000");
  var host = server.address().address;
  var port = server.address().port;
});
