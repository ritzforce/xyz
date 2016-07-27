'use strict';

angular.module('examApp')
  .directive('launchCorrectAnswer', function () {
    return {
      templateUrl: 'components/directives/launchCorrectAnswer/launchCorrectAnswer.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });