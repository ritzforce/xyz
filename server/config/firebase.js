'use strict';

var admin = require("firebase-admin");
var path = require("path");
var fs = require("fs");
var mime = require("mime");
var config = require('./environment');

var firebaseConfig = config.firebase;

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: firebaseConfig.storage_bucket
});

function upload(filePath, directory, isPublic, callback){
    var bucket = admin.storage().bucket();
    var fileName = path.basename(filePath);
    var uploadTo = path.join(directory, fileName);
    //var fileMime = mime.lookup(filePath);

    var options = {
        public: isPublic,
        destination: uploadTo
    }

    bucket.upload(filePath, options, function(err, file){
        if(err) {
            return callback(err, null);
        }
        return callback(err, file.metadata);
    });
}

module.exports = {
    uploadLogo: function(filePath, callback) {
        upload(filePath, 'logos', true, callback);
    },
    uploadBackup: function(fileName, callback) {
        upload(fileName, 'backup', false, callback);
    }
};
  