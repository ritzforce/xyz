'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var logger = require('../../logger/logger');

var router = express.Router();

router.post('/', function (req, res, next) {
	logger.debug('Entering login');
	logger.debug(req.body);

	passport.authenticate('local',{session: false}, function (err, user, info) {
		var error = err || info;
		if (error) return res.json(401, error);
		if (!user) return res.json(404, { message: 'Something went wrong, please try again.' });

		logger.info('***authentication successful*****');
		logger.info(user);
		
		var token = auth.signToken(user.id, req.body.code, req.body.mobile);
		
		res.json({ token: token });

		logger.debug('Exit login');
	})(req, res, next)
});

module.exports = router;