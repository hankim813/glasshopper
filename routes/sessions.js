// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser   = require('body-parser');
var urlencode    = bodyParser.urlencoded({ extended: false });
var passport = require('passport');

// load the mongoose model
var User        = require('../app/models/user');

// define routes
router.route('/logout')
  .get(function(req, res){
      req.logout();
      res.sendStatus(204);
  });

router.route('/signup')
  .post(urlencode, function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (! user) {
        return res.status(400).json(info);
      }
      return res.status(201).json(user);
    })(req, res, next);
  });

// expose routes to make them available when loading this file
module.exports = router;
