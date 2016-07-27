'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/sessionUser');

// Passport Configuration
var user = new User();
require('./local/passport').setup(user, config);

var router = express.Router();

router.use('/local', require('./local'));


module.exports = router;