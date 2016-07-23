var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

/***********************************************/
/* Get list of Questions, show All Questions to Admin
/***********************************************/

var selectFields = ['id', 'paperId', 'questionId', 'correct', 'answer', 'createdDate', 'lastModifiedDate'];

var TBL_NAME = 'paperanswer';


exports.index = function (req, res) {
	var examId = sqlHelper.escape(req.params.examId);

	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC', ['examId = ' + examId]);
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
	var requestBody = req.body;

	var sqlUtils = new SqlUtils(TBL_NAME, 1000);
	sqlUtils.appendSelectFields('id');
	sqlUtils.appendWhereClauses('paperId = ' + sqlHelper.escape(requestBody.paperId));
	sqlUtils.appendWhereClauses('questionId = ' + sqlHelper.escape(requestBody.questionId));

	console.log('****FIRST QUERY*****');
	console.log(sqlUtils.getSelectQuery());

	apiUtils.select(req, res, sqlUtils.getSelectQuery(),function(result){
		console.log('***FIRST RESULT');
		console.log(result);
		//No record exists, need to create a new one
		queryQuestion(req, res, result, requestBody);
	});
};

function queryQuestion(req, res, result, requestBody){
	console.log('***INSIDE QUERY QUESTION*****');


	var selectQuery = 	"select CONCAT(IF(aCorrect,'a',''), IF(bCorrect,'b',''), IF(cCorrect,'c',''), " +
						"IF(dCorrect,'d',''), IF(eCorrect,'e',''), " +
     					"IF(fCorrect,'f','')) AS answer FROM Question WHERE id = " + sqlHelper.escape(requestBody.questionId); 

	console.log('****SECOND QUERY****');
	console.log(selectQuery);

	apiUtils.select(req, res, selectQuery, function(questionResultArr){
		console.log('****SECOND RESULT*******');
		console.log(questionResultArr);

		var questionResult = questionResultArr[0];
		if(questionResult.answer.toLowerCase() === requestBody.answer.toLowerCase()) {
			requestBody.correct = true;
		}
		else {
			requestBody.correct = false;
		}
		console.log('***REQUEST BODY*****FINALLY***');
		console.log(requestBody);

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

/********************************************/
/* Deletes a Paper from the DB.
/*******************************************/
exports.destroy = function (req, res) {
	apiUtils.destroy(req, res, TBL_NAME, req.body);
};
