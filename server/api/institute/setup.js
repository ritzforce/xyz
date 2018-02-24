'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require("fs");
var replaceAll = require("replaceall");


var multiSqlHelper = require('./../../config/multiSqlHelper');
var logger = require('./../../logger/logger');

exports.getStats = function(code, callback) {

	var sqlFile = getSummaryFile();
	logger.debug('Sql File Path', sqlFile);

	fs.readFile(sqlFile, "utf-8", function(err, contents){
		 if (err) {
		 	logger.error(err);
		 	return callback(err, null);
		 }
		 var sqlQuery = replaceAll("{$name}", code.toLowerCase(), contents);
		 getConnection(function(err, connection){
		 	if (err) {
		 		logger.error(err);
		 		return callback(err, null);
		 	}
		 	connection.query(sqlQuery, function(err, result) {
			 	if (err) {
			 		logger.error(err);
			 		return callback(err, null);
			 	}
			 	logger.debug('Exit setup.summary function', result);
			 	callback(null, result);
		 	
		 	});
		});
	});

}

exports.createTables = function(institute, callback) {
	logger.debug('Entering setup.create Tables function', institute);
	logger.debug(JSON.stringify(institute));


	var sqlFile = getScriptSqlFile();
	logger.debug('Sql File Path', sqlFile);

	fs.readFile(sqlFile, "utf-8", function(err, contents){
		 if (err) {
		 	logger.error(err);
		 	return callback(err, null);
		 }

		 var sqlQuery = replaceAll("{$name}", institute.code.toLowerCase(), contents);
		 sqlQuery = replaceAll("{$instituteId}", institute.id.toString(), sqlQuery);

		 logger.debug("****SQL QUERY****");
		 logger.debug(sqlQuery);

		 getConnection(function(err, connection){
		 	if (err) {
		 		logger.error(err);
		 		return callback(err, null);
		 	}
		 	connection.query(sqlQuery, function(err, result) {
			 	if (err) {
			 		logger.error(err);
			 		return callback(err, null);
			 	}
			 	logger.debug('Exit setup.create Tables function', result);
			 	callback(null, result);

		 	});
		});
	});
}


function getScriptSqlFile() {
	return path.normalize(__dirname + '/newInstitute.sql');
}

function getSummaryFile() {
	return path.normalize(__dirname + '/summary.sql');
}


function getConnection(callback) {
	multiSqlHelper.getConnection(function (err, connection) {
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, connection);
	});
}




