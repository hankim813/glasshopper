// setup express Router
var router     = require('express').Router();

// setup express bodyParser middleware
var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

// Required to find the post
var Post        = require('../app/models/post');

// define routes
router.route('/up/:postId')

  .put(urlencode, function(req, res){
    Post.findById(req.params.postId, function(err, post) {
      if (err)
        res.send(err);

        post.upvote();

        post.save(function(err) {
          if (err)
            res.send(err);

            res.json(post.points);
          });
    });
  });
router.route('/down/:postId')

  .put(urlencode, function(req, res){
    Post.findById(req.params.postId, function(err, post) {
      if (err)
        res.send(err);

        post.downvote();

        post.save(function(err) {
          if (err)
            res.send(err);
          
          res.json(post.points);
          });
    });
  });

// expose routes to make them available when loading this file
module.exports = router;
