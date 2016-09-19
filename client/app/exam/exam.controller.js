'use strict';

angular.module('examApp')
	.controller('ExamCtrl', function ($scope, $location, $state, $stateParams, $log, Modal, api, notification) {

		var vm = this;
		vm.exam = {};
		vm.category = [];
		vm.currentTab = 'detail';
		vm.isNew = true;
		vm.saveError = null;
		vm.users = null;

		vm.questions = null;
		vm.isLoading = false;

		vm.setTab = function (activeTabName) {
			vm.currentTab = activeTabName;
			if (vm.currentTab === 'question') {
				vm.loadQuestions();
			}
			if(vm.currentTab === 'user'){
				vm.loadUsersForExam();
			}
			return;
		};

		vm.loadUsersForExam = function(){
			if(vm.users !== null){
				return;
			}
			loadUsersForExam();
		};

		vm.loadQuestions = function () {
			if (vm.questions !== null) {
				return;
			}
			loadQuestionsFromApi($stateParams.examId);
		};

		init();

		function init() {
			getCategories();

			if (!$stateParams.examId) {
				vm.isNew = true;
				vm.exam = api.getExamModel();
			}
			else {
				vm.isNew = false;
				vm.exam = {id : $stateParams.examId};
				loadExam($stateParams.examId);
			}

			if ($stateParams.tab) {
				vm.setTab($stateParams.tab);
			}
		}

		vm.addQuestion = function () {
			$state.go('questionAdd', { examId: vm.exam.id });
		};

		vm.headerText = function () {
			return vm.isNew ? 'New Exam' : 'Edit Exam - ' + vm.exam.name;
		};

		/*************************************Buttons****************************************/
		vm.edit = function () {
			$state.go('examEdit', { examId: vm.exam.id });
		};

		vm.assignUser = function(){
			$state.go('assignuserExam',{examId : vm.exam.id, examName: vm.exam.name});
		};

		vm.launch = function (recordId) {
			$state.go('launch', { examId: recordId });
		};

		vm.delete = Modal.confirm.delete(function (record) {
			deleteExam(record.id);
		});

		vm.deleteQuestion = Modal.confirm.delete(function (record) {
			deleteQuestion(record.id, record);
		});

		vm.deleteUser = function(record){
		   deleteUserExam(record.name, record.id);
		};

		vm.cancel = function () {
			$state.go('main');
		};

		vm.save = function () {
			if (vm.frm.$invalid) {
				return;
			}
			api.connectApi(vm, 'Saving...', api.saveExam.bind(api, vm.exam, vm.isNew), function (result) {
				$state.go('exam', { examId: result[0].id });
			});
		};

		/*********************************************AJAX CALLS********************************/
		function getCategories() {
			vm.isLoading = true;

			api.getCategories()
				.then(function (result) {
					vm.category = result;
				})
				.catch(function (err) {
					$log.error(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}
		function loadQuestionsFromApi(examId) {
			api.connectApi(vm, 'Loading...', api.getAllQuestionsForExamDisplay.bind(api, examId), function (result) {
				vm.questions = result;
			});
		}

		function deleteQuestion(questionId, question) {
			api.connectApi(vm, 'Deleting...', api.deleteQuestion.bind(api, questionId), function (result) {
				loadQuestionsFromApi($stateParams.examId);
				notification.info('Delete', question.name + ' deleted successfully');
			});
		}

		function deleteUserExam(recordName, recordId){
			
			api.connectApi(vm, 'Deleting...', api.deleteUserExam.bind(api, recordId), function (result) {
				loadUsersForExam($stateParams.examId);
				notification.info('Delete', recordName + ' deleted successfully');
			});
		}

		function deleteExam(examId) {
			api.connectApi(vm, 'Deleting...', api.deleteExam.bind(api, examId), function (result) {
				notification.info('Exam', vm.exam.name + ' deleted successfully');
				$state.go('main');
			});
		}

		function loadUsersForExam(){
			api.connectApi(vm, 'Loading...', api.getUsersForExam.bind(api, vm.exam.id), function (result) {
				vm.users = result;
			});
		}

		function loadExam(examId) {
			api.connectApi(vm, 'Loading...', api.getExam.bind(api, examId), function (result) {
				vm.exam = result;
			});
		}
	});
