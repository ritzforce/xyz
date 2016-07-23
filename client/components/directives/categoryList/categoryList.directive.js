'use strict';

angular.module('examApp')
  .directive('categoryList', function () {
    return {
      templateUrl: 'components/directives/categoryList/categoryList.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });