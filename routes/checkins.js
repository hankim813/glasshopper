var router     = require('express').Router();

var bodyParser = require('body-parser');
var urlencode  = bodyParser.urlencoded({ extended: false });

var Checkin    = require('../app/models/checkin');

router.route('/')
	
	.post(urlencode, function(req, res) {
		var checkin = new Checkin();
		checkin._bar = req.body.barId;
		checkin._user = req.body.userId;

		checkin.save(function(err) {
			if (err)
				res.send(err);

			res.status(201).json(checkin);
		});
	})

	.get(function(req, res) {
		Checkin.findById(req.params.checkinId, function(err, checkin) {
			if (err)
				res.send(err);
			res.json(checkin);
		});
	});

module.exports = router;
