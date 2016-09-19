'use strict';

angular.module('examApp')
	.controller('UserProfileCtrl', function ($stateParams, $state, $log, notification, Auth, api) {
		
		var vm = this;
		vm.isLoading = true;
		vm.exams = [];

		init();

		function init(){
			getProfile();
		}

		vm.isAdmin = function(){
			return Auth.isAdmin();
		};

		vm.assignExam = function(){
			$state.go('assignuserUser', {userId : $stateParams.userId, userName: vm.user.name});
		};

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

		vm.deleteUserExam = function(record){
			api.connectApi(vm, 'Deleting...', api.deleteUserExam.bind(api, record.id), function (result) {
				loadExams();
				notification.info('Delete', record.name + ' deleted successfully');
			});
		};

		/**********************************AJAX CALLS****************************/
		function getProfile() {
			api.connectApi(vm,'Loading...',api.getProfile.bind(api, $stateParams.userId), function(result){
				vm.user = result;
				processScore();
			});

			if(Auth.isAdmin() &&  $stateParams.userId){
				loadExams();
			}
		}

		function loadExams(){
			api.connectApi(vm,'Loading...',api.getExamsForUser.bind(api, $stateParams.userId), function(result){
				vm.exams = result;
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
