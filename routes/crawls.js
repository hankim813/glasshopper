var router     = require('express').Router();

var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

var Crawl    = require('../app/models/crawl');

router.route('/')
	
	.post(urlencode, function(req, res) {
		Crawl.findOne({
			$and:[ 
				{_leader: req.body.userId},
				{open: true}
			]}, function(err, crawl) {
			if (crawl) {
				res.status(400).json({
				  "status": 400,
				  "message": "There is an open bar crawl open. Please close before creating a new one"
				});
			} else {
				var crawl = new Crawl();
				crawl._leader = req.body.userId;

				crawl.save(function(err) {
					if (err)
						res.send(err);

					res.status(201).json(crawl);
				});
			}
		});
	});

router.route('/:crawlId')
	.get(function(req, res) {
		Crawl.findById(req.params.crawlId, function(err, crawl) {
			if (err)
				res.send(err);
			res.json(crawl);
		});
	});

module.exports = router;
