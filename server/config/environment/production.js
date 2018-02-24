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
  firebase: {
    type:  process.env.FIREBASE_TYPE,
    storage_bucket: process.env.FIREBASE_STORAGE_BUCKET,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_URL
  },

  log: {
    logLevel : process.env.LOG_LEVEL || 'debug' 
  },

};