'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stats', {
	        url: '/stats',
	        templateUrl: 'app/stats/stats.html',
	       	controller: 'StatsCtrl',
			controllerAs: 'vm',
			admin: true
      });

  });