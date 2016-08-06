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
    host: '192.186.135.87',
    user : 'alpha101',
    password: 'ciitdc#123',
    database: 'sharma_infotech'
  },

};