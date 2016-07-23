'use strict';

angular.module('examApp')
  .directive('examDetail', function () {
    return {
      templateUrl: 'components/directives/examDetail/examDetail.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });