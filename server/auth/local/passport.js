var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var logger = require('./../../logger/logger');

exports.setup = function (User, config) {

	logger.debug('Entering passport.setup for local Login');

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password' // this is the virtual field on the model
    },
		function (email, password, done) {
			logger.info('Entering login function with email ', email);

			User.findOne({
				email: email.toLowerCase()
			}, function (err, user) {
				if(err){
					logger.error(err);
				}
				logger.info(user);
			
				if (err) return done(err);

				if (!user) {
					return done(null, false, { message: 'The email or password is not correct. Please try again' });
				}
				if (!user.authenticate(password)) {
					return done(null, false, { message: 'The email or password is not correct. Please try again' });
				}
				return done(null, user);
			});
		}
	));
};