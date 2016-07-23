'use strict';

angular.module('examApp')
  .directive('launchReview', function () {
    return {
      templateUrl: 'components/directives/launchReview/launchReview.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });