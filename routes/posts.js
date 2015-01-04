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
router.route('/')

  .post(urlencode, function(req, res){

    console.log(JSON.stringify(req.body));
    var post = new Post();
    post.author = req.body.author;
    post.content = req.body.content;
    post._user = req.body.userId;
    post._bar = req.body.barId;

    post.save(function(err) {
      if (err)
        res.send(err);

      res.status(201).json(post);
  });
});

router.route('/:postId')

  .get(function(req, res) {
    Post.findById(req.params.postId, function(err, post) {
      if (err)
        res.send(err);
      res.json(post);
    })
  })

// expose routes to make them available when loading this file
module.exports = router;
