var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

/***********************************************/
/* Get list of Questions, show All Questions to Admin
/***********************************************/

var selectFields = ['id','name','questionText','active','a','b','c','d','e','f',
                    'aCorrect','bCorrect','cCorrect','dCorrect','eCorrect','fCorrect','examId'];

var TBL_NAME = 'question';

exports.index = function (req, res) {
	var examId = sqlHelper.escape(req.params.examId);
	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC', ['examId = ' + examId]);
};

//**************************************************//
//Get Questions for Launch 
//***************************************************//
exports.launch = function(req,res){
	var examId = sqlHelper.escape(req.params.examId);
	var selectFields = ['id','name','questionText','a','b','c','d','e','f',
	'aCorrect + bCorrect + cCorrect + dCorrect + eCorrect + fCorrect As len'];

	var whereClause = [];
	whereClause.push('examId = ' + examId);
	whereClause.push('active = true ');

	apiUtils.index(req, res, TBL_NAME, selectFields,null,whereClause);
}


/***********************************************/
/* Get One Single Question, based on Id field
/***********************************************/
exports.show = function (req, res) {
	apiUtils.show(req, res, TBL_NAME, selectFields, 'name ASC');
};

/***********************************************/
/* Create one Question record, based on input
/***********************************************/
exports.create = function (req, res) {
	apiUtils.create(req, res, TBL_NAME, req.body, selectFields);
};

/***********************************************/
/* Update one Question record, based on input
/***********************************************/
exports.update = function (req, res) {	
	apiUtils.update(req, res, TBL_NAME, req.body, selectFields);
};

/********************************************/
/* Deletes a Question from the DB.
/*******************************************/
exports.destroy = function (req, res) {	
	apiUtils.destroy(req, res, TBL_NAME, req.body);
};
