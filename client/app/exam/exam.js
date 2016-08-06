'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('examEdit', {
        url: '/exam/e/:examId',
        templateUrl: 'app/exam/exam.html',
        controller: 'ExamCtrl',
        controllerAs: 'vm',
        admin: true,
      })
      .state('exam', {
        url: '/exam/detail/:examId/:tab',
        templateUrl: 'app/exam/examDetail.html',
        controller: 'ExamCtrl',
        controllerAs: 'vm',
        admin: true,
      })
      .state('examNoTab', {
        url: '/exam/detail/:examId',
        templateUrl: 'app/exam/examDetail.html',
        controller: 'ExamCtrl',
        controllerAs: 'vm',
        admin: true,
      })
      .state('questionAdd', {
        url: '/question/c/:examId',
        templateUrl: 'app/exam/question.html',
        controller: 'QuestionCtrl',
        controllerAs: 'vm',
        admin: true,
      })
      .state('questionEdit', {
        url: '/question/e/:questionId',
        templateUrl: 'app/exam/question.html',
        controller: 'QuestionCtrl',
        controllerAs: 'vm',
        authenticate: true,
        admin: true,
      })
      .state('question', {
        url: '/question/detail/:questionId',
        templateUrl: 'app/exam/questionDetail.html',
        controller: 'QuestionCtrl',
        controllerAs: 'vm',
        authenticate: true,
        admin: true,
      });
      
     
  });