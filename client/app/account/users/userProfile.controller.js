'use strict';

angular.module('examApp')
	.controller('UserProfileCtrl', function ($stateParams, $state, $log, Auth, api) {
		
		var vm = this;
		vm.isLoading = true;

		init();

		function init(){
			getProfile();
		}

		vm.resetPassword = function(){
			var currentUser = Auth.getCurrentUser();
		
			if(vm.user.id === currentUser.id) {
				$state.go('resetPassword');
				return;
			}

			if(Auth.isAdmin()){
				$state.go('settings', {userId: $stateParams.userId});
			}
			else {
				$state.go('resetPassword');
			}
		};

		/**********************************AJAX CALLS****************************/
		function getProfile() {
	
			api.connectApi(vm,'Loading...',api.getProfile.bind(api, $stateParams.userId), function(result){
				vm.user = result;
				processScore();
			});

		}

		function processScore(){
			if(!vm.user.exams){
				return;
			}
			for(var i = 0; i < vm.user.exams.length;i++){
				var currentExam = vm.user.exams[i];
				currentExam.computedScore = Math.round((currentExam.maxMarks * currentExam.percent) / 100);
			}
		}

	});
