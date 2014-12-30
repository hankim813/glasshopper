var dotenv = require('dotenv');
dotenv.load();

module.exports = {
        url : 'mongodb://'+ process.env.DB_USER +':'+ process.env.DB_PWD +'@ds049130.mongolab.com:49130/glasshopper'
    };
