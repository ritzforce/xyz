'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');

var logger = require('./../logger/logger');

var User = require('../api/user/sessionUser');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
	return compose()
		// Validate jwt
		.use(function (req, res, next) {
			// allow access_token to be passed through query parameter as well
			if (req.query && req.query.hasOwnProperty('access_token')) {
				req.headers.authorization = 'Bearer ' + req.query.access_token;
			}

			logger.info('***Access token***' + req.headers.authorization);

			validateJwt(req, res, next);
		})
		// Attach user to request
		.use(function (req, res, next) {
			var user = new User();
			logger.info('*****USER ATTACHED TO REQUEST****', req.user.id);
			logger.info('******USER CODE ATTACHED TO REQUEST****', req.user.code);

			let userCode = req.user.code;


			user.findById(req.user.id, req.user.code, function (err, user) {
				if (err) return next(err);
				if (!user) return res.send(401);

				req.user = user;
				req.user.code = userCode.toLowerCase();

				logger.info("*****USER OBJECT*******", JSON.stringify(req.user));

				next();
			});
		});
}

function isSuperAdminRole(req) {
	if(!req.user) {
		return false;
	}
	var user = req.user;
	return (user.role === 'superadmin');
}

function isAdminRole(req){
	if(!req.user){
		return false;
	}
	var user = req.user;
	return (user.role === 'admin' || user.role === 'superadmin');
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
	if (!roleRequired) throw new Error('Required role needs to be set');

	return compose()
		.use(isAuthenticated())
		.use(function meetsRequirements(req, res, next) {
			if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
				next();
			}
			else {
				res.send(403);
			}
		});
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, code, mobile) {
	logger.info('Sign Token =>' + id + ", Sign Code=>" + code);
	var timeoutInMinutes = 60 * 5;
	if(mobile) {
		timeoutInMinutes = 60 * 24 * 10;
	}
	logger.info("timeoutInMinutes ", timeoutInMinutes);

	return jwt.sign({ id: id, code: code}, config.secrets.session, 
		{ expiresInMinutes: timeoutInMinutes });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
	if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.' });
	var token = signToken(req.user._id, req.user.role);
	res.cookie('token', JSON.stringify(token));
	res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
exports.isAdminRole = isAdminRole;