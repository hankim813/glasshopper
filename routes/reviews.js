// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

// load the mongoose model
var Review        = require('../app/models/review');

// define routes
router.route('/')
  .post(urlencode, function(req, res) {
    var review = new Review(req.body);    // create a new instance of the Review model

    // save the bar and check for errors
    review.save(function(err) {
      if (err) {
        res.status(400).json(err);
      } else {
        // I must be missing something, it seems the class method
        // doesn't return anything (see comments on the Review model)
        // it works when console logging
        var averages = Review.getReviewsAvg(review);
        res.status(201).json(averages);
      }
    });
  });

// expose routes to make them available when loading this file
module.exports = router;
