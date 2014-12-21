var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });


var Bar     = require('../app/models/bar');

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


router.route('/:bar_id')
  .delete(function(req, res) {
    Bar.remove({
      _id: req.params.bar_id
    }, function(err, bar) {
      if(err) throw err;
      res.sendStatus(204);
    });
  })

  .put(function(req, res) {
    Bar.findById(req.params.bear_id, function(err, bar) {
      if (err)
        res.send(err);

      bar.name = req.body.name;  // update the bears info

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


module.exports = router;
