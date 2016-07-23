'use strict';

angular.module('examApp')
	.controller('LoginCtrl', function ($log, Auth, $location, $window) {
		var vm = this;

		vm.user = {email: 'a@a.com',password: 'abc'};
		vm.error = null;

		vm.login = function () {

			if (vm.frm.$valid) {
				Auth.login({
					email: vm.user.email,
					password: vm.user.password
				})
				.then(function () {
					// Logged in, redirect to home
					$location.path('/');
				})
				.catch(function (err) {
					$log.log(err);
					vm.error = err.message;
				});
			}
		};
	});
