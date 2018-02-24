'use strict';

var _ = require('lodash');

var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

var logger = require('./../../logger/logger');

var selectFields = ['id', 'instituteId', 'examId'];

var TBL_NAME = 'shareexam';

exports.indexFetchInstitutes = function (req, res) {
  logger.debug('Entering shareExam.controller.indexFetchInstitutes with ExamID = ' + req.params.examId);
  
  var query = 'SELECT shareexam.id, institute.name, institute.code, institute.active, institute.description ' + 
             ' FROM ' + apiUtils.prefixCode(req, 'shareexam')  + 
             ' INNER JOIN ' + apiUtils.prefixCode(req, 'institute')  + 
             ' ON institute.id = shareexam.instituteId '
  query += ' WHERE shareexam.examId = ' + sqlHelper.escape(req.params.examId);

  apiUtils.select(req, res, query, function (result) {
    logger.debug('Results for indexFetchInstitutes query', result);
    res.json(result);
  });

  logger.debug('Exit shareExam.controller.indexFetchInstitutes ');
}

exports.indexNotAssignedInstitutes = function(req, res){
  logger.debug('Entering shareExam.controller.indexNotAssignedInstitutes with ExamID = ' + req.params.examId);
  var query = 'SELECT institute.id, institute.name, institute.code, institute.active, institute.description ';
  query += ' FROM ' + apiUtils.prefixCode(req, 'institute')  + ' WHERE IsTableCreated = false AND Id NOT IN ';
  query += ' (SELECT instituteId FROM ' + apiUtils.prefixCode(req,'shareexam') + ' WHERE examId = ' + sqlHelper.escape(req.params.examId)  + ')';

  apiUtils.select(req, res, query, function (result) {
    logger.debug('Results for indexNotAssignedInstitutes query', result);
    res.json(result);
  });

  logger.debug('Exit userExam.controller.indexNotAssignedInstitutes ');
  
}

exports.indexFetchExams = function (req, res) {
  logger.debug('Entering shareExam.controller.indexFetchExams with institute' + req.params.instituteId);
  var query = 'SELECT shareexam.id, exam.name, exam.code, exam.category, exam.active ' 
  query += ' FROM ' + apiUtils.prefixCode(req, 'exam') + ' INNER JOIN ' + apiUtils.prefixCode(req, 'shareexam'); 
  query += ' ON exam.id = shareexam.examId '
  query += ' WHERE shareexam.instituteId = ' + sqlHelper.escape(req.params.instituteId);

  apiUtils.select(req, res, query, function (result) {
    logger.debug('Results for indexFetchExams query', result);
    res.json(result);
  });

  logger.debug('Exit userExam.controller.indexByExam ');
}

exports.indexNotAssignedExams = function (req, res) {
  logger.debug('Entering shareExam.controller.indexNotAssignedExams with instituteId' + req.params.instituteId);
  var query = 'SELECT id, name, code, category, active FROM ';
  query +=    apiUtils.prefixCode(req, 'exam')  + ' WHERE id NOT IN ';
  query += ' (SELECT ExamId FROM ' + apiUtils.prefixCode(req, 'shareexam') + ' WHERE instituteId = ' + sqlHelper.escape(req.params.instituteId) + ')';
  
  apiUtils.select(req, res, query, function (result) {
    logger.debug('Results for indexNotAssignedExams query', result);
    res.json(result);
  });

  logger.debug('Exit shareExam.controller.indexNotAssignedExams ');
}

function copyExams(institute, examIdArray, callback) {
  var query = "INSERT INTO ";
  query +=   institute.code + "_exam (id, imageId,timeAllowed, active, name, code, description, category, maxMarks,";
  query +=   "passPercent, createdDate, lastModifiedDate)";  
  query +=  " SELECT id ,imageId,timeAllowed,active, name, code, description, category, maxMarks,passPercent,createdDate, lastModifiedDate ";
  query +=  " FROM admin_exam WHERE id IN (" + examIdArray.join() + ")";
  
  apiUtils.action(query, {}, function(err, result) {
    callback(err, institute, result);
  });
}

