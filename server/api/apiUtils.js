'use strict';

var _ = require('lodash');
var sqlHelper = require('./../config/sqlHelper');
var SqlUtils = require('./sqlUtils');

/***********************************************/
/* Get list of records, show All Records based to Admin
/***********************************************/
exports.index = function (req, res, tblName, selectFields, orderByFields, whereByClause) {
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
		console.log('************QUERY***************');
		console.log(sqlUtils.getSelectQuery());

		connection.query(sqlUtils.getSelectQuery(), function(err, rows){
			connection.release();

			if(err) return handleError(res, err);
			console.log(rows);
			return res.json(200, rows);
		});
	});
};

/***********************************************/
/* Get One Single Database record, based on Id field
/***********************************************/
exports.show = function (req, res, tblName, selectFields) {
	
	//Get the sql connection, and fire query
	getConnection(req, res, function (connection) {	
		var selectQuery = getRecordByIdQuery(tblName, selectFields, connection.escape(req.params.id));
		console.log('***************SELECT QUERY************');
		console.log(selectQuery);
		console.log('*************************');

		connection.query(selectQuery, function(err, rows){
			connection.release();

			if(err) return handleError(res, err);
			console.log(rows);
			return res.json(200, rows);
		});
	});
};

/***********************************************/
/* Create one tbl record, based on input
/***********************************************/
exports.create = function (req, res, tblName, requestBody, selectFields, callback) {
	
    getConnection(req, res, function (connection) {
		connection.query('INSERT INTO ' + tblName + ' SET ?', requestBody, function(err,result){
			console.log(err);

			if(err) {
				handleError(res,err);
				return;
			}
			console.log('*****RESULT*******');
			console.log(result);

			var singleRecordQuery = getRecordByIdQuery(tblName, selectFields, result.insertId);
			console.log('****************singleRecord Query********');
			console.log(singleRecordQuery);
			
			connection.query(singleRecordQuery,function(err,result){
				connection.release();
				console.log(err);

				if(err) {
					handleError(res,err);
					return;
				}
				//If a callback is passed, invoke the callback passing the result.
				//Currently only being used in the User class
				if(callback){
					return callback(result);
				}

				return res.json(201,result);
			});
		});
	});
};

/***********************************************/
/* Update one tbl record, based on input
/***********************************************/
exports.update = function (req, res, tblName, requestBody, selectFields) {
	if (requestBody.id) { delete requestBody.id; }

	console.log('***REQUEST BODY******');
	console.log(requestBody);
	console.log('*****req.params.id***' + req.params.id);

	getConnection(req, res, function (connection) {
        var recordId = connection.escape(req.params.id);
        
        var updateQuery = 'UPDATE ' + tblName + ' SET ? WHERE ?';

		connection.query(updateQuery,[requestBody, {id : req.params.id}], function(err, result){
			
            if(err) {
				console.log('***ERROR IN UPDATE****');
				console.log(err);

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
				return res.json(200,result);
			});
		});
	});
};

/********************************************/
/* Deletes a exam from the DB.
/*******************************************/
exports.destroy = function (req, res, tblName, requestBody) {
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
				return res.send(404);
			}
			return res.send(204);
		});
	});
};

/************************************************ */
/*Fire Adhoc Select query
/*************************************************/
exports.select = function(req, res, query, callback){
	getConnection(req, res, function (connection) {
		connection.query(query, function(err, result){
			connection.release();

			if(err){
				console.log('***ERROR OCCURRED****');
				console.log(err);
				handleError(res, err);
				return;
			}
			callback(result);
		});
	});
}

exports.fireRawQuery = function(query,callback) {
	sqlHelper.getConnection(function (err, connection) {
		if(err){
			connection.release();
			return callback(err,null);
		}

		console.log('***Raw Query***', query);

		connection.query(query, function(err, result){
			connection.release();
			console.log('***Raw Query Result****', result);
			callback(err,result);
		});
	});
}

/******************************Private Functions************************************/

function getRecordByIdQuery(tblName,selectFields,id){
	var sqlUtils = new SqlUtils(tblName,5);
	sqlUtils.appendSelectFields(selectFields);

	sqlUtils.appendIdClause(id);
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
		callback(connection);
	});
}