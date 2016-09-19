var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

var logger = require('./../../logger/logger');

/***********************************************/
/* Get list of Questions, show All Questions to Admin
/***********************************************/

var selectFields = ['id', 'examId', 'result', 'percent', 'status', 'userId', 'createdDate', 'lastModifiedDate'];

var TBL_NAME = 'paper';


exports.correctAnswersForReview = function(req, res){
	logger.debug('Entering correct Answers For Review');
	var query = generateQueryForCorrectAnswerReview(req.params.paperId);

	apiUtils.select(req, res, query, function(result){
		logger.debug('Exit correct Answers For Review', result);
		res.json(200,result);
	});
}

function generateQueryForCorrectAnswerReview(paperId){
	var queryArr = [];
	
	queryArr.push(' SELECT * FROM ' );
	queryArr.push(' (select  paper.Id as pId, question.id As qId, question.questionText, ');
	queryArr.push(' question.a, question.b, question.c, question.d, question.e, ');
	queryArr.push(' question.aCorrect, question.bCorrect, question.cCorrect, question.dCorrect, question.eCorrect, ');
	queryArr.push(' aCorrect + bCorrect + cCorrect + dCorrect + eCorrect + fCorrect As length  ');
	queryArr.push(' from exam JOIN question ON (question.examId = exam.id)   ');
	queryArr.push(' JOIN paper ON (paper.examId = exam.id)  ');
	queryArr.push(' WHERE paper.id = ' + sqlHelper.escape(paperId) + ')');
	queryArr.push(' AS Q LEFT JOIN paperAnswer ON (pid = paperAnswer.paperId ');
	queryArr.push(' AND qId = questionId ) ');  

	return queryArr.join(' ');
}


exports.result = function (req, res) {
	logger.debug('Entering paperController.result with paperId ', req.params.paperId);
	getPaperDetails(req, res, req.params.paperId);
}

exports.getPapersForUser = function(userId,callback){
	var queryArr =  [];
	queryArr.push(' select paper.id,exam.passPercent, examId, exam.name, exam.maxMarks, result, percent, status, paper.timeTaken, paper.lastModifiedDate ');
	queryArr.push(' FROM exam,paper ');
	queryArr.push(' WHERE exam.id = paper.examId ');
	queryArr.push(' AND userId = ' + sqlHelper.escape(userId));
	queryArr.push(' ORDER BY  paper.lastModifiedDate  DESC, exam.name ASC ');


	apiUtils.fireRawQuery(queryArr.join(' ') ,callback);
};

function getPaperDetails(req, res, paperId) {
	logger.debug('Entering paperController.getPaperDetails with paperId ', paperId);
	var queryArr = [];

	queryArr.push('select examId, paperId,count(*) As correctAnswer from paper, paperAnswer ');
	queryArr.push(' WHERE paper.id = paperAnswer.paperid ');
	queryArr.push(' AND correct = true ');
	queryArr.push(' AND paperId = ' + paperId);
	queryArr.push(' GROUP BY examId, paperId ');
	
	var query = queryArr.join(' ');	
	logger.info('Query for Paper Result', query);

	apiUtils.select(req, res, query, function (paperResult) {
		logger.info('Paper Result Query Results ', paperResult);

		if (paperResult && paperResult.length > 0) {
			logger.debug('User has answered at least one question, fetch exam details');
			getExamDetails(req, res, paperResult[0]);
		}
		else {
			updatePaperResult(req, res, paperId, 0, 0)
		}
	});
}

function updatePaperResult(req, res, paperId, correctPercent, result) {
	logger.debug('Entering paperController.updatePaperResult with paperId', paperId, ' correctPercent', correctPercent, 'result', result);

	var paper = {
		id: paperId,
		percent: correctPercent, //Num of correct answers
		result: result, //Pass or fail
		timeTaken : req.params.timeTaken,
		status: 'Complete'
	}
	req.params.id = paperId;
	apiUtils.update(req, res, 'paper', paper, ['id', 'percent', 'result', 'status', 'timeTaken']);
}

function getExamDetails(req, res, paperResult) {
	logger.debug('Entering paperController.getExamDetails with paperResult', paperResult);

	var query = 'SELECT maxMarks,passPercent,count(*) As questionCount FROM exam, question' +
		' WHERE question.examId = exam.id ' +
		' AND exam.id = ' + sqlHelper.escape(paperResult.examId) +
		' AND question.active = true ' +
		' Group by maxMarks, passPercent ';

	logger.info("Exam Details Query", query);

	apiUtils.select(req, res, query, function (examDetails) {
		logger.info('Exam Details Result', result);	

		if (examDetails && examDetails.length > 0) {
			var currentExam = examDetails[0];
			var correctPercent = ((paperResult.correctAnswer * 1.0) / currentExam.questionCount) * 100;
			var result = 0;
			if (correctPercent > currentExam.passPercent) {
				result = 1;
			}
			updatePaperResult(req, res, paperResult.paperId, correctPercent, result);
		}
	});
}

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
/* Create one Paper record, based on input
/***********************************************/
exports.create = function (req, res) {
	var paperBody = req.body;
	var currentUser = req.user;

	paperBody.userId = currentUser.id;
	
	apiUtils.create(req, res, TBL_NAME, paperBody, selectFields);
};

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
