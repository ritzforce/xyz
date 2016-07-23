'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('examEdit', {
        url: '/exam/e/:examId',
        templateUrl: 'app/exam/exam.html',
        controller: 'ExamCtrl',
        controllerAs: 'vm'
      })
      .state('exam', {
        url: '/exam/detail/:examId/:tab',
        templateUrl: 'app/exam/examDetail.html',
        controller: 'ExamCtrl',
        controllerAs: 'vm'
      })
      .state('examNoTab', {
        url: '/exam/detail/:examId',
        templateUrl: 'app/exam/examDetail.html',
        controller: 'ExamCtrl',
        controllerAs: 'vm'
      })
      .state('questionAdd', {
        url: '/question/c/:examId',
        templateUrl: 'app/exam/question.html',
        controller: 'QuestionCtrl',
        controllerAs: 'vm'
      })
      .state('questionEdit', {
        url: '/question/e/:questionId',
        templateUrl: 'app/exam/question.html',
        controller: 'QuestionCtrl',
        controllerAs: 'vm'
      })
      .state('question', {
        url: '/question/detail/:questionId',
        templateUrl: 'app/exam/questionDetail.html',
        controller: 'QuestionCtrl',
        controllerAs: 'vm'
      });
      
     
  });