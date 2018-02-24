'use strict';

angular.module('examApp')
	.controller('SignupCtrl', function ($log, $state, $location,api) {
		var vm = this;
		vm.user = {};
		vm.success = false;
		vm.isConfirmPassword = true;

		vm.register = function(){
		
			if(vm.frm.$invalid) {
				return;
			}
			if(!validatePassword()){
				return;
			}

			var newUser = {	
				name: vm.user.name,
				email: vm.user.email,
				password: vm.user.password,
				code: vm.user.code
			};

			api.connectApi(vm, 'Creating User...', api.signUp.bind(api, newUser),function(response){
				vm.success = true;
				vm.user = {};
			});
		};

		function validatePassword() {
			vm.isConfirmPassword = (vm.user.password === vm.user.confirmPassword);
			return vm.isConfirmPassword;
		}

	});
