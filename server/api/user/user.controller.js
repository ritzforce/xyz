'use strict';

var passport = require('passport');
var crypto = require('crypto');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var objectAssign = require('object-assign');

var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');
var paperController = require('./../paper/paper.controller');
var CodeUser = require('./sessionUser')

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

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
	var user = new CodeUser();
	objectAssign(user, req.body);
	user.role = 'user';
	user.active = 1;
	user.salt = makeSalt();
	user.password = user.encryptPassword(req.body.password);

	//Creation Complete
	apiUtils.create(req, res, TBL_NAME, user, selectFields, function (user) {
		var token = jwt.sign({ id: user.id }, config.secrets.session, { expiresInMinutes: 60 * 5 });
		res.json({ token: token });
	});

	/*
	newUser.save(function(err, user) {
	  if (err) return validationError(res, err);
	  var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
	  res.json({ token: token });
	});
	*/
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
	/*
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.send(500, err);
		return res.send(204);
	});
	*/
	apiUtils.destroy(req, res, TBL_NAME, req.body);
};

exports.myprofile = function (req, res) {
	console.log('*****My Profile *****');
	console.log(req.user);
	var userId = req.user.id;

	console.log('&&&&&&&&&&&&&&&&&&')
	console.log(CodeUser);
	console.log('&&&&&&&&&&&&&&&&&');

	console.log("***SERVER***" + userId);
	var user = new CodeUser();

	req.params.id = userId;
	return retrieveUserProfileById(req, res);
}


//Query Data for a profile user from the database
function retrieveUserProfileById (req, res){
	console.log('****Profile Function*****');
	var userId = req.params.id;
	console.log('***USER PARAMS*****' + userId);
	var user = new CodeUser();

	exports.findById(userId, function(err, result){
		
		if(err){
			return res.send(500,err);
		}
		user = objectAssign(user,result[0]);
		console.log('*****user****', user);

		paperController.getPapersForUser(userId, function(err, result){
			//console.log('****exam results***');
			//console.log(result)
			if(err){
				handleError(err,null);
				return;
			}

			user.exams = result;
			return res.json(user);
		});		
	});
}

exports.profile = retrieveUserProfileById;


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
	exports.findById(userId, function(err, result){
		if(err){
			return res.send(500,err);
		}
		
		return res.json(result[0]);
	});
};

exports.findById = function(id, callback){
	var sqlUtils = new SqlUtils(TBL_NAME);
	sqlUtils.appendSelectFields(selectFields);
	sqlUtils.appendWhereClauses("id = " + sqlHelper.escape(id));

	apiUtils.fireRawQuery(sqlUtils.getSelectQuery(), callback);

};

exports.findByEmail = function (email, callback) {
	var sqlUtils = new SqlUtils(TBL_NAME);
	sqlUtils.appendSelectFields(selectFields);
	sqlUtils.appendSelectFields(['password','salt']);
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
