'use strict';

angular.module('examApp')
	.controller('ExamCtrl', function ($scope, $location, $state, $stateParams, $log, Modal, api, notification) {

		var vm = this;
		vm.exam = {};
		vm.category = [];
		vm.currentTab = 'detail';
		vm.isNew = true;
		vm.saveError = null;

		vm.questions = null;
		vm.isLoading = false;

		vm.setTab = function (activeTabName) {
			vm.currentTab = activeTabName;
			if (vm.currentTab === 'question') {
				vm.loadQuestions();
			}
			return;
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
				vm.exam = {};
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

		vm.launch = function (recordId) {
			$state.go('launch', { examId: recordId });
		};


		vm.delete = Modal.confirm.delete(function (record) {
			$log.log(record);
			deleteExam(record.id);
		});

		vm.deleteQuestion = Modal.confirm.delete(function (record) {
			$log.log(record);
			deleteQuestion(record.id);
		});

		vm.cancel = function () {
			$state.go('main');
		};

		vm.save = function () {
			if (vm.frm.$invalid) {
				return;
			}
			vm.isLoading = true;
			api.saveExam(vm.exam, vm.isNew)
				.then(function (result) {
					notification.info('Exam', vm.exam.name + ' saved successfully');
					$state.go('exam', { examId: result[0].id });
				})
				.catch(function (err) {
					notification.error('Exam', vm.exam.name + ' an error has occurred');
					handleError(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		};

		function handleError(err) {
			if (err.status === 500) {
				vm.saveError = 'A server side error has occurred. Please try again or contact the administrator';
			}
			else {
				vm.saveError = err;
			}
			$log.error(err);
		}

		/*********************************************AJAX CALLS********************************/
		function getCategories() {
			vm.isLoading = true;

			api.getCategories()
				.then(function (result) {
					vm.category = result;
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}
		function loadQuestionsFromApi(examId) {
			vm.isLoading = true;

			api.getAllQuestionsForExamDisplay(examId)
				.then(function (result) {
					vm.questions = result;
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function deleteQuestion(questionId) {
			vm.isLoading = true;

			api.deleteQuestion(questionId)
				.then(function (result) {
					$log.log('***Delete Question***');
					$log.log(result);
					loadQuestionsFromApi($stateParams.examId);
					notification.info('Question', result.name + ' deleted successfully');
				})
				.catch(function (err) {
					notification.error('Question','An error has occurred during deletion');
					handleError(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function deleteExam(examId) {
			vm.isLoading = true;

			api.deleteExam(examId)
				.then(function (result) {
					vm.exam = result[0];
					$state.go('main');
				})
				.catch(function (err) {
					handleError(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function loadExam(examId) {
			vm.isLoading = true;

			api.getExam(examId)
				.then(function (result) {
					console.log(result[0]);
					vm.exam = result[0];
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

	});
