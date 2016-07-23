'use strict';

angular.module('examApp')
  .directive('launchQuestion', function () {
    return {
      templateUrl: 'components/directives/launchQuestion/launchQuestion.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });