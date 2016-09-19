'use strict';

angular.module('examApp')
	.controller('SettingsCtrl', function ($scope, $location, $state, $stateParams, User, Auth, api, notification) {
		var vm = this;

		vm.confirmPassword = null;
		vm.password = null;
		vm.isConfirmPassword = true;
		vm.error = '';
		vm.isResetPassword = false;

		var userId = null;

		init();

		function init() {
			userId = $stateParams.userId;
			if (!userId) {
				vm.isResetPassword = true;
			}
			if ($location.url().indexOf('resetPassword') > -1) {
				vm.isResetPassword = true;
			}
		}


		function validatePassword() {
			vm.isConfirmPassword = (vm.password === vm.confirmPassword);
			return vm.isConfirmPassword;
		}

		/***************************************Buttons***********************************/
		vm.cancel = function () {
			if (userId) {
				$state.go('profile', { userId: userId });
			}
			else {
				$state.go('profile');
			}
		};

		vm.change = function(){
			if(vm.isResetPassword){
				vm.resetPassword();
			}
			else {
				vm.changePassword();
			}
		};

		vm.changePassword = function () {
			if (vm.frm.$invalid) {
				return;
			}
			if (!validatePassword()) {
				return;
			}
			api.connectApi(vm, 'Reseting..', api.resetPassword.bind(api, userId, vm.password), function (result) {
				notification.info('User', 'Password reset successful');
				vm.cancel();
			});
		};

		vm.resetPassword = function () {
			if (vm.frm.$invalid) {
				return;
			}
			if (!validatePassword()) {
				return;
			}
			api.connectApi(vm, 'Reseting..', api.resetPasswordSelf.bind(api, vm.oldPassword, vm.password), function (result) {
				notification.info('User', 'Password reset successful');
				vm.cancel();
			});
		};

		/**************************************************************************************/
	});
