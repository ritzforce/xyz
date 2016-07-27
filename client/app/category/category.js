'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('category', {
        url: '/category',
        templateUrl: 'app/category/category.html',
        controller: 'CategoryCtrl',
        controllerAs: 'vm'
      })
	  .state('categoryEdit', {
        url: '/category/e/:categoryId',
        templateUrl: 'app/category/category.html',
        controller: 'CategoryCtrl',
        controllerAs: 'vm'
      });
  });