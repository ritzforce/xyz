/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/shareExams', require('./api/shareexam'));
  app.use('/api/institutes', require('./api/institute'));
  app.use('/api/userExams', require('./api/userExam'));
  app.use('/templates', require('./api/template'));
  app.use('/api/categories', require('./api/categories'));
  app.use('/api/paperAnswers', require('./api/paperAnswer'));
  app.use('/api/papers', require('./api/paper'));
  app.use('/api/questions', require('./api/question'));
  app.use('/api/exams', require('./api/exam'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
 
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
