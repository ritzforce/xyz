'use strict';

angular.module('examApp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('backup', {
				url: '/backup',
				templateUrl: 'app/backup/backup.html',
				controller: 'BackupCtrl',
				controllerAs: 'vm',
				admin: true,
			});
	});