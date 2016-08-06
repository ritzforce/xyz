'use strict';

angular.module('examApp')
	.controller('QuestionCtrl', function ($stateParams, $state, $log, api, notification) {

		var vm = this;
		vm.question = {};
		vm.isNew = true;
		vm.saveError = null;

		vm.isLoading = false;

		init();

		function init() {
			if (!$stateParams.questionId) {
				vm.isNew = true;
				vm.question = api.getQuestionModel($stateParams.examId);
			}
			else {
				vm.isNew = false;
				loadQuestion($stateParams.questionId);
			}
		}

		vm.headerText = function () {
			return vm.isNew ? 'New Question' : 'Edit Question - ' + vm.question.name;
		};

		vm.cancel = function () {
			$state.go('exam', { examId: vm.question.examId, tab: 'question' });
		};

		vm.save = function () {

			if (vm.frm.$invalid) {
				return;
			}
			if (!validateAnswer()) {
				return;
			}
			saveQuestion();
		};

		function validateAnswer() {
			var isAnswer = vm.question.aCorrect || vm.question.bCorrect || vm.question.cCorrect || vm.question.dCorrect || vm.question.eCorrect;
			if (!isAnswer) {
				vm.error = 'Please select atleast 1 correct answer';
				return false;
			}
			var count = 0;
			if (vm.question.a) { count++; }
			if (vm.question.b) { count++; }
			if (vm.question.c) { count++; }
			if (vm.question.d) { count++; }
			if (vm.question.e) { count++; }

			if (count < 2) {
				vm.error = 'Please provide at least 2 answer options';
				return false;
			}

			return true;
		}

		/******************************************AJAX **************************************/
		function loadQuestion(questionId) {

			api.connectApi(vm, 'Loading...', api.getQuestion.bind(api, questionId), function (result) {
				vm.question = result;
			});
		}

		function saveQuestion() {
			api.connectApi(vm,'Saving..',api.saveQuestion.bind(api, vm.question, vm.isNew ), function(result){
				vm.question = result[0];
				notification.info('Question', vm.question.name + ' saved successfully');
				$state.go('exam', { examId: vm.question.examId, tab: 'question' });
			});
		}
	});
