// express app
var express = require('express');
var app = express();

// database
var mongoose   = require('mongoose');
var database = require('./config/database');
mongoose.connect(database.url);

// mount express static assets folder
app.use(express.static(__dirname + '/public'));

// mount express routes
var bars = require('./routes/bars');
app.use('/bars', bars);

// make express app available to be launched from another file
module.exports = app;
