'use strict';

var express = require('express');
var auth = require('../../auth/auth.service');
var controller = require('./shareexam.controller');

var router = express.Router();

router.get('/institute/new/:instituteId', auth.hasRole('superadmin'), controller.indexNotAssignedExams);
router.get('/institute/:instituteId', auth.hasRole('superadmin'), controller.indexFetchExams);

router.get('/exam/new/:examId', auth.hasRole('superadmin'), controller.indexNotAssignedInstitutes);
router.get('/exam/:examId', auth.hasRole('superadmin'), controller.indexFetchInstitutes);

router.post('/assign', auth.hasRole('superadmin'), controller.shareExamAssignments);
router.delete('/:id', auth.hasRole('superadmin'), controller.destroy);

module.exports = router;