// setup express Router
var router       = require('express').Router();

// setup express bodyParser middleware
var bodyParser   = require('body-parser');
var urlencode    = bodyParser.urlencoded({ extended: false });
var passport     = require('passport');

var jwt          = require('jwt-simple');

// load the mongoose model
var User         = require('../app/models/user');


router.route('/signup')
  .post(urlencode, localAuthCallBack);

router.route('/signin')
  .post(urlencode, localAuthCallBack);


// private methods
function localAuthCallBack (req, res, next) {
  // define signin or signup local strategy from request path
  var passportStrategy = 'local-' + req.path.slice(1);
  passport.authenticate(passportStrategy, { session: false }, function (err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (! user) {
        return res.status(400).json(info);
      }
      return res.status(201).json(genToken(user));
    })(req, res, next);
}

function genToken(user) {
  var expires = expiresIn(180); // 180 days
  var token = jwt.encode({
    exp: expires, userId: user.id
  }, process.env.APP_SECRET);

  return {
    token: token,
    expires: expires,
    user: {email: user.local.email, name: user.name}
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}


// expose routes to make them available when loading this file
module.exports   = router;
