'use strict';

var _ = require('lodash');
var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

var logger = require('./../../logger/logger');

var selectFields = ['id', 'userId', 'examId'];

var TBL_NAME = 'userexam';

/*
// Get list of user Exams
exports.index = function (req, res) {
	logger.debug('Entering  fetch All categories');
	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC');
	logger.debug('Exit fetch All categories');
};
*/

exports.indexByExam = function (req, res) {
	logger.debug('Entering userExam.controller.indexByExam with ExamID = ' + req.params.examId);
	var query = 'SELECT userexam.id, user.email, user.name, user.active FROM USER INNER JOIN USEREXAM ON user.id = userExam.userId '
	query += ' WHERE userExam.examId = ' + sqlHelper.escape(req.params.examId);

	apiUtils.select(req, res, query, function (result) {
		logger.debug('Results for indexByExam query', result);
		res.json(result);
	});

	logger.debug('Exit userExam.controller.indexByExam ');
}

exports.indexByExamNew = function(req, res){
	logger.debug('Entering userExam.controller.indexByExamNew with ExamID = ' + req.params.examId);
	var query = 'SELECT user.id, user.email, user.name, user.active FROM USER WHERE Id NOT IN '
	query += ' (SELECT userId FROM userexam WHERE ExamId = ' + sqlHelper.escape(req.params.examId)  + ')';
	query += ' AND role = \'user\' ';

	apiUtils.select(req, res, query, function (result) {
		logger.debug('Results for indexByExamNew query', result);
		res.json(result);
	});

	logger.debug('Exit userExam.controller.indexByExamNew ');
	
}

exports.indexByUser = function (req, res) {
	logger.debug('Entering userExam.controller.indexByUser with userId' + req.params.userId);
	var query = 'SELECT userexam.id, exam.name, exam.code, exam.category, exam.active FROM Exam INNER JOIN USEREXAM ON exam.id = userExam.examId '
	query += ' WHERE userExam.userId = ' + sqlHelper.escape(req.params.userId);

	apiUtils.select(req, res, query, function (result) {
		logger.debug('Results for indexByUser query', result);
		res.json(result);
	});

	logger.debug('Exit userExam.controller.indexByExam ');
}

exports.indexByUserNew = function (req, res) {
	logger.debug('Entering userExam.controller.indexByUserNew with userId' + req.params.userId);
	var query = 'SELECT id, name, code, category, active FROM Exam WHERE id NOT IN '
	query += ' (SELECT ExamId FROM UserExam WHERE userId = ' + sqlHelper.escape(req.params.userId) + ')';
	
	apiUtils.select(req, res, query, function (result) {
		logger.debug('Results for indexByUserNew query', result);
		res.json(result);
	});

	logger.debug('Exit userExam.controller.indexByExamNew ');
}

exports.addUserExamAssignments = function (req, res) {
	logger.debug('Entering userExam.controller.addUserExamAssignments with request body = ', req.body);

	var userIdString = req.body.userId;
	var examIdString = req.body.examId;

	var userIdArray = userIdString.split(',');
	var examIdArray = examIdString.split(',');

	var maxLength = userIdArray.length;
	if(examIdArray.length > maxLength){
		maxLength = examIdArray.length;
	}

	var successCount = 0;
	var failureCount = 0;

	logger.debug('Max Length', maxLength);

	for(var i = 0; i < userIdArray.length;i++){
		for(var j = 0; j < examIdArray.length; j++){
			apiUtils.createBulkLoad(TBL_NAME, {userId: userIdArray[i], examId: examIdArray[j]}, function(err, record){
				if(record.success){
					successCount++;
				}	
				else {
					failureCount++;
				}
				if(successCount + failureCount === maxLength){
					res.send({success: successCount, failureCount : failureCount});
				}
			});
		}
	}
	logger.debug('Exit userExam.controller.addUserExamAssignments');
}

/*
exports.removeUserAssignments = function(req, res){
	logger.debug('Entering userExam.controller.removeUserAssignments with ids = ', req.params.userExamIds);

	var userExamIdArray = _.split(req.params.userExamIds, ',');
	
	_.forEach(userExamIdArray, function (userExamId) {
		apiUtils.delete({},{},TBL_NAME, {id : userExamId}, function(result){
			if(!result){
				apiUtils.handleError(res, {'error':'Error occurred'});
				return;
			}
		});
	});

	res.json({success: true});
	logger.debug('Entering userExam.controller.removeUserAssignments');
}
*/

/*
// Get a single categories
exports.show = function (req, res) {
	logger.debug('Entering get one Single category');
	apiUtils.show(req, res, TBL_NAME, selectFields, 'name ASC');
	logger.debug('Exit get one single Category');
};

// Creates a new categories in the DB.
exports.create = function (req, res) {
	logger.debug('Entering create a new category');
	apiUtils.create(req, res, TBL_NAME, req.body, selectFields);
	logger.debug('Exit create a new category');
};

// Updates an existing categories in the DB.
exports.update = function (req, res) {
	logger.debug('Entering update an existing category');
	apiUtils.update(req, res, TBL_NAME, req.body, selectFields);
	logger.debug('Exit update an existing category');

};
*/

// Deletes a user Exam record from DB.
exports.destroy = function (req, res) {
	logger.debug('Entering userExamController.delete an existing user Id and Exam Id record');
	apiUtils.destroy(req, res, TBL_NAME, req.body, selectFields);
	logger.debug('Exit userExamController.delete ');
};

