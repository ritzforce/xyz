'use strict';

angular.module('examApp')
	.controller('AssignuserCtrl', function ($state, $stateParams, $log, api, notification) {
		var vm = this;
		vm.exam = {};
		vm.users = null;

		vm.user = {};
		vm.exams = null;

		init();

		vm.saveExams = function(){
			var requestBody = {userId: vm.user.id};

			var examIdArray = [];
			for(var i = 0; i < vm.exams.length;i++){
				if(vm.exams[i].isSelected){
					examIdArray.push(vm.exams[i].id);
				}
			}
			requestBody.examId = examIdArray.join(',');
			saveAssigned(requestBody);
		};

		vm.saveUsers = function(){	
			var requestBody = {examId: vm.exam.id};
			var userIdArray = [];
			for(var i = 0; i < vm.users.length;i++){
				if(vm.users[i].isSelected){
					userIdArray.push(vm.users[i].id);
				}
			}
			requestBody.userId = userIdArray.join(',');
			saveAssigned(requestBody);
		};

		vm.cancel = function(){
			if(vm.exam.id){
				$state.go('exam', { examId: vm.exam.id, tab: 'user' });
			}
			if(vm.user.id){
				$state.go('profile',{userId: vm.user.id});
			}
		};

		function saveAssigned(requestBody){
			if(!requestBody.userId) {
				vm.error = 'Please select atleast 1 row';
				return;
			}
			if(!requestBody.examId) {
				vm.error = 'Please select atleast 1 row';
				return;
			}

			api.connectApi(vm, 'Loading...', api.assignUsers.bind(api, requestBody), function (result) {
				if(result && result.failureCount > 0){
					vm.error = 'An internal server error has occurred. Please check the server logs to diagnose the error';
					return;
				}

				if(vm.exam.id) {
					notification.info('User Assignments','User assigned successfully');
					loadUsersForExam();
				}
				if(vm.user.id){
					notification.info('Exam Assignments','Exam assigned successfully');
					loadExamsForUser();
				}
			});
		}

		//Load Users or Exams, based on parameters passed
		function init(){
		
			if($stateParams.examId){
				vm.exam = { id: $stateParams.examId, name : $stateParams.examName};
				loadUsersForExam();
			}
			if($stateParams.userId){
				vm.user = {id: $stateParams.userId, name : $stateParams.userName};
				loadExamsForUser();
			}
		}

		function loadUsersForExam(){
			api.connectApi(vm, 'Loading...', api.getNewUsersForExam.bind(api, vm.exam.id), function (result) {
				vm.users = result;
			});
		}

		function loadExamsForUser(){
			api.connectApi(vm, 'Loading...', api.getNewExamsForUser.bind(api, vm.user.id), function (result) {
				vm.exams = result;
			});
		}

	});
