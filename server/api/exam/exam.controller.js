'use strict';

var _ = require('lodash');
var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

/***********************************************/
/* Get list of exams, show All Exams to Admin
/***********************************************/

var selectFields = ['id','name','active','code','description','category','maxMarks','passPercent','timeAllowed',
					'imageId','createdDate','lastModifiedDate'];

exports.index = function (req, res) {
	apiUtils.index(req, res, 'exam', selectFields, 'name ASC');
};

/***********************************************/
/* Get One Single Exam, based on Id field
/***********************************************/
exports.show = function (req, res) {
	apiUtils.show(req, res, 'exam', selectFields, 'name ASC');
};

/***********************************************/
/* Create one exam record, based on input
/***********************************************/
exports.create = function (req, res) {
	apiUtils.create(req, res, 'exam', req.body, selectFields);
};

/***********************************************/
/* Update one exam record, based on input
/***********************************************/
exports.update = function (req, res) {	
	apiUtils.update(req, res, 'exam', req.body, selectFields);
};

/********************************************/
/* Deletes a exam from the DB.
/*******************************************/
exports.destroy = function (req, res) {	
	apiUtils.destroy(req, res, 'exam', req.body);
};

/******************************Private Functions************************************/


function getRecordByIdQuery(connection,id){
	var sqlUtils = new SqlUtils('exam',5);
	sqlUtils.appendSelectFields(['id','name','code','description','category','maxMarks','passPercent',
		                            'createdDate','lastModifiedDate'])

	sqlUtils.appendIdClause(connection.escape(id));
	return sqlUtils.getSelectQuery();
}

function handleError(res, err) {
	return res.send(500, err);
}

function getConnection(req, res, callback) {
	sqlHelper.getConnection(function (err, connection) {
		console.log(err);
		if (err) {
			handleError(res, err);
			return;
		}
		//console.log(connection);
		callback(connection);
	});
}
