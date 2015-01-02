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

router.route('/fetch')
  .get(function(req, res) {
    var latLng = req.query.latLng;
    var radius = req.query.radius;
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+
              latLng + '&radius=' +
              radius + '&types=bar&key=AIzaSyCCgn-b7ZEYd-U45DJpO6tXhtnkq3zWq2E';
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(body); // Print the google web page.
      }
    });
  });

router.route('/:bar_id')
  .delete(function(req, res) {
    Bar.remove({
      _id: req.params.bar_id
    }, function(err, bar) {
      if(err) throw err;
      res.sendStatus(204);
    });
  })

  .put(urlencode, function(req, res) {
    Bar.findById(req.params.bar_id, function(err, bar) {
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
    Bar.findById(req.params.bar_id, function(err, bar) {
      if (err)
        res.send(err);
      res.json(bar);
    });
  });

// expose routes to make them available when loading this file
module.exports = router;
