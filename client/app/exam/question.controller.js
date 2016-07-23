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
			if(!validateAnswer()){
				return;
			}
			saveQuestion();
		};

		function validateAnswer(){
			var isAnswer = vm.question.aCorrect || vm.question.bCorrect || vm.question.cCorrect || vm.question.dCorrect;
			if(!isAnswer){
				vm.saveError = 'Please select atleast 1 correct answer';
				return false;
			}
			var count = 0;
			if(vm.question.a){count++;}
			if(vm.question.b){count++;}
			if(vm.question.c){count++;}
			if(vm.question.d){count++;}

			if(count < 2){
				vm.saveError = 'Please provide at least 2 answer options';
				return false;
			}

			return true;
		}

		/******************************************AJAX **************************************/
		function loadQuestion(questionId) {
			vm.isLoading = true;

			api.getQuestion(questionId)
				.then(function (result) {
					console.log(result[0]);
					vm.question = result[0];
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function saveQuestion() {
			vm.saveError = null;
			vm.isLoading = true;

			api.saveQuestion(vm.question, vm.isNew)
				.then(function (result) {
					vm.question = result[0];
					notification.info('Question', vm.question.name + ' saved successfully');
					$state.go('exam', { examId: vm.question.examId, tab: 'question' });

				})
				.catch(function (err) {
					notification.error('Question', vm.question.name + ' an error has occurred');
					handleError(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function handleError(err) {
			if (err.status === 500) {
				vm.saveError = 'A server side error has occurred. Please try again or contact the administrator';
			}
			else {
				vm.saveError = err;
			}
			$log.error(err);
		}
	});
