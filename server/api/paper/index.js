'use strict';

var express = require('express');
var auth = require('../../auth/auth.service');
var controller = require('./paper.controller');

var router = express.Router();

router.get('/result/:paperId', auth.isAuthenticated(), controller.result);
router.get('/review/:paperId', auth.isAuthenticated(), controller.correctAnswersForReview);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id',auth.isAuthenticated(), controller.update);
router.delete('/:id',auth.isAuthenticated(), controller.destroy);

module.exports = router;