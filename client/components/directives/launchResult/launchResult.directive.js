'use strict';

angular.module('examApp')
  .directive('launchResult', function () {
    return {
      templateUrl: 'components/directives/launchResult/launchResult.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });