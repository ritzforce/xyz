'use strict';

var _ = require('lodash');
var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

var logger = require('./../../logger/logger');

/***********************************************/
/* Get list of exams, show All Exams to Admin
/***********************************************/

var selectFields = ['id','name','active','code','description','category','maxMarks','passPercent','timeAllowed',
					'imageId','createdDate','lastModifiedDate'];

exports.index = function (req, res) {
	logger.debug('Entering examController.index');
	apiUtils.index(req, res, 'exam', selectFields, 'name ASC');
	logger.debug('Exiting examController.index');
};

/***********************************************/
/* Get One Single Exam, based on Id field
/***********************************************/
exports.show = function (req, res) {
	logger.debug('Entering examController.show for Exam Id ', req.params.id);

	apiUtils.show(req, res, 'exam', selectFields, 'name ASC');
	logger.debug('Exiting examController.show for Exam Id');
};

/***********************************************/
/* Create one exam record, based on input
/***********************************************/
exports.create = function (req, res) {
	logger.debug('Entering examController.create for Exam with request Body ', req.body);
	apiUtils.create(req, res, 'exam', req.body, selectFields);
	logger.debug('Exiting examController.create for Exam');
};

/***********************************************/
/* Update one exam record, based on input
/***********************************************/
exports.update = function (req, res) {	
	logger.debug('Entering examController.update for Exam with request Body ', req.body);

	apiUtils.update(req, res, 'exam', req.body, selectFields);
	logger.debug('Exiting examController.update for Exam');
};

/********************************************/
/* Deletes a exam from the DB.
/*******************************************/
exports.destroy = function (req, res) {	
	logger.debug('Entering examController.delete for Exam with id', req.params.id);
	apiUtils.destroy(req, res, 'exam', req.body);

	logger.debug('Entering examController.delete for Exam');
};

/******************************Private Functions************************************/


function getRecordByIdQuery(connection,id){
	var sqlUtils = new SqlUtils('exam',5);
	sqlUtils.appendSelectFields(['id','name','code','description','category','maxMarks','passPercent',
		                            'createdDate','lastModifiedDate'])

	sqlUtils.appendIdClause(connection.escape(id));
	return sqlUtils.getSelectQuery();
}

