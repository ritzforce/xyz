'use strict';

var express = require('express');
var controller = require('./template.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/backup', controller.backup);
router.get('/lastBackup', auth.hasRole('admin'), controller.lastBackup);
router.get('/download/:fileName', controller.download);
router.get('/:templateType', controller.show);
router.post('/:templateType', auth.hasRole('admin'), controller.upload);


module.exports = router;