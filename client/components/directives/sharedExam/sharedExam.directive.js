'use strict';

angular.module('examApp')
  .directive('sharedExam', function () {
    return {
      templateUrl: 'components/directives/sharedExam/sharedExam.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });