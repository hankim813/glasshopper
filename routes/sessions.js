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

router.route('/fbcallback')
  .post(urlencode, fbAuthCallBack);


// private methods
function fbAuthCallBack (req, res, next) {
  User.findOne({ 'local.email' :  req.body.facebook.email }, function(err, user) {

    // TODO before updating / creating the user maybe check
    // if they have a valid fb token?
    if (user) {
      user.facebook           = req.body.facebook;
      user.profilePhotoUrl    = req.body.profilePhotoUrl;

      user.save(function(err) {
        if (err)
            throw err;
        return res.status(201).json(genToken(user));
      });
    } else {
      var newUser             = new User();

      newUser.facebook        = req.body.facebook;
      newUser.name            = newUser.facebook.name;
      newUser.local.email     = newUser.facebook.email;
      newUser.profilePhotoUrl = req.body.profilePhotoUrl;
      newUser.searchRadius    = 0.25;
      newUser.save(function(err) {
        if (err)
            throw err;
        return res.status(201).json(genToken(newUser));
      });
    }
  });
}


function localAuthCallBack (req, res, next) {
  // define signin or signup local strategy from request path
  var passportStrategy = 'local-' + req.path.slice(1);
  passport.authenticate(passportStrategy, { session: false }, function (err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
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
    user: {email: user.local.email,
           name: user.name,
           id: user.id,
           searchRadius: user.searchRadius || 0.25,
           profilePhotoUrl: user.profilePhotoUrl}
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}


// expose routes to make them available when loading this file
module.exports   = router;
