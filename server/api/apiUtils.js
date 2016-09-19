'use strict';

var _ = require('lodash');
var sqlHelper = require('./../config/sqlHelper');
var SqlUtils = require('./sqlUtils');

var logger = require('./../logger/logger');

/***********************************************/
/* Get list of records, show All Records based to Admin
/***********************************************/
exports.index = function (req, res, tblName, selectFields, orderByFields, whereByClause) {

	logger.debug('Entering apiUtils.index with parameters with ', "table", tblName, "for select fields ", selectFields,
	            "orderBy clause", orderByFields, 
	            "where Clause", whereByClause);

	var sqlUtils = new SqlUtils(tblName, 1000);

	//Get the sql connection, and fire query
	getConnection(req, res, function (connection) {

		sqlUtils.appendSelectFields(selectFields)
		if(orderByFields) {
			sqlUtils.appendOrderByFields(orderByFields);
		}

        if(whereByClause){
            sqlUtils.appendWhereClauses(whereByClause);
        }
		var selectQuery = sqlUtils.getSelectQuery();
		logger.info('*QUERY*', selectQuery);
	
		connection.query(selectQuery, function(err, rows){
			connection.release();

			if(err) return handleError(res, err);
			logger.info('Query Result size', rows.length);
			logger.debug('Query Result', rows);
			return res.json(200, rows);
		});
	});
};

/***********************************************/
/* Get One Single Database record, based on Id field
/***********************************************/
exports.show = function (req, res, tblName, selectFields) {
	logger.debug('Entering apiUtils.show with parameters with ', "table", tblName, "for select fields ", selectFields);

	//Get the sql connection, and fire query
	getConnection(req, res, function (connection) {	
		var selectQuery = getRecordByIdQuery(tblName, selectFields, connection.escape(req.params.id));

		logger.info('Select Query fired', selectQuery);

		connection.query(selectQuery, function(err, rows){
			connection.release();

			if(err) return handleError(res, err);
			logger.debug('Exit apiUtils.show with result', rows);

			return res.json(200, rows);
		});
	});
};


exports.createBulkLoad = function(tblName, record, callback){
	logger.debug('Entering apiUtils.create with bulk load option', record);
	
	sqlHelper.getConnection(function (err, connection) {

		if(err){
			callback(err,null);
			return;
		}
		connection.query('INSERT INTO ' + tblName + ' SET ?', record, function(err, result){
			record.Complete = true;

			if(err){
				logger.error('Error occurred', err);
				record.error = JSON.stringify(err);
				record.success = false;
				callback(null,record);
				return;
			}

			record.id = result.insertId;
			record.success = true;
			callback(null, record);
		});
	});
	logger.debug('Exiting apiUtils.create with bulk load option');
}


/***********************************************/
/* Create one tbl record, based on input
/***********************************************/
exports.create = function (req, res, tblName, requestBody, selectFields, callback) {
	logger.debug('Entering apiUtils.create with parameters with ', "table", tblName, "for select fields ", selectFields);
	logger.debug('apiUtils.create with request Body', requestBody);

	if (requestBody.createdDate) { delete requestBody.createdDate;} 
	if (requestBody.lastModifiedDate) {delete requestBody.lastModifiedDate; }

    getConnection(req, res, function (connection) {
		connection.query('INSERT INTO ' + tblName + ' SET ?', requestBody, function(err,result){
			
			logger.debug('***After insertion');
			logger.debug(err);
			logger.debug(result);

			if(err) {
				handleError(res,err);
				return;
			}
			logger.info('Record Created ', result);

			var singleRecordQuery = getRecordByIdQuery(tblName, selectFields, result.insertId);
			logger.info("Query the recently created record with query ", singleRecordQuery);	

			connection.query(singleRecordQuery,function(err,result){
				connection.release();
				
				if(err) {
					handleError(res,err);
					return;
				}
				//If a callback is passed, invoke the callback passing the result.
				//Currently only being used in the User class
				if(callback){
					return callback(result);
				}

				logger.debug('Exit apiUtils.create with result', result);
				return res.json(201,result);
			});
		});
	});
};

