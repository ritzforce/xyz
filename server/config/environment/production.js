'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  sql: {
    maxLimit: 100,
    host: process.env.SQL_HOST,
    user : process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
  },

  loggly: {
     inputToken: process.env.LOGGLY_INPUT_TOKEN,
     subdomain: process.env.LOGGLY_SUB_DOMAIN,
     tags: process.env.LOGGLY_TAGS 
  },

  log: {
    logLevel : process.env.LOG_LEVEL || 'debug' 
  },

};