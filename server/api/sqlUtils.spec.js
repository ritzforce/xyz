var SqlUtils = require('./sqlUtils');

var should = require('should');
var chai = require('chai');
var app = require('../app');

describe('Check Sql Utils function', function() {
  it('it should return a query properly', function() {
     var sqlUtils = new SqlUtils('exam',10);
     sqlUtils.appendSelectFields('id');
     sqlUtils.appendSelectFields(['name','code']);

     sqlUtils.appendWhereClauses('active = true');
     sqlUtils.appendOrderByFields(['id asc','name desc']);

     var query = sqlUtils.getSelectQuery();
     console.log(query);
     
  });
});