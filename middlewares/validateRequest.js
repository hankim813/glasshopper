var jwt          = require('jwt-simple');
var User         = require('../app/models/user');

module.exports = function(req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  if (token) {
    try {
      var decoded = jwt.decode(token, process.env.APP_SECRET);

      if (decoded.exp <= Date.now()) {
        res.set('WWW-Authenticate', 'FormBased');
        res.status(401).json({
          "status": 401,
          "message": "Token Expired"
        });
        return;
      }

      User.findById(decoded.userId, function(err, user) {
        // if user is found, move to next middleware, user is authenticated
        if (user) {
          next();
        } else {
          res.status(403).json({
            "status": 403,
            "message": "Not Authorized"
          });
          return;
        }
      });

    } catch (err) {
      res.set('WWW-Authenticate', 'FormBased');
      res.status(401).json({
        "status": 401,
        "message": "Invalid Token"
      });
    }
  } else {
    res.set('WWW-Authenticate', 'FormBased');
    res.status(401).json({
      "status": 401,
      "message": "Invalid Token"
    });
    return;
  }
};