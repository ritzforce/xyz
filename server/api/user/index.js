'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

/* Previous code for role based authorization 
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
*/


router.delete('/:id',auth.isAuthenticated(), controller.destroy);

router.get('/me',   auth.isAuthenticated(), controller.me);
router.get('/myprofile',auth.isAuthenticated(), controller.myprofile);
router.get('/profile/:id',auth.isAuthenticated(), controller.profile);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/', auth.isAuthenticated(),controller.index);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);

router.post('/', controller.create);
//router.put('/:id', controller.update);

module.exports = router;
