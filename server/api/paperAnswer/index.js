'use strict';

var express = require('express');
var controller = require('./paperAnswer.controller');

var auth = require('../../auth/auth.service');
var router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.upsert);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/paper/:paperId', auth.isAuthenticated(), controller.purgePaper);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);


module.exports = router;