'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('massUpload', {
        url: '/massUpload',
        templateUrl: 'app/massUpload/massUpload.html',
        controller: 'MassUploadCtrl'
      });
  });