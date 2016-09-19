'use strict';

//=============================================================//
//Format Answer for the Review Screen
//=============================================================//
angular.module('examApp').filter('formatAnswer', function () {
	return function (answer) {
		if (!answer) {
			return;
		}
		if (answer.radioAnswer) {
			return answer.radioAnswer.toUpperCase();
		}
		if (answer.selectedAnswer) {
			var arr = [];
			var allKeys = Object.keys(answer.selectedAnswer).sort();

			allKeys.forEach(function (key) {
				
				if(answer.selectedAnswer[key]) {
					arr.push(key.toUpperCase());
				}
			});
			return arr.join(', ');
		}
	};
});

angular.module('examApp').filter('formatQuestion', function () {
	return function (questionText) {
		if (!questionText) {
			return;
		}
		return questionText.split('\n').join('<br/>').split(' ').join('&nbsp');
	};
});

//=============================================================//
//Format Answer for the Review Screen
//=============================================================//
angular.module('examApp').filter('prepend', function () {
	return function (index) {
		if (index === undefined) {
			return;
		}
		return String.fromCharCode(65 + index) + '.  ';
	};
});

//=================================================================//
//Main Controller for the Logic
//=================================================================//
angular.module('examApp')
	.controller('LaunchCtrl', function ($log, $state, $stateParams, $filter, $interval, api, Auth) {
		var vm = this;
		var questionOptions = ['a', 'b', 'c', 'd', 'e', 'f'];

		//Important Database variables
		vm.exam = {};
		vm.allQuestions = [];
		vm.paper = null;
		vm.result = null;
		vm.allCorrectAnswer = [];
		
		vm.launchStep = 0;

		vm.allAnswers = [];
		vm.answerOptions = null;
		vm.isAdmin = false;
		vm.timer = {};

		vm.currentQuestionIndex = 0;
		vm.currentQuestion = null;
		vm.currentAnswer = null;

		init();

		function init() {
			var examId = $stateParams.examId;
			loadExam(examId);
			vm.launchStep = 0;
			vm.isAdmin = Auth.isAdmin();
		}

		vm.startExam = function(){
			//Load Questions,Answers etc
			prepForLaunch();
		};

		vm.moveLaunchStep = function () {
			vm.launchStep = vm.launchStep + 1;
		};


		function loadOptions(currentQuestion) {
			var answerOptions = [];
			for (var i = 0; i < questionOptions.length; i++) {
				var currentKey = questionOptions[i];
				var answerValue = currentQuestion[currentKey];
				if (!answerValue) {
					continue;
				}

				answerOptions.push({
					key: currentKey,
					value: answerValue
				});
			}
			return answerOptions;
		}

		function loadCurrentQuestion() {
			vm.currentQuestion = vm.allQuestions[vm.currentQuestionIndex];
			vm.currentAnswer = vm.allAnswers[vm.currentQuestionIndex];
			vm.answerOptions = loadOptions(vm.currentQuestion);
		}

		vm.isPrevious = function () {
			return (vm.currentQuestionIndex === 0) ? false : true;
		};

		vm.isFinish = function () {
			return !vm.isNext();
		};

		vm.isRadio = function () {
			if (!vm.currentQuestion) {
				return false;
			}
			return (vm.currentQuestion.len === 1);
		};

		vm.exit = function () {
			api.connectApi(vm, '', api.purgePaper.bind(api, vm.paper.id), function (result) {
				//Do nothing...
			});
			$state.go('main');
		};

		//Show the Review Page
		vm.moveToReview = function () {
			vm.launchStep = 2;
			return;
		};

		vm.moveToResult = function () {
			vm.launchStep = 3;
			stopTimer();
			getResult(vm.paper.id);
			return;
		};

		vm.moveToQuestion = function () {
			vm.currentQuestionIndex = vm.allQuestions.length - 1;
			vm.launchStep = 1;
			loadCurrentQuestion();
			return;
		};

		vm.movePrevious = function () {
			saveCurrentAnswer(vm.currentQuestionIndex);
			if (vm.currentQuestionIndex > 0) {
				vm.currentQuestionIndex--;
			}

			loadCurrentQuestion();
			return;
		};

		vm.jumpToQuestion = function(questionIndex){
			vm.currentQuestionIndex = questionIndex;
			vm.launchStep = 1;
			loadCurrentQuestion();
		};

		vm.moveNext = function () {
			saveCurrentAnswer(vm.currentQuestionIndex);

			if (vm.currentQuestionIndex + 1 < vm.allQuestions.length) {
				vm.currentQuestionIndex++;
				loadCurrentQuestion();
			}
			else {
				vm.moveToReview();
			}

			return;
		};

		vm.moveToCorrectAnswer = function () {
			vm.launchStep = 4;
			loadCorrectAnswers();
			return;
		};

		/*****************************Correct Answer Page ********************************/
		vm.total = 0;
		vm.currentPage = -1;
		vm.allFilteredCorrectArray = [];
		vm.correctAnswerPage = [];
		vm.pageSize = '50';
		vm.filterType = '-1';

		vm.pageChanged = function(){
			vm.correctAnswerPage = vm.allFilteredCorrectArray[vm.currentPage - 1];
		};

		vm.filterAnswersByText = function(){
			var filteredAnswers = $filter('filter')(vm.allCorrectAnswer, vm.filterText);
			reGenerateChunks(filteredAnswers);
		};

		vm.filterByAnswerType = function(){
			if(vm.filterType == -1){
				reGenerateChunks(vm.allCorrectAnswer);
				return;
			}
			var filteredAnswers = $filter('filter')(vm.allCorrectAnswer,{correct: vm.filterType});
			reGenerateChunks(filteredAnswers);
		};

		function reGenerateChunks(masterList){
			vm.allFilteredCorrectArray = _.chunk(masterList, vm.pageSize);
			vm.correctAnswerPage = vm.allFilteredCorrectArray[0];
			vm.currentPage = 1;
			vm.total = masterList.length;
		}

		vm.hidePager = function(){			
			if(vm.total <= vm.pageSize){
				return true;
			}
			return false;
		};
		vm.pageSizeChanged = function(){
			reGenerateChunks(vm.allCorrectAnswer);
		};

		function loadCorrectAnswers() {
			
			api.connectApi(vm, 'Loading...', api.correctAnswersForPaper.bind(api, vm.paper.id), function (result) {
				vm.allCorrectAnswer = processCorrectAnswers(result);
				reGenerateChunks(vm.allCorrectAnswer);
			});
		}

		function processCorrectAnswers(result) {
			for (var i = 0; i < result.length; i++) {
				var currentQuestion = result[i];
				currentQuestion.answerOptions = loadOptions(currentQuestion);
				if (currentQuestion.length === 1) { //Radio
					currentQuestion.selectedAnswer = currentQuestion.answer;
				}
				else {
					var selAnswer = {};
					if (currentQuestion.answer) {
						var arr = currentQuestion.answer.split('');
						_.forEach(arr, function (value) {
							selAnswer[value] = true;
						});
						currentQuestion.selectedAnswer = selAnswer;
					}
				}
				isCorrect(currentQuestion);
			}
			return result;
		}
		function isCorrect(currentQuestion) {
			
			_.forEach(currentQuestion.answerOptions, function (answer) {
				
				if (currentQuestion[answer.key + 'Correct'] === 1) {
					answer.isCorrect = true;
				}

				if (currentQuestion.length === 1) {
					if (currentQuestion.selectedAnswer == answer.key && currentQuestion[answer.key + 'Correct'] == 0) {
						answer.isIncorrect = true;
					}
				}
				else {
					if (currentQuestion.selectedAnswer && currentQuestion.selectedAnswer[answer.key] === true && currentQuestion[answer.key + 'Correct'] == 0) {
						answer.isIncorrect = true;
					}
				}
			});
		}

		function generateOptions(currentQuestion) {
			for (var i = 0; i < questionOptions.length; i++) {
				var currentKey = questionOptions[i];
				var answerValue = currentQuestion[currentKey];
				if (!answerValue) {
					continue;
				}

				vm.answerOptions.push({
					key: currentKey,
					value: answerValue
				});
			}
		}

		function prepForLaunch() {
			if (vm.paper === null) {
				savePaper($stateParams.examId);
				loadQuestionsForLaunch($stateParams.examId);
			}
		}

		/******************************************AJAX CALL***********************************/
		function saveCurrentAnswer(questionIndex) {
			var questionId = vm.allQuestions[questionIndex].id;
			var paperId = vm.paper.id;

			var currentAnswer = vm.allAnswers[questionIndex];

			var answerText = $filter('formatAnswer')(currentAnswer);
			if (answerText) {
				answerText = _.map(answerText.toLowerCase().split(','), _.trim).join('');
			}
			
			vm.isLoading = true;

			api.saveCurrentAnswer({ questionId: questionId, paperId: paperId, answer: answerText })
				.then(function (result) {
				})
				.catch(function (err) {
					$log.error(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function getResult(paperId) {
			api.connectApi(vm, 'Computing...', api.getResult.bind(api, paperId, vm.timer.timeTaken), function(result){
				vm.result = result[0];
			});
		}

		function savePaper(examId) {		
			api.connectApi(vm, 'Loading...', api.savePaper.bind(api, {examId: examId}, true), function(result){
				vm.paper = result[0];
			});
		}

		function loadQuestionsForLaunch(examId) {
			
			api.connectApi(vm,'Loading Questions...', api.getAllQuestionsForLaunch.bind(api, examId, true), function(result){
				if(result.length === 0){
					vm.launchStep = -1;
					vm.error = 'The are no questions loaded for the exam. If you believe this is a mistake, please contact the administrator';
					return;
				}
				
				vm.launchStep = 1;
				//Load Questions,Answers etc
				vm.allQuestions = result;
				for (var i = 0; i < vm.allQuestions.length; i++) {
					vm.allAnswers.push(api.getAnswerModel(vm.allQuestions[i].id));
				}
				loadCurrentQuestion();
				startTimer();
			});
		}

		function stopTimer(){
			$interval.cancel(vm.timer.reference);
			vm.timer.timeTaken = Math.ceil((vm.exam.timeAllowed * 60 - vm.timer.countDownTimer) / 60);
		}

		function startTimer(){
			vm.timer.countDownTimer = vm.exam.timeAllowed * 60;
			vm.timer.warning = false;
			formatTime();
			vm.timer.reference = $interval(formatTime, 1000, vm.timer.countDownTimer);
		}

		function formatTime(){
			vm.timer.countDownTimer--;

			if(vm.timer.countDownTimer === 0) {
				vm.moveToResult();
				return;
			}

			var min = Math.floor(vm.timer.countDownTimer / 60);
			var sec = (vm.timer.countDownTimer) % 60;

			if(min < 10){
				min = '0' + min;
			}
			if(sec < 10){
				sec = '0' + sec;
			}
			vm.timer.formattedTime = min + ' min : ' + sec + ' sec';

			if(min < 5){
				vm.timer.warning = true;
			}
		

		}

		function loadExam(examId) {
			api.connectApi(vm, 'Loading Exam...', api.getExam.bind(api, examId), function (result) {
				vm.exam = result;
			});
		}
	});
