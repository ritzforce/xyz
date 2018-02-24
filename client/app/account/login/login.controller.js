'use strict';

angular.module('examApp')
	.controller('LoginCtrl', function ($state, $log, Auth, $location, notification) {

		var vm = this;

		vm.user = { email: '', password: '', code: '' };
		vm.error = null;
		vm.isLoading = false;

		init();

		//Clear if there is already logged in activity
		function init() {
			Auth.logout();
		}

		vm.login = function () {

			if (!vm.frm.$valid) {
				return;
			}
			notification.notify('Logging in...');
			vm.isLoading = true;
			Auth.login({
				email: vm.user.email,
				password: vm.user.password,
				code: vm.user.code

			}).then(function (response) {
				$location.path('/');
			})
			.catch(function (err) {
				//$log.error(err);
				if (err.status == 401) {
					vm.error = 'Invalid Login.The username or password or institute code is incorrect';
				}
			})
			.finally(function () {
				notification.hide();
				vm.isLoading = false;
			});
		};
	});
