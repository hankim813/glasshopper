// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

// setup request module to issue http requests to third party apis
var request    = require('request');

// load the mongoose model
var Post        = require('../app/models/post');

// define routes
router.route('/:barId/posts/')

  .post(urlencode, function(req, res){

    var post = new Post();
    post.author = req.body.author;
    post.content = req.body.content;
    post._user = req.body.userId;
    post._bar = req.body.barId;

    post.save(function(err) {
      if (err)
        res.send(err);

      res.status(201).json(post);
    })
  })

  .get(function(req, res) {
    Post.find({_bar: req.params.barId}, function(err, posts) {
      if (err)
        res.send(err);
      res.json(posts);
    });
  });

router.route('/:barId/posts/:postId')

  .get(function(req, res) {
    Post.findById(req.params.postId, function(err, post) {
      if (err)
        res.send(err);
      res.json(post);
    })
  });
// expose routes to make them available when loading this file
module.exports = router;
