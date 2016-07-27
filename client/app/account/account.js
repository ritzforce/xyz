'use strict';

angular.module('examApp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'app/account/login/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'vm',
				anonymous: true
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'app/account/signup/signup.html',
				controller: 'SignupCtrl',
				controllerAs: 'vm',
				anonymous: true
			})
			.state('settings', {
				url: '/settings',
				templateUrl: 'app/account/settings/settings.html',
				controller: 'SettingsCtrl',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('users', {
				url: '/users',
				templateUrl: 'app/account/users/userList.html',
				controller: 'UserCtrl',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('userNew', {
				url: '/users/e',
				templateUrl: 'app/account/users/userEdit.html',
				controller: 'UserEditCtrl',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('userEdit', {
				url: '/users/e/:userId',
				templateUrl: 'app/account/users/userEdit.html',
				controller: 'UserEditCtrl',
				controllerAs: 'vm',
			})
			
			.state('profile', {
				url: '/profile/:userId',
				templateUrl: 'app/account/users/userProfile.html',
				controller: 'UserProfileCtrl',
				controllerAs: 'vm',
				authenticate: true
			});

	});