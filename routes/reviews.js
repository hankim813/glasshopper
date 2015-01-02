// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });
var passport     = require('passport');

var jwt          = require('jwt-simple');
// setup request module to issue http requests to third party apis
var request    = require('request');

// load the mongoose model
var Bar        = require('../app/models/bar');
var Review     = require('../app/models/review');
var User       = require('../app/models/user');

// New Route to access and create new reviews
router.route('/reviews')
  .get(urlencode, reviewCallback)
  .post(urlencode, createReview);

function reviewCallback (req, res) {
  Review.find(function (err, reviews) {
    if (err) throw err;

    res.json(reviews);
  });
}

// var reviewSchema    = new Schema({
//   _author    : { type: Schema.Types.ObjectId, ref: 'User'},
//   _bar       : { type: Schema.Types.ObjectId, ref: 'Bar'},
//   crowdLevel : { type: Number, min: 1, max: 4 },
//   noiseLevel : { type: Number, min: 1, max: 4 },
//   avgAge     : { type: Number, min: 1, max: 4 },
//   ggRatio    : { type: Number, min: 0, max: 100 },
//   createdAt  : { type: Date, default: Date.now, expires: '30m' }
// });

function createReview (req, res) {
  var review = new Review();
  // review._bar  = res.body.$localStorage
  review.crowdLevel = res.body.crowdLevel;
  review.noiseLevel = res.body.noiseLevel;
  review.avgAge = res.body.avgAge;
  review.ggRatio = res.body.ggRatio;

  console.log('res', res);
  review.save(function(err) {
    console.log(err);
    if (err)
      res.send(err);

    res.json(review);
  });
}

// function localAuthCallBack (req, res, next) {
//   // define signin or signup local strategy from request path
//   var passportStrategy = 'local-' + req.path.slice(1);
//   passport.authenticate(passportStrategy, { session: false }, function (err, user, info) {
//       if (err) {
//         return next(err); // will generate a 500 error
//       }
//       if (!user) {
//         return res.status(400).json(info);
//       }
//       return res.status(201).json(genToken(user));
//     })(req, res, next);
// }

// function genToken(user) {
//   var expires = expiresIn(180); // 180 days
//   var token = jwt.encode({
//     exp: expires, userId: user.id
//   }, process.env.APP_SECRET);

//   return {
//     token: token,
//     expires: expires,
//     user: {email: user.local.email, name: user.name}
//   };
// }

// --------------------------------------------------------

// expose routes to make them available when loading this file
module.exports = router;