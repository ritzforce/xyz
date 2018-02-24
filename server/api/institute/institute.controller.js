'use strict';

var fs = require("fs");
var _ = require('lodash');
var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');
var setup = require('./setup.js');
var logger = require('./../../logger/logger');
var userController = require('./../user/user.controller');
var firebase = require('./../../config/firebase');


var selectFields = ['id','isTableCreated', 'name','code','description','phone','email','address','active','createdDate', 'lastModifiedDate'];

var TBL_NAME = 'institute';

// Get list of institutes
exports.index = function(req, res) {
  logger.debug('Entering fetch All Institutes');
  apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC');
  logger.debug('Exit fetch All Institutes');
};

exports.getCurrentInstitute = function(req, res) {
  logger.debug("********Entering fetch Current Institute*******");
  var query = "SELECT name,address, phone, email, logo from admin_institute where code = ";

  if (req.user && req.user.code) {
    var newQuery = query + sqlHelper.escape(req.user.code);

    apiUtils.select(req, res, newQuery, function(result) {
       return res.json(200, result);
    }); 
  }
  logger.debug('Existing fetch Current Institute');
}

exports.getLogo = function(req, res) {
  logger.debug('Entering Institute After Login');
  var includeLogo = selectFields;
  includeLogo.push('logo');

  apiUtils.show(req, res, TBL_NAME, includeLogo, 'name ASC');

  logger.debug('Exiting Institute After Login');
};

// Get a single institute
exports.show = function(req, res) {
  logger.debug('Entering get one Single Institute');
  apiUtils.show(req, res, TBL_NAME, selectFields, 'name ASC');
  logger.debug('Exit get one single Institute');
};

exports.uploadLogo = function(req, res) {
  logger.debug('Entering Upload Logo function');
  var body = req.body;
  var file = req.files.file;

  req.params.id = req.body.instituteid;

  logger.debug('****file.type**' + file.type);
  logger.debug('***file****' + file.path);

  fs.readFile(file.path, function(err, data) {
     //var str = new Buffer(data).toString('base64');
      var finalStr = 'test'; // "data:" + file.type  + ";base64," + str;
      firebase.uploadLogo(file.path, function(err, response){
        if (err) {
            console.log('***ERROR****')
            console.log(err);
            handleError(res, err);
        }
        console.log(response);
        finalStr = response.mediaLink;
        return apiUtils.update(req, res, TBL_NAME, {logo: finalStr}, selectFields);
      });  
  });
}

// Creates a new institute in the DB.
exports.create = function(req, res) {
  logger.debug('Entering create a new institute');
  if(req.body.code) {
    req.body.code = req.body.code.toLowerCase();
  }

  apiUtils.create(req, res, TBL_NAME, req.body, selectFields);
  logger.debug('Exit create a new institute');
};

exports.stats = function(req, res) {
  if (req.user && req.user.code) {
    setup.getStats(req.user.code.toLowerCase(), function(err, result) {
        if (err) {
            handleError(res, err);
            return;
          }
          return res.json(200, parseStatResult(result));
      });
  } 
  else {
    handleError(res, 'No user or code found');
    return;
  }
}

exports.allStats = function(req, res) {
  logger.debug('Entering Insitute.controller allStats');

  apiUtils.getRecordById(apiUtils.prefixCode(req, TBL_NAME), selectFields, req.params.id,
      function(err, result) {
        if (err) {
          handleError(res, err);
          return;
        }
        var institute = result;
        if (Array.isArray(result)) {
            institute = result[0];
        }

        setup.getStats(institute.code, function(err, result) {
          if (err) {
            handleError(res, err);
            return;
          }

          return res.json(200, parseStatResult(result));

        });

      });

  logger.debug('Exiting Institute.controller allStats');
}

exports.reactivate = function(req, res) {
   logger.debug('Entering Insitute.controller reactivate');
    apiUtils.getRecordById(apiUtils.prefixCode(req, TBL_NAME), selectFields, req.params.id,
        function(err, result) {
           if (err) {
            handleError(res, err);
            return;
          }
          var institute = result;
          if (Array.isArray(result)) {
            institute = result[0];
          }
          reactivateUserTable(institute.code, function(err, result) {
             if (err) {
               handleError(res, err);
               return;
             }
          });
         
          institute.active = true;
          return apiUtils.update(req, res, TBL_NAME, institute, selectFields);
        });
   logger.debug('Exit Insitute.controller deactivate');
}

