var express = require('express');
var app = express();

app.use(express.static('app'));

module.exports = app;