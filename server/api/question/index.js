'use strict';

var express = require('express');
var controller = require('./question.controller');

var router = express.Router();

router.get('/exam/launch/:examId',controller.launch);
router.get('/exam/:examId', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;