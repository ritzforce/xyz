'use strict';

angular.module('examApp')
  .directive('instituteSettings', function () {
    return {
      templateUrl: 'components/directives/instituteSettings/instituteSettings.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });