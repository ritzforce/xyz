'use strict';
var crypto = require('crypto');
var objectAssign = require('object-assign');

var userController = require('./user.controller');

function User(){
    this.email = '';
    this.password = '';
}

/************************************Utility Functions******************************/
function makeSalt() {
	return crypto.randomBytes(16).toString('base64');
}

User.prototype.authenticate = function(enteredPassword) {
   var currentPassword = this.encryptPassword(enteredPassword);
   if(currentPassword === this.password){
       return true;
   }
   return false;
}

User.prototype.encryptPassword = function(password) {
	if (!password || !this.salt) return '';
	var localSalt = new Buffer(this.salt, 'base64');
	return crypto.pbkdf2Sync(password, localSalt, 10000, 64).toString('base64');
}

User.prototype.findById = function(userId,callback){
    var that = this;
    userController.findById(userId, function(err, result){
       if(err){
           callback(err,null);
       }
       var currentUser = objectAssign(that,result[0]);
       callback(null,currentUser);
   });
}

User.prototype.findOne = function(user, callback){
   var that = this;
   userController.findByEmail(user.email, function(err, result){
       if(err){
           callback(err,null);
       }
       var currentUser = objectAssign(that,result[0]);
       callback(null,currentUser);
   });
}

module.exports = User;