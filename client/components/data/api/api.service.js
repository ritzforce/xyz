'use strict';

angular.module('examApp')
	.service('api', function ($http, $log, mockData) {

		this.getExamModel = function () {
			var exam = {
				name: '',
				code: '',
				description: '',
				category: '',
				maxMarks: '',
				imageId: 0,
				passPercent: 45,
			};
			return exam;
		};

		this.getAnswerModel = function (questionId) {
			var answer = {
				questionId: questionId,
				markForReview: false,
				selectedAnswer: {},
				radioAnswer: ''
			};
			return answer;
		};

		this.getPaperModel = function () {
			var paper = {
				examId: '',
				userId: '',
				score: 0,
				isPass: false
			};
			return paper;
		}

		this.getQuestionModel = function (examId) {
			var question = {
				examId: examId,
				name: '',
				questionText: '',
				a: 'Option A',
				b: '',
				c: '',
				d: '',
				e: '',
				f: '',
				active: true,
				aCorrect: true,
				bCorrect: false,
				cCorrect: false,
				dCorrect: false,
				eCorrect: false,
				fCorrect: false
			};
			return question;
		};

		this.getQuestion = function (questionId) {
			var questions = mockData.getQuestionsForExam();
			var result = _.find(questions, function (question) {
				return question.id == questionId;
			});
			return result;
		};

		this.getQuestionForExam = function (examId) {
			return mockData.getQuestionsForExam();
		};

		/**********************************User*******************************************************/
		this.getUsers = function(){
			return $http.get('/api/users/').then(function(response) {
				return response.data;
			});
		};

		this.getProfile = function(userId) {
			console.log(userId);

			if(userId) {
				console.log("Generic profile");
				return $http.get('/api/users/profile/' + userId).then(function(response){
					return response.data;
				});
			}
			else {
				$log.log(" Specific My Profile");
				return $http.get('/api/users/myprofile').then(function(response){
					return response.data;
				});
			}
		};

		/************************************Paper*******************************************************/
		this.getPaper = function (paperId) {
			return $http.get('/api/papers/' + paperId).then(function (response) {
				return response.data;
			});
		};

		this.getResult = function (paperId) {
			return $http.get('/api/papers/result/' + paperId).then(function (response) {
				return response.data;
			});
		};

		this.savePaper = function (paper, isNew) {
			if (isNew) {
				return $http.post('/api/papers', paper).then(function (response) {
					return response.data;
				});
			}
			else {
				return $http.put('/api/papers/' + paper.id, paper).then(function (response) {
					return response.data;
				});
			}
		};

		this.saveCurrentAnswer = function (paperAnswer) {
			return $http.post('/api/paperAnswers', paperAnswer).then(function (response) {
				return response.data;
			});
		};

		/***********************************Category****************************************************/
		this.getCategories = function () {
			return $http.get('/api/settings/category').then(function (response) {
				var objectArr = response.data;
				var result = [];
				for (var i = 0; i < objectArr.length; i++) {
					var currentObject = objectArr[i];
					result.push(currentObject.name);
				}
				return result;
			});
		};

		/*******************************************QUESTION*******************************************/
		this.saveQuestion = function (question, isNew) {
			if (isNew) {
				return $http.post('/api/questions', question).then(function (response) {
					return response.data;
				});
			}
			else {
				return $http.put('/api/questions/' + question.id, question).then(function (response) {
					return response.data;
				});
			}
		};

		this.getAllQuestionsForExamDisplay = function (examId) {
			console.log(examId);

			return $http.get('/api/questions/exam/' + examId).then(function (response) {
				return response.data;
			});
		};

		this.getAllQuestionsForLaunch = function (examId) {
			return $http.get('/api/questions/exam/launch/' + examId).then(function (response) {
				return response.data;
			});
		};

		this.deleteQuestion = function (questionId) {
			return $http.delete('/api/questions/' + questionId).then(function (response) {
				return response.data;
			});
		};

		this.getQuestion = function (questionId) {
			return $http.get('/api/questions/' + questionId).then(function (response) {
				return response.data;
			});
		};


		/*******************************************EXAM*******************************************/
		this.saveExam = function (exam, isNew) {
			if (isNew) {
				return $http.post('/api/exams', exam).then(function (response) {
					return response.data;
				});
			}
			else {
				return $http.put('/api/exams/' + exam.id, exam).then(function (response) {
					return response.data;
				});
			}
		};

		this.getExam = function (examId) {
			console.log(examId);
			return $http.get('/api/exams/' + examId).then(function (response) {
				return response.data;
			});
		};


		this.getAllExams = function () {
			return $http.get('/api/exams').then(function (response) {
				return response.data;
			});
		};

		this.deleteExam = function (examId) {
			return $http.delete('/api/exams/' + examId).then(function (response) {
				return response.data;
			});
		};

	});
