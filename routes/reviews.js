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

    console.log(JSON.stringify(req.body));

    // create a new instance of the Review model
    var review = new Review({ _author: req.body.author,
                              _bar: req.body.bar,
                              crowdLevel: req.body.crowdLevel,
                              noiseLevel: req.body.noiseLevel,
                              avgAge: req.body.avgAge,
                              ggRatio: req.body.ggRatio});
    // Review.model('review')

    // var now = new Date();
    // var timeSpan = 600; //600 seconds = 10 minutes
    // console.log(Review.find());
    console.log(review._author);
    console.log(review._bar);
    Review.findOne({_author: review._author, _bar: review._bar},
      function(err, previousReview) {
        console.log('previous review', previousReview);

        if (previousReview) {
          console.log('subtracted time', Math.floor((new Date() - previousReview.createdAt)/60000));
          if(Math.floor((new Date() - previousReview.createdAt)/60000) < 10){
            res.status(404).json(err);
          } else {
            review.save(function(err) {
              if (err) {
                res.status(400).json(err);
              } else {
                res.status(201).json(review);
              }
            });
          }
        } else {
          review.save(function(err) {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(201).json(review);
            }
          });
        }
    });
  });

router.route('/:barId')
  .get(function(req, res) {
    // Review.aggregate([
    //   { $match: { _bar: req.params.barId} },
    //   { $group: 
    //     {
    //       _id: "$_bar",
    //       avgNoise: { $avg: "$noiseLevel"},
    //       avgCrowd: { $avg: "$crowdLevel"},
    //       avgAge:   { $avg: "$avgAge"},
    //       avgRatio: { $avg: "$ggRatio"}
    //     }}
    //   ], function(err, aggregations) {
    //     if (err)
    //       res.send(err);
    //     res.json(aggregations);
    //   })

    Review.find({_bar: req.params.barId}, function(err, reviews) {
      if (err)
        res.send(err);
      res.json(reviews);
    });


      // var reviews = Review.find({_bar: req.params.barId});
      // return res.status(200).json(reviews);
  });
// expose routes to make them available when loading this file
module.exports = router;

