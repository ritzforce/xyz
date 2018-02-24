'use strict';

angular.module('examApp')
  .directive('instituteDetail', function () {
    return {
      templateUrl: 'components/directives/instituteDetail/instituteDetail.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });