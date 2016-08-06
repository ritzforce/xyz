'use strict';

var passport = require('passport');
var crypto = require('crypto');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var objectAssign = require('object-assign');

var logger = require('./../../logger/logger');

var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');
var paperController = require('./../paper/paper.controller');


/***********************************************/
/* Get list of users, show All users to Admin
/***********************************************/

var selectFields = ['id', 'name', 'active', 'email', 'role', 'createdDate', 'lastModifiedDate'];
var TBL_NAME = 'user';

var validationError = function (res, err) {
	return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
	/*
	User.find({}, '-salt -hashedPassword', function (err, users) {
		if (err) return res.send(500, err);
		res.json(200, users);
	});
	*/
	console.log('*****index***');

	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC');
};

exports.update = function(req, res){
	var requestBody = req.body;

	if(requestBody.password){
		delete requestBody.password;
	}
	if(requestBody.salt){
		delete requestBody.salt;
	}

	apiUtils.update(req, res, TBL_NAME, req.body, selectFields);
}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
	logger.debug('Entering create user');

	var CodeUser = require('./sessionUser')

	console.log('****CODEUSER*****');
	console.log(CodeUser);
	console.log('********************');

	var user = new CodeUser();
	objectAssign(user, req.body);
	user.role = 'user';
	user.active = 1;
	user.salt = makeSalt();
	user.password = user.encryptPassword(req.body.password);

	logger.debug('Check if the user with email already exists', user.email);

	//Check if the user 
	user.findOne(user, function (err, result) {
		if(err){
			apiUtils.handleError(res, err);
			logger.debug('Exit an error occurred');
			return;
		}


		//If a user already exists, throw a validation error
		if (result) {
			logger.error('An existing user', result);
			res.json(422, 'A user with the email id already exists');
			logger.debug('Exit an existing user found');
			return;
		}
		//Creation Complete
		apiUtils.create(req, res, TBL_NAME, user, selectFields, function (user) {
			logger.info('User created with the following details ', user)
			logger.debug('Exit create user');
			res.json({ id: user.id });
		});

	})

};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
	console.log('**single User***');
	apiUtils.show(req, res, TBL_NAME, selectFields, 'name ASC');
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
	apiUtils.destroy(req, res, TBL_NAME, req.body);
};

exports.myprofile = function (req, res) {

	logger.debug('Entering user.controller.myProfile with user', req.user);
	var userId = req.user.id;

	var CodeUser = require('./sessionUser');
	var user = new CodeUser();

	req.params.id = userId;
	return exports.profile(req, res);
}


//Query Data for a profile user from the database
function retrieveUserProfileById(req, res) {
	logger.debug('Entering user.controller.retrieveUserProfileById with user id',  req.params.id);
	var userId = req.params.id;
	
	exports.findById(userId, function (err, result) {

		if (err) {
			logger.error(err);
			return res.send(500, err);
		}
		var user = {};
		user = objectAssign(user, result[0]);
	
		paperController.getPapersForUser(userId, function (err, result) {
			if (err) {
				apiUtils.handleError(err, null);
				return;
			}

			user.exams = result;
			return res.json(user);
		});
	});
}

exports.profile = retrieveUserProfileById;

exports.resetPassordSelf = function(req, res){
	logger.debug('Entering user.controller.resetPassordSelf with body');

	if(req.body.id){
		delete req.body.id;
	}
	var CodeUser = require('./sessionUser');
	var user = new CodeUser();

	logger.info('Current user captured by the request', req.user);

	user.id = req.user.id;

	exports.findByEmail(req.user.email, function(err, dbResult){
		if(err){
			logger.error('Error occurred in finding the user by email', err);
			apiUtils.handleError(res, err);
			return;
		}
		logger.debug('User retrieved from the database based on email');

		objectAssign(user, dbResult[0]);
		req.params.id = user.id;

		if(user.authenticate(req.body.oldPassword)){
			logger.info('Authentication of reset Password successful');
			return resetPassword(req, res, user);
		}
		else {
			logger.info('Authentication of reset Password FAILED');
			return validationError(res, 'The old password is not valid');
		}

	})
	

	//logger.debug('Exiting user.controller.resetPassordSelf');
}

function resetPassword(req, res, user){
	logger.debug('Entering user.controller.resetPassword with body');

	user.salt = makeSalt();
	user.password = user.encryptPassword(req.body.password);

	return apiUtils.update(req, res, TBL_NAME, user, selectFields);
}


exports.resetPassword = function(req, res){
	if(req.body.id){
		delete req.body.id;
	}

	var CodeUser = require('./sessionUser');
	var user = new CodeUser();
	user.id = req.params.id;

	objectAssign(user, req.body);
	resetPassword(req, res, user);
};


/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	CodeUser.findById(userId, function (err, user) {
		if (user.authenticate(oldPass)) {
			user.password = newPass;
			user.save(function (err) {
				if (err) return validationError(res, err);
				res.send(200);
			});
		} else {
			res.send(403);
		}
	});
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {

	console.log('**exports.me****')

	var userId = req.user.id;
	console.log('**req.user**');
	console.log(req.user);
	console.log('***userId****' + userId);
	exports.findById(userId, function (err, result) {
		if (err) {
			return res.send(500, err);
		}

		return res.json(result[0]);
	});
};

exports.findById = function (id, callback) {
	var sqlUtils = new SqlUtils(TBL_NAME);
	sqlUtils.appendSelectFields(selectFields);
	sqlUtils.appendWhereClauses("id = " + sqlHelper.escape(id));

	apiUtils.fireRawQuery(sqlUtils.getSelectQuery(), callback);

};

exports.findByEmail = function (email, callback) {
	var sqlUtils = new SqlUtils(TBL_NAME);
	sqlUtils.appendSelectFields(selectFields);
	sqlUtils.appendSelectFields(['password', 'salt']);
	sqlUtils.appendWhereClauses("email = " + sqlHelper.escape(email));

	console.log('***find By Email Query***');
	console.log(sqlUtils.getSelectQuery());

	apiUtils.fireRawQuery(sqlUtils.getSelectQuery(), callback);
}

/************************************Utility Functions******************************/
function makeSalt() {
	return crypto.randomBytes(16).toString('base64');
}

function encryptPassword(password, salt) {
	if (!password || !salt) return '';
	var localSalt = new Buffer(salt, 'base64');
	return crypto.pbkdf2Sync(password, localSalt, 10000, 64).toString('base64');
}

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
	res.redirect('/');
};
