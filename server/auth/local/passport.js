var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {

	console.log(User);

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password' // this is the virtual field on the model
    },
		function (email, password, done) {
			console.log('************email********',email);
			console.log('**********password*****',password);

			User.findOne({
				email: email.toLowerCase()
			}, function (err, user) {

				console.log('***err*****' + err);
				console.log('***user***');
				console.log(user);

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