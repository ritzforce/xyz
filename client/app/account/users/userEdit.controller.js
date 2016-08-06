'use strict';

angular.module('examApp')
	.controller('UserEditCtrl', function ($state, $stateParams, $location,  $log, api, notification) {
		var vm = this;
		vm.user = {active: 1};
		vm.editMode = null;
		vm.headerText = null;

		vm.confirmPassword = null;
		vm.error = '';
		vm.isConfirmPassword = true;

		init();
		function init() {
			vm.editMode = true;
			if ($stateParams.userId) {
				getUser($stateParams.userId);
			}
			else {
				vm.headerText = 'New user';
				vm.editMode = false;
			}
		}

		function getUser(userId) {
			api.connectApi(vm, 'Loading...', api.getUser.bind(api, userId), function (result) {
				vm.user = result;
				vm.headerText = 'Edit user - ' + vm.user.name;
			});
		}

		/***********************************************************************************/
		vm.save = function () {
			
			if(vm.frm.$invalid){
				return;
			}

			validatePassword();

			if(!vm.editMode && !vm.isConfirmPassword){
				return;
			}
			api.connectApi(vm, 'Saving..', api.saveUser.bind(api, vm.user), function (result) {
				var message = vm.editMode ? ' saved' : 'created';
				notification.success('User','User ' + message + ' successfully');
				$state.go('users');
			});
		};


		function validatePassword() {
			vm.isConfirmPassword = (vm.user.password === vm.confirmPassword);
			return vm.isConfirmPassword;
		}

		vm.cancel = function () {
			$state.go('users');
		};
	});
