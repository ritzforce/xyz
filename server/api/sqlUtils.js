var _ = require('lodash');
var util = require('util');
var sqlHelper = require('./../config/sqlHelper');

//QueryUtils acts as the utility class to create objects
function QueryUtils(tblName,limit) {
    this.tblName = tblName;
    this.selectFields = [];
    this.orderByFields = [];
    this.limit = limit ? limit: 200;
    this.whereFields = [];
}

QueryUtils.prototype.appendSelectFields = function(field){
    this.selectFields = appendToArray(this.selectFields, field);
}

QueryUtils.prototype.appendWhereClauses = function(whereClause){
    this.whereFields = appendToArray(this.whereFields, whereClause);
}

QueryUtils.prototype.appendIdClause = function(id){
    this.whereFields = appendToArray(this.whereFields,'id = ' + id);
}

QueryUtils.prototype.appendOrderByFields = function(field){
   this.orderByFields = appendToArray(this.orderByFields, field);
}

QueryUtils.generateInsert = function(connection,jsonBody,callback){
    //var jsonArray = [];
    /*
    Object.keys(jsonBody).forEach(function(key,value){
        jsonArray.push({key : connection.escape(value)});
    });
    */

    connection.query('INSERT INTO ' + this.tblName + ' SET ?',jsonBody,callback);
}

function appendToArray(arr,item){
    if(util.isArray(item)){
        return arr.concat(item);
    }
    arr.push(item);
    return arr;
}

QueryUtils.prototype.getSelectQuery = function(){
    var query = 'SELECT ' + this.selectFields.join(', ') + ' FROM ' + this.tblName;
    if(this.whereFields.length > 0){
        query += ' WHERE ' + this.whereFields.join(' AND ');
    }
    if(this.orderByFields.length > 0) {
        query +=  ' ORDER BY ' + this.orderByFields.join(' ,');
    }
    if(this.limit){
        query += ' LIMIT ' + this.limit;
    }
    return query;
}

module.exports = QueryUtils;