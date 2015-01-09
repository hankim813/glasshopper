// setup express Router
var router     = require('express').Router();

// parse multipart/form-data
var multer  = require('multer');
var parseFormData = multer();

// load the mongoose model
var Photo        = require('../app/models/photo');

// Set up and configure AWS
var AWS = require('aws-sdk');
require('../config/aws')(AWS);
var s3 = new AWS.S3();

// define routes
router.route('/')

  .post(parseFormData, function(req, res){
    console.log(JSON.stringify(req.files));
    console.log(JSON.stringify(req.body));

  // uploading to S3

    s3.createBucket({Bucket: 'glasshopper'}, function() {

      var photo = {
        Bucket: 'glasshopper',
        Key: req.files.file.name, 
        Body: req.files.file.path
      };

      console.log("PHOTO TO BE PASSED IN TO S3" + JSON.stringify(photo));

      s3.putObject(photo, function(err, data){
          if (err) 
          { console.log('Error uploading data: ', err); 
          } else {
            console.log('succesfully uploaded the image!');
          }
      });
    }); 

    // returning the signed url from S3 after uploading
    var urlParams = {Bucket: 'glasshopper', Key: req.files.file.name};

    s3.getSignedUrl('getObject', urlParams, function(err, url){
        console.log('the url of the image is', url);
        res.status(201).json(url);
    });

  //   // saving the reference to our db
  //   var photo = new Photo();
  //   photo.caption = req.body.caption;

  //   // photo._user = req.body.userId;
  //   // photo._bar = req.body.barId;
  //   // photo.author = req.body.author;

  //   photo.save(function(err) {
  //     if (err)
  //       res.send(err);

  //     res.status(201).json(photo);
  // });
});

// router.route('/:postId')

//   .get(function(req, res) {
//     Post.findById(req.params.postId, function(err, post) {
//       if (err)
//         res.send(err);
//       res.json(post);
//     })
//   })

// expose routes to make them available when loading this file
module.exports = router;
