// express app
var express      = require('express');
var app          = express();

// setup logger for dev env
var logger       = require('morgan');
app.use(logger('dev'));

// load dotenv
var dotenv = require('dotenv');
dotenv.load();

// parse application/json
var bodyParser   = require('body-parser');
app.use(bodyParser.json());

// authentication with passport
var passport     = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());

// database
var mongoose     = require('mongoose');
var database     = require('./config/database');
mongoose.connect(database.url);

// mount express static assets folder
app.use(express.static(__dirname + '/public'));


// setup CORS headers before mounting routes
app.all('/*', [require('./middlewares/setCors')]);

// mount express routes
// allow signin signup without authentication
var sessions     = require('./routes/sessions');
app.use('/api', sessions);

// we process all other requests to /api/ requesting a valid token
app.all('/api/*', [require('./middlewares/validateRequest')]);

var bars         = require('./routes/bars');
app.use('/api/bars', bars);

var reviews         = require('./routes/reviews');
app.use('/api/reviews', reviews);

// error handler if no route matches
require('./config/error-handler')(app);

// make express app available to be launched from another file
module.exports   = app;
