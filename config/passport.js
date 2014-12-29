var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');

module.exports = function(passport) {

    passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            if (user) {
                return done(null, false, { message: 'That email is already taken.'});
            } else {
              var newUser            = new User();

              newUser.name           = req.body.name;
              newUser.local.email    = email;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
              });
            }
          });
        });
    }));

    passport.use('local-signin', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, or the password is wrong return the message
        if (!user || !user.validPassword(password))
          return done(null, false, {message: "invalid email / password combination"});

        // otherwise return the user
        return done(null, user);
      });
    }));


};
