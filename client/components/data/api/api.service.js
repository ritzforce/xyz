'use strict';

angular.module('examApp')
	.service('api', function ($http, $log, notification ,mockData) {

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

		/********************************Utilty Calls************************************************/
		this.connectApi = function(vm, inProgressText, sourceFunction, success, failure){
		
			vm.isLoading = true;
			vm.error = null;

			notification.notify(inProgressText);

			sourceFunction()
			.then(function(result){
				return success(result);
			})
			.catch(function(err){
				$log.error(err);
				formatError(vm, err);
				if(failure){
					failure(err);
				}
			})
			.finally(function(){
				vm.isLoading = false;
				notification.hide();
			});
		};

		function formatError(vm, err){
			if(err.status === 404) {
				vm.error = 'The record does not exist in the database. Please refresh and try again';
				return;
			}
			if(err.status === 500){
				vm.error = 'An internal server error has occurred. Please check the server logs to diagnose the error';
				return;
			}
			vm.error = err.data;
		}

		this.delete = function(url){
			return $http.delete(url).then(function(response){
				return response.data;
			});
		};

		this.get = function(url){
			return $http.get(url).then(function(response){
				if(response.data && response.data.length >= 1) {
					return response.data[0];
				}
				return null;
			});
		};

		this.getAll = function(url){
			return $http.get(url).then(function(response){
				return response.data;
			});
		};

		this.post = function(url, body){
			return $http.post(url, body).then(function(response){
				return response.data;
			});
		};

		this.put = function(url, body){
			return $http.put(url, body).then(function(response){
				return response.data;
			});
		};

		/**********************************User*******************************************************/
		this.getUsers = function(){
			return this.getAll('/api/users');
		};

		this.getMe = function(){
			return $http.get('/api/users/me').then(function(response){
				if(response.data) {
					return response.data;
				}
				return null;
			});
		};

		this.getUser = function(userId){
			return this.get('/api/users/' + userId);
		};

		this.deleteUser = function(recordId){
			return this.delete('/api/users/' + recordId);
		};

		this.saveUser = function(user){
			if(user.id){
				return this.put('/api/users/' + user.id, user);
			}
			else {
				return this.post('/api/users/', user);
			}
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
		this.correctAnswersForPaper = function(paperId){
			return this.getAll('/api/papers/review/' + paperId);
		};
	
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
			return $http.get('/api/categories').then(function (response) {
				var objectArr = response.data;
				var result = [];
				for (var i = 0; i < objectArr.length; i++) {
					var currentObject = objectArr[i];
					result.push(currentObject.name);
				}
				return result;
			});
		};

		this.saveCategory = function (category){
			var isNew = true;
			if(category.id){
				isNew = false;
			}

			if (isNew) {
				return $http.post('/api/categories', category).then(function (response) {
					return response.data;
				});
			}
			else {
				return $http.put('/api/categories/' + category.id, category).then(function (response) {
					return response.data;
				});
			}		
		};

		this.deleteCategory = function(categoryId){
			return this.delete('/api/categories/' + categoryId);
		};

		this.getCategory = function (categoryId){
			return $http.get('/api/categories/' + categoryId).then(function(response){
				return response.data[0];
			});
		};

		this.getCategoriesForAdmin = function(){
			return $http.get('/api/categories').then(function (response) {
				return response.data;
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
