'use strict';

angular.module('examApp')
  .directive('institutelist', function () {
    return {
      templateUrl: 'components/directives/instituteList/institutelist.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });

