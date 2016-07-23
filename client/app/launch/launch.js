'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('launch', {
        url: '/launch/:examId',
        templateUrl: 'app/launch/launch.html',
        controller: 'LaunchCtrl',
        controllerAs: 'vm',
      });
  });