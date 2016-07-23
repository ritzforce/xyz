'use strict';

angular.module('examApp')
  .directive('launchPrep', function () {
    return {
      templateUrl: 'components/directives/launchPrep/launchPrep.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });