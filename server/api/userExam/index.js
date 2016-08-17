'use strict';

var express = require('express');
var controller = require('./userExam.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/exam/new/:examId', auth.hasRole('admin'), controller.indexByExamNew);
router.get('/exam/:examId', auth.hasRole('admin'), controller.indexByExam);
router.get('/user/new/:userId', auth.hasRole('admin'), controller.indexByUserNew);
router.get('/user/:userId', auth.hasRole('admin'), controller.indexByUser);


router.post('/assign', auth.hasRole('admin'), controller.addUserExamAssignments);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;