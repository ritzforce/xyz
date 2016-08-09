'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var logger = require('./../../logger/logger');
var async = require('async');
var json2csv = require('json2csv');

var apiUtils = require('./../apiUtils');

var Converter = require("csvtojson").Converter;
var mysqlDump = require('mysqldump');
var config = require('../../config/environment');



exports.download = function(req, res){
	logger.debug('Entering template.download for file ', req.params.fileName);
	var filePath = path.join(__dirname, './../../', 'downloads/', req.params.fileName);

	logger.debug('File Path for download', filePath);

	res.download(filePath);
	//res.send();
}

// Get a single template
exports.show = function (req, res) {
	logger.debug('Entering template.show for file Type', req.params.templateType);

	var templateType = req.params.templateType;
	var filePath = path.join(__dirname,templateType + '.csv');

	logger.debug('File Path', filePath);
	try {
		if(fs.statSync(filePath)){
			//do nothing
		}
	}
	catch(err){
		handleError(res, 'File Path does not exist for ' + req.params.templateType);
		return;
	}

	logger.debug('Exiting template.show for file Type', req.params.templateType);
	res.download(filePath);
};

exports.upload = function(req, res){
	logger.debug('Entering template.upload for file Type', req.params.templateType);
	logger.debug('File Information', req.files);

	var file = req.files.file;

	parseFile(req, res, file.path);
}

exports.lastBackup = function(req, res){
	logger.debug('Entering template.lastBackup');
	apiUtils.select(req, res, 'SELECT DATEDIFF(CURDATE(),DATE) AS date FROM Backup ORDER BY DATE ASC LIMIT 1', function(result){
		if(result.length === 0){
			return res.json({'days': -1});
		}
		return res.json({'days': result[0].date});
	})

	logger.debug('Exit template.lastBackup');
}

exports.backup = function(req, res){
	logger.debug('Entering template.backup');
	
	var dt = new Date();

	var fileName = 'Backup_' + dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '.sql';
	var filePath = path.join(__dirname , './../../','downloads', fileName);

	logger.info('File Path for Backup', filePath);
	
	mysqlDump({
		host: config.sql.host,
		user: config.sql.user,
		password: config.sql.password,
		database: config.sql.database,
		dest: filePath
	},function(err){
		// create data.sql file; 
		if(err){
			apiUtils.handleError(res, err);
			return;
		}
		
		apiUtils.create({},{},'backup', {date : new Date()}, ['id','date'],function(){
		});

		res.json({fileName: fileName});
	})
	
	logger.debug('Exit template.backup');
}



function parseFile(req, res, filePath){
	var converter = new Converter({});
	converter.fromFile(filePath,function(err,result){
		if(err){
			return handleError(res, err);
		}
		processRecords(res, req.params.templateType, result);
	});
	logger.debug('Exiting parseFile method');
}

function processRecords(res, tblName, lstRecord){
	logger.debug('Entering template.processRecords for tblName ', tblName, ' with records size', lstRecord.length);	
	
	var processedCount = 0;
	var successCount = 0;
	var failureCount = 0;

	var fileName = tblName + new Date().getTime().toString() + '.csv';

	logger.info('Auto generated file Name for saving the records', fileName);

	for(var i = 0; i < lstRecord.length;i++){
		var currentRecord = lstRecord[i];
		
		apiUtils.createBulkLoad(tblName, currentRecord, function(err, record){
			processedCount++;
			if(record.success){
				successCount++;
			}
			else{
				failureCount++
			}

			if(processedCount === lstRecord.length){
				createCSVForClient(res, fileName, successCount, failureCount, lstRecord);
			}
		});
	}
}

function createCSVForClient(res, fileName, successCount, failureCount, lstRecordArray){
	logger.debug('Entering createCSVFor Client for record Array', lstRecordArray.length);

	var fields = [];
	if(lstRecordArray.length >=1 ){
		fields = Object.keys(lstRecordArray[0]);
	}
	logger.info('Extracted fields ', fields);

	var csv = json2csv({data: lstRecordArray, fields: fields});
	//res.set({"Content-Disposition":"attachment; filename=\"user.csv\""});
	logger.debug('CSV file content to be sent', csv);
	var filePath = path.join(__dirname , './../../','downloads', fileName);

	logger.info('File Path for saving csv', filePath);

	fs.writeFile(filePath, csv, function(err){
		if(err){
			handleError(res, err);
			return;
		}
		res.send({
			success: successCount,
			failure: failureCount,
			fileName: fileName
		});
	})
}

function checkAllDone(lstRecord){
  for(var i = lstRecord.length - 1; i > -1; i--){
	  if(lstRecord[i].Complete) {
		  continue;
	  }
	  return false;
  }
  return true;
}

// Creates a new template in the DB.
function handleError(res, err) {
	return res.send(500, err);
}