exports.deactivate = function(req, res) {
   logger.debug('Entering Insitute.controller deactivate');
    apiUtils.getRecordById(apiUtils.prefixCode(req, TBL_NAME), selectFields, req.params.id,
        function(err, result) {
           if (err) {
            handleError(res, err);
            return;
          }
          var institute = result;
          if (Array.isArray(result)) {
            institute = result[0];
          }
          deactivateUserTable(institute.code, function(err, result) {

          });
         
          institute.active = false;
          return apiUtils.update(req, res, TBL_NAME, institute, selectFields);
        });
   logger.debug('Exit Insitute.controller deactivate');
}

exports.resetAdminPassword = function(req, res) {
   logger.debug('Entering reset admin password');
   apiUtils.getRecordById(apiUtils.prefixCode(req, TBL_NAME), selectFields, req.params.id,
      function(err, result) {
        if (err) {
          handleError(res, err);
          return;
        }
        var institute = result;
        if (Array.isArray(result)) {
          institute = result[0];
        }
        logger.debug('****req.body****', req.body);
        var user = userController.createAdminUser(req.body.password);

        logger.debug('***NEW USER *****', user);
        updateAdminUser(institute.code, user, function(err, result) {
          if(err) {
            handleError(res, err);
            return;
          }
          return apiUtils.update(req, res, TBL_NAME, institute, selectFields);
        });


      });
   logger.debug('Exit reset admin password');
}

exports.activate = function(req, res) {
  logger.debug('Entering activating a new institute');
  
  apiUtils.getRecordById(apiUtils.prefixCode(req, TBL_NAME), selectFields, req.params.id, 
  function(err, result) {
     if (err) {
       handleError(res, err);
       return;
     }

     var institute = result;
     if (Array.isArray(result)) {
        institute = result[0];
     }

     setup.createTables(institute, function(err, result) {
        if (err) {
          handleError(res, err);
          return;
        }
        var user = userController.createAdminUser(req.body.password);

        createAdminUser(institute.code, user, function(err, result) {
          if(err) {
            handleError(res, err);
            return;
          }
        });

        institute.isTableCreated = true;
        institute.active = true;

        return apiUtils.update(req, res, TBL_NAME, institute, selectFields);
     });
  });
  logger.debug('Exit activating a new institute');
}

// Updates an existing institute in the DB.
exports.update = function(req, res) {
  logger.debug('Entering update an existing institute');
  
  apiUtils.update(req, res, TBL_NAME, req.body, selectFields);
  logger.debug('Exit update an existing institute');
};

// Deletes a institute from the DB.
exports.destroy = function(req, res) {
  logger.debug('Entering delete an existing institute');
  apiUtils.destroy(req, res, TBL_NAME, req.body, selectFields);
  logger.debug('Exit delete an existing institute');
};

function deactivateUserTable(code, callback) {
    var query = "RENAME Table " + code + "_user To del_" + code + "_user";
    apiUtils.action(query, null, callback);
}

function reactivateUserTable(code, callback) {
   var query = "RENAME Table del_" + code + "_user To " + code + "_user";
   apiUtils.action(query, null, callback);
}

function updateAdminUser(code, user, callback) {


  var resetUser = {};
  resetUser.password = user.password;
  resetUser.salt = user.salt;

  var query = "UPDATE "  + code + "_user SET ? WHERE role = 'admin' ";
  apiUtils.action(query, resetUser, callback);
}

function createAdminUser(code, user, callback) {
  var query = 'INSERT IGNORE INTO ' + code + '_user SET ?';
  apiUtils.action(query, user, callback);
}

function parseStatResult(result) {

  logger.debug('****parseStatResult', result);

  var finalResult = { summary:[], user5:[], exam5: [] };
  for(var i = 0; i < result.length; i++) {
    if(result[i].Summary == 'Summary') {
      finalResult.summary.push({ field: result[i].Exam, count: result[i].Count});
    }
    if(result[i].Summary == 'User') {
      finalResult.user5.push({ user: result[i].Exam, count: result[i].Count});
    }
    if(result[i].Summary == 'Exam') {
      finalResult.exam5.push({ exam: result[i].Exam, count: result[i].Count});
    }
  }
  return [finalResult];

}


function handleError(res, err) {
  logger.error(err);
  return res.send(500, err);
}