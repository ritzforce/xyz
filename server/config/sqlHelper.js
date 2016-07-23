'use strict';

var mysql = require('mysql');
var config = require('./environment');

console.log('************************');
console.log(config.sql);
console.log('**********************');

var pool  = mysql.createPool({
  connectionLimit : config.sql.maxLimit,
  host            : config.sql.host,
  user            : config.sql.user,
  password        : config.sql.password,
  database        : config.sql.database
});

module.exports = pool;
 