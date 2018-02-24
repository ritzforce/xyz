'use strict';

var express = require('express');
var controller = require('./institute.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//auth.isAuthenticated()
router.get('/', auth.hasRole('superadmin'), controller.index);
router.get('/:id',auth.hasRole('superadmin'), controller.show);
router.get('/stats/:id', auth.hasRole('admin'), controller.stats);
router.get('/allStats/:id', auth.hasRole('superadmin'), controller.allStats);
router.get('/logo/:id', auth.hasRole('superadmin'), controller.getLogo);
router.get('/current/details',auth.isAuthenticated(), controller.getCurrentInstitute);

router.post('/logoupload', auth.hasRole('superadmin'), controller.uploadLogo);
router.post('/activate/:id', auth.hasRole('superadmin'),controller.activate);
router.post('/reactivate/:id',  auth.hasRole('superadmin'),controller.reactivate);
router.post('/deactivate/:id', auth.hasRole('superadmin'),controller.deactivate);
router.post('/resetAdminPassword/:id', auth.hasRole('superadmin'), controller.resetAdminPassword);
router.post('/', auth.hasRole('superadmin'), controller.create);

router.put('/:id',auth.hasRole('superadmin'), controller.update);
router.patch('/:id', auth.hasRole('superadmin'), controller.update);
router.delete('/:id', auth.hasRole('superadmin'), controller.destroy);

module.exports = router;