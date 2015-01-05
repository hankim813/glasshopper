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

    // create a new instance of the Review model
    var review = new Review({ _author: req.body.author,
                              _bar: req.body.bar,
                              crowdLevel: req.body.crowdLevel,
                              noiseLevel: req.body.noiseLevel,
                              avgAge: req.body.avgAge,
                              ggRatio: req.body.ggRatio});

    review.save(function(err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(review);
      }
    });
  });

router.route('/:barId/averages')
  .get(function (req, res) {
    Review.findOne({_bar: req.params.barId},
      function (err, review) {
        if (err)
          return res.send("something went wrong");
        if (review) {
          Review.getReviewsAvg(review).then(
            function (reviews) {
              res.json(reviews);
              },
            function (error) {
              return res.send("something went wrong");
            }
          )
        } else {
          res.json([]);
        }
      }
    )
  })

router.route('/:barId')
  .get(function(req, res) {
    Review.find({_bar: req.params.barId}, function(err, reviews) {
      if (err)
        res.send(err);
      res.json(Review.getReviewsAvg(reviews));
    });
  })

  .put(urlencode, function(req, res) {
    Review.findOne({ _bar: req.params.barId }, function(err, review) {
      if (err) { res.send(err); }

      review.crowdLevel = req.body.crowdLevel;
      review.noiseLevel = req.body.noiseLevel;
      review.avgAge     = req.body.avgAge;
      review.ggRatio    = req.body.ggRatio;

      review.save(function(err) {
        if (err) {
          res.status(400).json(err);
        }else {
          res.status(201).json(review);
        }
      });
    });
  });

// expose routes to make them available when loading this file
module.exports = router;
