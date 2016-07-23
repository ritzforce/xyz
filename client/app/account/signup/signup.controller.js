'use strict';

angular.module('examApp')
	.controller('SignupCtrl', function ($log, $state, $location, Auth) {
		var vm = this;
		
		vm.user = {name:'dube',email:'d@d.com',password: 'abc',confirmPassword:'abc'};
		vm.isConfirmPassword = true;

		//$scope.errors = {};


		vm.register = function(){
			console.log('***REgister called***');
			if(vm.frm.$invalid) {
				return;
			}
			if(!validatePassword()){
				return;
			}

			Auth.createUser({
					name: vm.user.name,
					email: vm.user.email,
					password: vm.user.password
			}).then(function(result){
				$log.log(result);
				$state.go('main');
			})
			.catch(function(err){
				$log.log(err);
			});

		};

		function validatePassword() {
			$log.log('***password***' + vm.user.password);
			$log.log('***confirm password***' + vm.user.confirmPassword);

			vm.isConfirmPassword = (vm.user.password === vm.user.confirmPassword);
			return vm.isConfirmPassword;
		}

		/*
		$scope.register = function (form) {
			$scope.submitted = true;

			if (form.$valid) {
				Auth.createUser({
					name: $scope.user.name,
					email: $scope.user.email,
					password: $scope.user.password
				})
					.then(function () {
						// Account created, redirect to home
						$location.path('/');
					})
					.catch(function (err) {
						err = err.data;
						$scope.errors = {};

						// Update validity of form fields that match the mongoose errors
						angular.forEach(err.errors, function (error, field) {
							form[field].$setValidity('mongoose', false);
							$scope.errors[field] = error.message;
						});
					});
			}
		}; */

	});
