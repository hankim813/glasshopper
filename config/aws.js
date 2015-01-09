var dotenv = require('dotenv');
dotenv.load();

module.exports = function(aws) {
	aws.config.update(
		{
		  accessKeyId: process.env.AWS_ACCESS_KEY, 
			secretAccessKey: process.env.AWS_SECRET_KEY, 
			region: ""
		}
	)
};