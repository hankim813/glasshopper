var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/glassHopper_db');

var bars = require('./routes/bars');
app.use('/bars', bars);

module.exports = app;
