'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('institutes', {
        url: '/institutes',
        templateUrl: 'app/institute/institute.html',
        controller: 'InstituteCtrl',
        controllerAs: 'vm',
        superadmin: true,
        authenticate: true,
      })
      .state('instituteDetail', {
        url: '/institutes/detail/:instituteId',
        templateUrl: 'app/institute/instituteDetail.html',
        controller: 'InstituteCtrl',
        controllerAs: 'vm',
        superadmin: true,
        authenticate: true,
      })
      .state('instituteNew', {
        url: '/institutes/e',
        templateUrl: 'app/institute/instituteEdit.html',
        controller: 'InstituteEditCtrl',
        controllerAs: 'vm',
        authenticate: true,
        superadmin: true
      })
      .state('instituteEdit', {
        url: '/institutes/e/:instituteId',
        templateUrl: 'app/institute/instituteEdit.html',
        controller: 'InstituteEditCtrl',
        controllerAs: 'vm',
        superadmin: true,
        authenticate: true,     
      });
  });