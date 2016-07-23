'use strict';

angular.module('examApp')
  .directive('userlist', function () {
    return {
      templateUrl: 'components/directives/userlist/userlist.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });