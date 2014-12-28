// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// var BasicStrategy   = require('passport-http').BasicStrategy;

// load up the user model
var User            = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // passport.use('local-signup', new BasicStrategy(
    //   function(email, password, done) {
    //     User.findOne({ email: email }, function (err, user) {
    //       if (err) { return done(err); }
    //       if (user) {
    //         return done(null, false);
    //       } else {

    //       }
    //       if (!user.verifyPassword(password)) { return done(null, false); }
    //       return done(null, user);
    //     });
    //   }
    // ));

    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
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

            // if no user is found, return the message
            if (!user)
                return done(null, false, {message: "invalid email / password combination"});

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, {message: "invalid email / password combination"});

            return done(null, user);
        });

    }));


};
