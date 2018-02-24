'use strict';

angular.module('examApp')
  .directive('allStats', function () {
    return {
      templateUrl: 'components/directives/allStats/allStats.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });