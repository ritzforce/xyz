var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

var logger = require('./../../logger/logger');

/***********************************************/
/* Get list of Questions, show All Questions to Admin
/***********************************************/

var selectFields = ['id', 'paperId', 'questionId', 'correct', 'answer', 'createdDate', 'lastModifiedDate'];
var TBL_NAME = 'paperAnswer';

exports.index = function (req, res) {
	logger.debug('Entering paperAnswer.index with exam Id', req.params.examId);
	var examId = sqlHelper.escape(req.params.examId);
	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC', ['examId = ' + examId]);

	logger.debug('Exiting paperAnswer.index');
};


/***********************************************/
/* Get One Single Paper record, based on Id field
/***********************************************/
exports.show = function (req, res) {
	apiUtils.show(req, res, TBL_NAME, selectFields);
};

/***********************************************/
/* Create one Paper Answer record, based on input, provided by the 
/***********************************************/
exports.upsert = function (req, res) {
	logger.debug('Entering paperAnswer.upsert with request Body', req.body);

	var requestBody = req.body;

	var sqlUtils = new SqlUtils(apiUtils.prefixCode(req,TBL_NAME), 1000);
	sqlUtils.appendSelectFields('id');
	sqlUtils.appendWhereClauses('paperId = ' + sqlHelper.escape(requestBody.paperId));
	sqlUtils.appendWhereClauses('questionId = ' + sqlHelper.escape(requestBody.questionId));

	apiUtils.select(req, res, sqlUtils.getSelectQuery(),function(result){
		logger.info('paperAnswer.upsert result', result);
		//No record exists, need to create a new one
		queryQuestion(req, res, result, requestBody);
	});
};

function queryQuestion(req, res, result, requestBody){
	logger.debug('Entering paperAnswer.queryQuestion with request Body', req.body);

	var selectQuery = 	"select CONCAT(IF(aCorrect,'a',''), IF(bCorrect,'b',''), IF(cCorrect,'c',''), " +
						"IF(dCorrect,'d',''), IF(eCorrect,'e',''), " +
     					"IF(fCorrect,'f','')) AS answer FROM " + apiUtils.prefixCode(req,'question');
     selectQuery   +=   " WHERE id = " + sqlHelper.escape(requestBody.questionId); 

	
	apiUtils.select(req, res, selectQuery, function(questionResultArr){
		logger.info(' paperAnswer.queryQuestion Result', questionResultArr);

		var questionResult = questionResultArr[0];
		if(questionResult.answer.toLowerCase() === requestBody.answer.toLowerCase()) {
			requestBody.correct = true;
		}
		else {
			requestBody.correct = false;
		}
		logger.info('Update paperAnswer.queryQuestion with request Body', requestBody);
		if(result != null && result.length > 0){
			req.params.id = result[0].id;
			apiUtils.update(req,res, TBL_NAME, requestBody, ['id']);
		}
		else {
			apiUtils.create(req,res, TBL_NAME, requestBody, ['id']);
		}
	});						 
}

/***********************************************/
/* Update one Paper record, based on input
/***********************************************/
exports.update = function (req, res) {
	apiUtils.update(req, res, TBL_NAME, req.body, selectFields);
};

exports.purgePaper = function(req, res){
	logger.debug('Entering paperAnswer.purgePaper with paperId', req.params.paperId);

	var destroyBody = {
		paperId: req.params.paperId,
	};
	apiUtils.destroyBulk(req, res, TBL_NAME, destroyBody);
}

/********************************************/
/* Deletes a Paper from the DB.
/*******************************************/
exports.destroy = function (req, res) {
	apiUtils.destroy(req, res, TBL_NAME, req.body);
};
