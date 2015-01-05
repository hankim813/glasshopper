// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

// setup request module to issue http requests to third party apis
var request    = require('request');

// load the mongoose model
var Bar        = require('../app/models/bar');


// define routes
router.route('/')
  .get(function(req, res){
    Bar.find(function(err, bars) {
      if(err) throw err;

      res.json(bars);
    });
  })

  .post(urlencode, function(req, res) {

    var bar = new Bar();    // create a new instance of the Bar model
    bar.name = req.body.name;  // set the bears name (comes from the request)

    if(!bar.name){
      res.sendStatus(400);
      return false;
    }
    // save the bar and check for errors
    bar.save(function(err) {
      if (err)
        res.send(err);

      res.status(201).json(bar.name);
    });
  });

router.route('/nearby')
  .get(function(req, res) {

    var radius = parseFloat(req.query.radius)
    var adjustedMeterRadius = radius * 1601 * 0.85
    var lng = parseFloat(req.query.lng)
    var lat = parseFloat(req.query.lat)

    Bar.fetchBarsFromGoogle(lat + ',' + lng, adjustedMeterRadius);

    Bar.findNearbyQuery(lng, lat, radius)
      .then(function (results, stats) {
        res.status(200).json(results);
      }).end(function(err) {
        res.status(500).json("something went wrong, please try again")
      });

  });

router.route('/:barId')
  .delete(function(req, res) {
    Bar.remove({
      _id: req.params.barId
    }, function(err, bar) {
      if(err) throw err;
      res.sendStatus(204);
    });
  })

  .put(urlencode, function(req, res) {
    Bar.findById(req.params.barId, function(err, bar) {
      if (err)
        res.send(err);

      bar.name = req.body.name;  // update the bar info

      bar.save(function(err) {
        if (err)
          res.send(err);

        res.json(bar.name);
      });
    });
  })

  .get(function(req, res) {
    Bar.findById(req.params.barId, function(err, bar) {
      if (err)
        res.send(err);
      res.json(bar);
    });
  });

// expose routes to make them available when loading this file
module.exports = router;
