'use strict';

var _ = require('lodash');
var sqlHelper = require('./../../config/sqlHelper');
var SqlUtils = require('./../sqlUtils');
var apiUtils = require('./../apiUtils');

var logger = require('./../../logger/logger');

var selectFields = ['id', 'name', 'createdDate', 'lastModifiedDate'];

var TBL_NAME = 'category';

// Get list of categoriess
exports.index = function(req, res) {
	logger.debug('Entering fetch All categories');
	apiUtils.index(req, res, TBL_NAME, selectFields, 'name ASC');
	logger.debug('Exit fetch All categories');
	
};

// Get a single categories
exports.show = function(req, res) {
	logger.debug('Entering get one Single category');
	apiUtils.show(req, res, TBL_NAME, selectFields, 'name ASC');
	logger.debug('Exit get one single Category');
	
};

// Creates a new categories in the DB.
exports.create = function(req, res) {
	logger.debug('Entering create a new category');
	apiUtils.create(req, res, TBL_NAME, req.body, selectFields);
	logger.debug('Exit create a new category');
};

// Updates an existing categories in the DB.
exports.update = function(req, res) {
	logger.debug('Entering update an existing category');
	apiUtils.update(req, res, TBL_NAME, req.body, selectFields);
	logger.debug('Exit update an existing category');

};

// Deletes a categories from the DB.
exports.destroy = function(req, res) {
	logger.debug('Entering delete an existing category');
	apiUtils.destroy(req, res, TBL_NAME, req.body, selectFields);
	logger.debug('Exit delete an existing category');

};

