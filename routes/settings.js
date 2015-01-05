// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });


// load the mongoose model
var User        = require('../app/models/user');

// define routes
router.route('/:userId/settings')
  .get(function(req, res){
    User.findById(req.params.userId, function(err, user) {
      var userSettings = {
        searchRadius: user.searchRadius
      };
      if(err) {
        res.status(400).json(err);
      }
      else {
        res.status(201).json(userSettings);
      }
    });
  })
  .put(urlencode, function(req, res) {

    User.findOne({ '_id' : req.params.userId}, function(err, user){
      user.searchRadius = req.body.radiusDefinition;
      user.save(function(err) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(201).json(user);
        }
    })
  });
});



module.exports = router;

