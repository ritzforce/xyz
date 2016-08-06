'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/exam-dev'
  },

  sql: {
    maxLimit: 100,
    host: '127.0.0.1',
    user : 'root',
    password: '',
    database: 'examination'
  },
  seedDB: false
};