function copyQuestions(institute, examIdArray, callback) {
  var query = " INSERT INTO "; 
  query +=  institute.code + "_question (`id`, `name`, `questionText`, `a`, `active`, `b`, `c`, `d`, `e`, `f`, `aCorrect`,";
  query +=  "`bCorrect`, `cCorrect`, `dCorrect`, `eCorrect`, `fCorrect`, `examId`)" ;
  query +=  "SELECT `id`, `name`, `questionText`, `a`, `active`, `b`, `c`, `d`, `e`, `f`, `aCorrect`,"
  query +=  "`bCorrect`, `cCorrect`, `dCorrect`, `eCorrect`, `fCorrect`, `examId`" 
  query +=  " FROM admin_question WHERE examId IN (" + examIdArray.join() + ")" ;
   
  apiUtils.action(query, {}, function(err, result) {
    callback(err, result);
  });
}



function handleLiveCopy(req, res, instituteIdArray, examIdArray, successCount, failureCount) {
   logger.debug('Entering shareExam.handleLiveCopy with instituteId Array & examId Array', instituteIdArray, examIdArray);
    
    var query = 'SELECT id, code from admin_institute Where isTableCreated = true ';
    query += ' AND id IN (' + instituteIdArray.join() +  ')';

    var copyExamQuery = '';

    apiUtils.select(req, res, query, function (result) {
      logger.debug('Results for Live Institutes query', result);
      var masterCount = result.length;
      var count = 0;
      logger.debug('**master Count**' + masterCount);

      // The institute is not live yet
      if (result.length == 0) {
         res.send({success: successCount, failureCount : failureCount});
         return;
      }

      for (var i = 0; i < result.length; i++) {
          copyExams(result[i], examIdArray, function(err, institute, result) {
            if(err) {
              apiUtils.handleError(res, err);
              return;
            }
            copyQuestions(institute, examIdArray, function(err, result){
              if (err) {
                apiUtils.handleError(res, err);
                return;
              }
              count++;
              logger.debug('***counter***' + count);
              if (count >= masterCount) {
                res.send({"ok":"done"});
              }

            });
          });
      }   

    });
   logger.debug('Exit shareExam.handleLiveCopy with instituteId Array and examId Array', instituteIdArray, examIdArray);
}



exports.shareExamAssignments = function (req, res) {
  logger.debug('Entering shareExam.controller.shareExamAssignments with request body = ', req.body);

  var instituteIdString = req.body.instituteId;
  var examIdString = req.body.examId;

  var instituteIdArray = instituteIdString.split(',');
  var examIdArray = examIdString.split(',');

  var maxLength = instituteIdArray.length;
  if(examIdArray.length > maxLength){
    maxLength = examIdArray.length;
  }

  var successCount = 0;
  var failureCount = 0;

  logger.debug('Max Length', maxLength);


  for(var i = 0; i < instituteIdArray.length;i++){
    for(var j = 0; j < examIdArray.length; j++){
      apiUtils.createBulkLoad(req, TBL_NAME, {instituteId: instituteIdArray[i], examId: examIdArray[j]}, function(err, record){
        if(record.success){
          successCount++;
        } 
        else {
          failureCount++;
        }
        if(successCount + failureCount === maxLength){
          //res.send({success: successCount, failureCount : failureCount});
          handleLiveCopy(req, res, instituteIdArray, examIdArray, successCount, failureCount);
        }
      });
    }
  }
  logger.debug('Exit shareExam.controller.shareExamAssignments');
}

// Deletes a user Exam record from DB.
exports.destroy = function (req, res) {
  logger.debug('Entering shareExam.delete an existing institute Id and Exam Id record');
  apiUtils.destroy(req, res, TBL_NAME, req.body, selectFields);
  logger.debug('Exit shareExam.delete ');
};
