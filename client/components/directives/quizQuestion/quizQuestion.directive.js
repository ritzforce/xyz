'use strict';

angular.module('examApp')
  .directive('quizQuestion', function () {
    return {
      templateUrl: 'components/directives/quizQuestion/quizQuestion.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });