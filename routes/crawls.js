var router     = require('express').Router();

var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

var Crawl    = require('../app/models/crawl');
var Bar    = require('../app/models/bar');

router.route('/')
	
	.post(urlencode, function(req, res) {
		Crawl.findOne({
			$and:[ 
				{_leader: req.body.data.userId},
				{open: true}
			]}, function(err, crawl) {
			if (crawl) {
				res.status(400).json({
				  "status": 400,
				  "message": "There is an open bar crawl open. Please close before creating a new one"
				});
			} else {
				var crawl = new Crawl();
				crawl._leader = req.body.data.userId;
				crawl.name = req.body.data.name;
				crawl.save(function(err) {
					if (err)
						return res.send(err);

					res.status(201).json(crawl);
				});
			}
		});
	});

router.route('/:crawlId')
	.get(function(req, res) {
		Crawl.findOne({
			$and: [
				{_id: req.params.crawlId},
				{open: true}
			]}).populate('_checkins').exec(function(err, crawl) {
				if (err)
					return res.send(err);

				Bar.populate(crawl,{
					path: '_checkins._bar'
				}, function(err, populatedCrawl) {
					res.json(populatedCrawl);
			});
		});
	})

	.put(urlencode, function(req, res) {
		Crawl.findById(req.params.crawlId, function(err, crawl) {
			if (err)
				return res.send(err);

			if (crawl !== null) {
				crawl.open = false;
				crawl.save(function(err) {
					if (err) 
						return res.send(err);

					res.json(crawl);
				});
			} else {
				res.status(404).json("could not find the crawl");
			}
		})
	});

router.route('/:crawlId/closed')
	.get(function(req, res) {
		Crawl.findOne({
			$and: [
				{_id: req.params.crawlId},
				{open: false}
			]}).populate('_checkins').exec(function(err, crawl) {
				if (err)
					return res.send(err);

				Bar.populate(crawl,{
					path: '_checkins._bar'
				}, function(err, populatedCrawl) {
					res.json(populatedCrawl);
			});
		});
	});

router.route('/users/:userId')
	.get(function(req, res) {
		Crawl.find({
			$and: [
				{_leader: req.params.userId},
				{open: false}
			]}, function(err, crawls) {
			if (err)
				return res.send(err);
			res.json(crawls);
		})
	});

router.route('/:crawlId/checkins/:checkinId')
	.put(urlencode, function(req, res) {
		Crawl.findById(req.params.crawlId, function(err, crawl) {
			if (err)
				return res.send(err);

				if (crawl !== null) {
					crawl._checkins.push(req.params.checkinId);
					crawl.save(function(err) {

						if (err) 
							return res.send(err);

					res.json(crawl);
				});
			} else {
				res.status(404).json("could not find the crawl");
			}
		});
	});

module.exports = router;
