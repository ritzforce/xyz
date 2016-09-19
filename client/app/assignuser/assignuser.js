'use strict';

angular.module('examApp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('assignuserExam', {
				url: '/assignuser/exam/:examId/:examName',
				templateUrl: 'app/assignuser/assignuser.html',
				controller: 'AssignuserCtrl',
				controllerAs: 'vm',
				admin: true
			})
			.state('assignuserUser', {
				url: '/assignuser/user/:userId/:userName',
				templateUrl: 'app/assignuser/assignuser.html',
				controller: 'AssignuserCtrl',
				controllerAs: 'vm',
				admin: true
			});

	});