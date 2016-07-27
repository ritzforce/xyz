'use strict';

angular.module('examApp')
	.controller('LoginCtrl', function ($state, $log, Auth, $location, $window) {

		var vm = this;

		vm.user = {email:'a@a.com',password: 'abc'};
		vm.error = null;

		init();

		//Clear if there is already logged in activity
		function init() {
			Auth.logout();
		}

		vm.login = function () {

			if (!vm.frm.$valid) {
				return;
			}

			Auth.login({
				email: vm.user.email,
				password: vm.user.password
			}).then(function (response) {
					console.log('******Login response In controller***');
					$log.log(response);
					$location.path('/');
			})
			.catch(function (err) {
				$log.log(err);
				vm.error = err.message;
			});


		};
	});
