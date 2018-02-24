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
	
	logger.debug('Entering userController.index');

	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC');
	logger.debug('Exit userController.index');

};

exports.update = function(req, res){
	logger.debug('Entering userController.update with requestBody', req.body);

	var requestBody = req.body;

	if(requestBody.password){
		delete requestBody.password;
	}
	if(requestBody.salt){
		delete requestBody.salt;
	}

	apiUtils.update(req, res, TBL_NAME, req.body, selectFields);

	logger.debug('Exit userController.update');
}

/**
 * Creates a new user
 */
/**
 * Creates a new user, called internally by the admin
 */
exports.create = function (req, res, next) {
	logger.debug('Entering userController.create user');
	logger.debug('***************************CREATE USER****************', req.user);

	var user = req.body;
	if (req.user && req.user.code) {
		user.code = req.user.code;
	}

	return createUser(req, res, user);

	/*
	var CodeUser = require('./sessionUser')

	var user = new CodeUser();
	objectAssign(user, req.body);
	user.role = 'user';
	

	//user.active = 0;
	user.salt = makeSalt();
	user.password = user.encryptPassword(req.body.password);
	
	// User code is already populated, then no need to anything
	if(user.code == null || user.code == '') {
		if (req.user && req.user.code) {
			user.code = req.user.code;	
		}
	}
	else {
		user.active = 0;
	}
	
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

		var userTable = user.code.toLowerCase() + "_" + TBL_NAME;
		if (user.code) {
			delete user.code;
		}	
		//Creation Complete
		apiUtils.create(req, res, userTable, user, selectFields, function (user) {
			logger.info('User created with the following details ', user)
			logger.debug('Exit create user');
			res.json({ id: user.id });
		});

	})
	*/

};
/**
 * Get a single user
 */
exports.show = function (req, res, next) {
	logger.debug('Entering userController.show with user id ', req.params.id);
	apiUtils.show(req, res, TBL_NAME, selectFields, 'name ASC');
	logger.debug('Exiting userController.show ');
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
	
	exports.findById(userId, req.user.code, function (err, result) {

		if (err) {
			logger.error(err);
			return res.send(500, err);
		}
		var user = {};
		user = objectAssign(user, result[0]);
	
		paperController.getPapersForUser(req, userId, function (err, result) {
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

exports.getAdminUser = function(req, res) {
	logger.debug('Entering user.controller.getAdminUser with params' , req.params);
	var instituteCode = req.params.instituteCode;

	apiUtils.index(req, res, instituteCode.toLowerCase() + "_" + TBL_NAME, 
	selectFields, "name ASC", "role = 'admin'");

	logger.debug('Exiting user.controller.getAdminUser');
}

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

	var resetUser = {
		salt : user.salt,
		password: user.password,
		id: user.id
	};
	logger.debug('****user*****', user);
	logger.debug('***resetUser***', resetUser);

	return apiUtils.update(req, res, TBL_NAME, resetUser, selectFields);
}


exports.resetPassword = function(req, res){
	if(req.body.id){
		delete req.body.id;
	}

	var CodeUser = require('./sessionUser');
	var user = new CodeUser();
	user.id = req.params.id;

	if(user.code) {
		delete user.code;
	}

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
	logger.debug('Entering userController.me method with request', req.user);

	var userId = req.user.id;
	logger.info('User attached to request', req.user);

	exports.findById(userId, req.user.code, function (err, result) {
		if (err) {
			return res.send(500, err);
		}

		return res.json(result[0]);
	});
};

exports.findById = function (id, code, callback) {
	logger.debug('Entering userController.findById method with Id AND CODE', id, code);

	var sqlUtils = new SqlUtils(code.toLowerCase() + "_" + TBL_NAME);
	sqlUtils.appendSelectFields(selectFields);
	sqlUtils.appendWhereClauses("id = " + sqlHelper.escape(id));

	apiUtils.fireRawQuery(sqlUtils.getSelectQuery(), callback);

};

exports.findByEmail = function (email, code, callback) {
	logger.debug('Entering userController.findByEmail method with email & code', email, code);

	var sqlUtils = new SqlUtils(code.toLowerCase() + "_" + TBL_NAME);
	sqlUtils.appendSelectFields(selectFields);
	sqlUtils.appendSelectFields(['password', 'salt']);
	sqlUtils.appendWhereClauses("email = " + sqlHelper.escape(email));
	//sqlUtils.appendWhereClauses("active = 1");

	apiUtils.fireRawQuery(sqlUtils.getSelectQuery(), callback);
}

exports.signup = function(req, res, next) {
	logger.debug('Entering userController.signUpNewUser with body' + req.body);	
	logger.debug(JSON.stringify(req.body));

	var user = req.body;

	var userTable = user.code.toLowerCase() + "_" + TBL_NAME;
	checkIfTableExists(req, res, userTable, function(tblResult) {
		//Invalid code
		if (tblResult == 0) {
			res.json(422, 'The Institute Code is invalid');
			return;	
		}
		req.user = { code : req.body.code};

		return createUser(req, res, req.body);
	});

}

/************************************Utility Functions******************************/
function makeSalt() {
	return crypto.randomBytes(16).toString('base64');
}

exports.createAdminUser = function(password) {
   	var CodeUser = require('./sessionUser');

   	var user = new CodeUser();
	user.role = 'admin';
	user.email = 'admin@admin.com';
	user.name = 'admin';
	user.active = true;
	user.id = 1;

	user.salt = makeSalt();
	user.password = user.encryptPassword(password);

	delete user.code;

	return user;
}

function encryptPassword(password, salt) {
	if (!password || !salt) return '';
	var localSalt = new Buffer(salt, 'base64');
	return crypto.pbkdf2Sync(password, localSalt, 10000, 64).toString('base64');
}

function createUser(req, res, userBody) {
	var CodeUser = require('./sessionUser')

	var user = new CodeUser();
	objectAssign(user, userBody);
	user.role = 'user';

	user.salt = makeSalt();
	user.password = user.encryptPassword(userBody.password);
	
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

		var userTable = user.code.toLowerCase() + "_" + TBL_NAME;


		if (user.code) {
			delete user.code;
		}	
			
		//Creation Complete
		apiUtils.create(req, res, userTable, user, selectFields, function (user) {
			logger.info('User created with the following details ', user)
			logger.debug('Exit create user');
			res.json({ id: user.id });
		});
		
		
	})

}

function checkIfTableExists(req, res, tbl, callback) {
	apiUtils.select(req, res, "SHOW TABLES LIKE " + sqlHelper.escape(tbl), callback);
}

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
	res.redirect('/');
};