/***********************************************/
/* Update one tbl record, based on input
/***********************************************/
exports.update = function (req, res, tblName, requestBody, selectFields) {
	logger.debug('Entering apiUtils.update with parameters for ', "table", tblName,
	              "for select fields ", selectFields,
				  "with request body", requestBody);

	if (requestBody.id) { delete requestBody.id; }
	if (requestBody.createdDate) { delete requestBody.createdDate;} 
	if (requestBody.lastModifiedDate) {delete requestBody.lastModifiedDate; }

	
	getConnection(req, res, function (connection) {
        var recordId = connection.escape(req.params.id);
		logger.info('Updating record with id ', req.params.id);
        
        var updateQuery = 'UPDATE ' + tblName + ' SET ? WHERE ?';

		connection.query(updateQuery,[requestBody, {id : req.params.id}], function(err, result){
			
            if(err) {
				logger.error(err);
				connection.release();
				handleError(res,err);
				return;
			}
			if(result.affectedRows === 0) {
				connection.release();
				return res.send(404);
			}
			var singleRecordQuery = getRecordByIdQuery(tblName, selectFields, req.params.id);
			
			connection.query(singleRecordQuery,function(err,result){
				connection.release();
				if(err) {
					handleError(res,err);
					return;
				}
				logger.debug('Exit apiUtils.update with result', result);
				return res.json(200,result);
			});
		});
	});
};

exports.destroyBulk = function(req, res, tblName, requestBody){
	logger.debug('Entering apiUtils.destroyBulk with tblName', tblName, ' & request body', requestBody);
	
	getConnection(req, res, function (connection) {
        var deleteQuery = 'DELETE FROM ' + tblName + ' WHERE ?'; 
		connection.query(deleteQuery, requestBody, function(err, result){
			connection.release();
			if(err) {
				handleError(res,err);
				return;
			}
			if(result.affectedRows === 0) {
				logger.debug('Exit apiUtils.destroyBulk with not found result', result);
				return res.send(404);
			}
			logger.debug('Exit apiUtils.destroyBulk with with success', result);
			return res.send(204);
		});
	});
}

/********************************************/
/* Deletes a exam from the DB.
/*******************************************/
exports.destroy = function (req, res, tblName, requestBody) {
	logger.debug('Entering apiUtils.destroy with tblName', tblName, ' & request body', requestBody);

	if (requestBody.id) { delete requestBody.id; }
	
	getConnection(req, res, function (connection) {
        var deleteQuery = 'DELETE FROM ' + tblName + ' WHERE ?'; 
		connection.query(deleteQuery, {id :req.params.id}, function(err, result){
			connection.release();
			if(err) {
				handleError(res,err);
				return;
			}
			if(result.affectedRows === 0) {
				logger.debug('Exit apiUtils.destroy with not found result', result);
				return res.send(404);
			}
			logger.debug('Exit apiUtils.destroy with with success', result);
			return res.send(204);
		});
	});
};

/************************************************ */
/*Fire Adhoc Select query
/*************************************************/
exports.select = function(req, res, query, callback){
	logger.debug('Entering apiUtils.select with query', query);

	getConnection(req, res, function (connection) {
		connection.query(query, function(err, result){
			connection.release();

			if(err){
				logger.error(err);
				handleError(res, err);
				return;
			}
			logger.debug('Exit apiUtils.select with result', result);
			callback(result);
		});
	});
}

exports.fireRawQuery = function(query,callback) {
	logger.debug('Entering apiUtils.fireRawQuery with query', query);

	sqlHelper.getConnection(function (err, connection) {
		if(err){
			if(connection){
				connection.release();
			}
			return callback(err,null);
		}

		logger.info('*Raw Query*', query);

		connection.query(query, function(err, result){
			connection.release();
			logger.debug('*Raw Query Result**', result);

			logger.debug('Exit apiUtils.fireRawQuery with result', result);
			callback(err,result);
		});
	});
}

exports.handleError = function(res, err){
	handleError(res, err);
}

/******************************Private Functions************************************/

function getRecordByIdQuery(tblName,selectFields,id){
	var sqlUtils = new SqlUtils(tblName,5);
	sqlUtils.appendSelectFields(selectFields);

	sqlUtils.appendIdClause(id);
	return sqlUtils.getSelectQuery();
}

function handleError(res, err) {
	logger.error(err);
	return res.send(500, err);
}

function getConnection(req, res, callback) {
	sqlHelper.getConnection(function (err, connection) {
		if (err) {
			handleError(res, err);
			return;
		}
		callback(connection);
	});
}