'use strict';

//=============================================================//
//Format Answer for the Review Screen
//=============================================================//
angular.module('examApp').filter('formatAnswer',function(){
	return function(answer){
		if(!answer){
			return;
		}
		if(answer.radioAnswer){
			return answer.radioAnswer.toUpperCase();
		}
		if(answer.selectedAnswer){
			var arr = [];
			var allKeys = Object.keys(answer.selectedAnswer).sort();

			allKeys.forEach(function(key){
				arr.push(key.toUpperCase());
			});
			return arr.join(', ');
		}
	};
});

//=============================================================//
//Format Answer for the Review Screen
//=============================================================//
angular.module('examApp').filter('prepend',function(){
	return function(index){
		console.log(index);
		if(index === undefined){
			return;
		}
		return String.fromCharCode(65 + index) + '.  ';
	};
});

//=================================================================//
//Main Controller for the Logic
//=================================================================//
angular.module('examApp')
	.controller('LaunchCtrl', function ($log, $state, $stateParams, $filter, api, Auth) {
		var vm = this;
		var questionOptions = ['a','b','c','d','e','f'];
		
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

		vm.currentQuestionIndex = 0;
		vm.currentQuestion = null;
		vm.currentAnswer = null;

		init();

		function init(){
			var examId = $stateParams.examId;
			loadExam(examId);
			vm.launchStep = 4;
			loadCorrectAnswers();
			vm.isAdmin = Auth.isAdmin();
		}

		vm.moveLaunchStep = function(){
			vm.launchStep = vm.launchStep + 1;
			if(vm.launchStep === 1){
				//Load Questions,Answers etc
				prepForLaunch();
			}
		};


		function loadOptions(currentQuestion){
			var answerOptions = [];
			for(var i = 0; i < questionOptions.length;i++){
				var currentKey = questionOptions[i];
				var answerValue = currentQuestion[currentKey];
				if(!answerValue) {
					continue;
				}

				answerOptions.push({
					key: currentKey,
					value: answerValue
				});
			}
			return answerOptions;
		}

		function loadCurrentQuestion(){
			vm.currentQuestion = vm.allQuestions[vm.currentQuestionIndex];
			vm.currentAnswer = vm.allAnswers[vm.currentQuestionIndex]; 
			vm.answerOptions = loadOptions(vm.currentQuestion);
		}

		vm.isPrevious = function(){	
			return (vm.currentQuestionIndex === 0) ? false : true;
		};


		vm.isFinish = function(){
			return !vm.isNext();
		};

		vm.isRadio = function(){
			if(!vm.currentQuestion) {
				return false;
			}
			return (vm.currentQuestion.len === 1);
		};

		vm.exit = function(){
			$state.go('main');
		};

		//Show the Review Page
		vm.moveToReview = function(){
			vm.launchStep = 2;
			return;
		};

		vm.moveToResult = function(){
			vm.launchStep = 3;
			getResult(vm.paper.id);
			return;
		};

		vm.moveToQuestion = function(){
			vm.currentQuestionIndex = vm.allQuestions.length - 1;
			vm.launchStep = 1;
			loadCurrentQuestion();
			return;
		};

		vm.movePrevious = function(){
			saveCurrentAnswer(vm.currentQuestionIndex);
			if(vm.currentQuestionIndex > 0){
				vm.currentQuestionIndex--;
			}
			
			loadCurrentQuestion();
			return;
		};
		vm.moveNext = function(){
			saveCurrentAnswer(vm.currentQuestionIndex);

			if(vm.currentQuestionIndex + 1 < vm.allQuestions.length) {
				vm.currentQuestionIndex++;
				loadCurrentQuestion();
			}
			else {
				vm.moveToReview();
			}
			
			return;
		};

		vm.moveToCorrectAnswer = function(){
			vm.launchStep = 4;
			loadCorrectAnswers();
			return;
		};

		function loadCorrectAnswers () {
			var paperId = 17;
			api.connectApi(vm,'Loading...',api.correctAnswersForPaper.bind(api, paperId), function(result){
				vm.allCorrectAnswer = processCorrectAnswers(result);
			});
		}

		function processCorrectAnswers(result){
			for(var i = 0; i < result.length;i++){
				var currentQuestion = result[i];
				currentQuestion.answerOptions = loadOptions(currentQuestion);
				if(currentQuestion.length === 1) { //Radio
					currentQuestion.selectedAnswer = currentQuestion.answer;
				}
				else {
					var selAnswer = {};
					if(currentQuestion.answer){
						var arr = currentQuestion.answer.split('');
						_.forEach(arr,function(value){
							selAnswer[value] = true;
						});
						currentQuestion.selectedAnswer = selAnswer;
					}
				}
				isCorrect(currentQuestion);
			}
			return result;
		}
		function isCorrect(currentQuestion){
			
			_.forEach(currentQuestion.answerOptions, function(answer){
			
				if(currentQuestion[answer.key + 'Correct'] === 1) {
					answer.isCorrect = true;
				}

				if(currentQuestion.length === 1){
					if(currentQuestion.selectedAnswer == answer.key && currentQuestion[answer.key + 'Correct'] == 0){
						answer.isIncorrect = true;
					}
				}
				else {
					if(answer.key == currentQuestion.selectedAnswer[answer.key] && currentQuestion[answer.key + 'Correct'] == 0){
						answer.isIncorrect = true;
					}
				}
			});
		}

		function generateOptions(currentQuestion){
			for(var i = 0; i < questionOptions.length;i++){
				var currentKey = questionOptions[i];
				var answerValue = currentQuestion[currentKey];
				if(!answerValue) {
					continue;
				}

				vm.answerOptions.push({
					key: currentKey,
					value: answerValue
				});
			}	
		}

		function prepForLaunch(){
			if(vm.paper === null) {
				savePaper($stateParams.examId);
				loadQuestionsForLaunch($stateParams.examId);
			}
		}

		/******************************************AJAX CALL***********************************/
		function saveCurrentAnswer(questionIndex){
			var questionId = vm.allQuestions[questionIndex].id;
			var paperId = vm.paper.id;

			var currentAnswer = vm.allAnswers[questionIndex];

			var answerText =  $filter('formatAnswer')(currentAnswer);
			if(answerText){
				answerText = _.map(answerText.toLowerCase().split(','),_.trim).join('');
			}
			console.log('**questionId***'+ questionId + '***paperId***' + paperId + '**' + answerText);

			vm.isLoading = true;

			api.saveCurrentAnswer({questionId : questionId, paperId: paperId, answer: answerText})
			.then(function(result){
				console.log(result);
			})
			.catch(function(err){
				console.log(err);
			})
			.finally(function(){
				vm.isLoading = false;
			});
		}
		
		function getResult(paperId){
			vm.isLoading = true;

			api.getResult(paperId)
			.then(function(result){
				console.log(result[0]);
				vm.result = result[0];
			})
			.catch(function(err){
				console.log(err);
			})
			.finally(function(){
				vm.isLoading = false;
			});					
		}

		function savePaper(examId){
			vm.isLoading = true;

			api.savePaper({examId: examId },true)
			.then(function(result){
				console.log(result[0]);
				vm.paper = result[0];
			})
			.catch(function(err){
				console.log(err);
			})
			.finally(function(){
				vm.isLoading = false;
			});			
		}
		function loadQuestionsForLaunch(examId){
			vm.isLoading = true;

			api.getAllQuestionsForLaunch(examId, true)
			.then(function(result){
				vm.allQuestions = result;
			})
			.then(function(){
				//Populate Answers Model
				for(var i = 0; i < vm.allQuestions.length;i++){
					vm.allAnswers.push(api.getAnswerModel(vm.allQuestions[i].id));
				}
				loadCurrentQuestion();
			})
			.catch(function(err){
				console.log(err);
			})
			.finally(function(){
				vm.isLoading = false;
			});					
		}

		function loadExam(examId){
			vm.isLoading = true;

			api.getExam(examId)
			.then(function(result){
				console.log(result[0]);
				vm.exam = result[0];
			})
			.catch(function(err){
				console.log(err);
			})
			.finally(function(){
				vm.isLoading = false;
			});			
		}
	});
