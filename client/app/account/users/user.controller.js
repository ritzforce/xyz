'use strict';

angular.module('examApp')
	.controller('UserCtrl', function (api, $log) {
		var vm = this;
		vm.isLoading = false;
		vm.allUsers = null;

		init();

		function init() {
			getUsers();
		}

		/**********************************AJAX CALLS****************************/
		function getUsers() {
			vm.isLoading = true;

			api.getUsers()
				.then(function (result) {
					console.log(result);
					vm.allUsers = result;
				})
				.catch(function (err) {
					$log.error(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}
	});
