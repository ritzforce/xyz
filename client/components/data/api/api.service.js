'use strict';

angular.module('examApp')
	.service('api', function ($http, $log, $q, notification ,mockData) {

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
				aCorrect: false,
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

			if(inProgressText){
				notification.notify(inProgressText);
			}
			
			sourceFunction()
			.then(function(result){
				return success(result);
			})
			.catch(function(err){
				console.log('***Error*****');
				console.log(err);

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

		this.formatError = formatError;

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

		this.getAdminUser = function(code) {
			return this.get('/api/users/adminUser/' + code);
		}

		this.getUser = function(userId){
			return this.get('/api/users/' + userId);
		};

		this.deleteUser = function(recordId){
			return this.delete('/api/users/' + recordId);
		};

		this.signUp = function(user) {
			return this.post('/api/users/signup', user);
		}

		this.saveUser = function(user){
			if(user.id){
				return this.put('/api/users/' + user.id, user);
			}
			else {
				return this.post('/api/users/', user);
			}
		};

		this.getProfile = function(userId) {
			
			if(userId) {
				return $http.get('/api/users/profile/' + userId).then(function(response){
					return response.data;
				});
			}
			else {
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

		this.getResult = function (paperId, timeTaken) {
			return this.getAll('/api/papers/result/' + paperId + '/' + timeTaken);
		};

		this.savePaper = function (paper, isNew) {
			if (isNew) {
				return this.post('/api/papers', paper);
			}
			else {
				return this.put('/api/papers/' + paper.id, paper);
			}
		};

		this.saveCurrentAnswer = function (paperAnswer) {
			return $http.post('/api/paperAnswers', paperAnswer).then(function (response) {
				return response.data;
			});
		};

		this.purgePaper = function(paperId){
			return this.delete('/api/paperAnswers/paper/' + paperId);
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
			if(isNew){
				return this.post('/api/questions', question);
			}
			else {
				return this.put('/api/questions/' + question.id, question);
			}
		};

		this.getAllQuestionsForExamDisplay = function (examId) {
			return this.getAll('/api/questions/exam/' + examId);
		};

		this.getAllQuestionsForLaunch = function (examId) {
			return this.getAll('/api/questions/exam/launch/' + examId);
		};

		this.deleteQuestion = function (questionId) {
			return this.delete('/api/questions/' + questionId);
		};

		this.getQuestion = function (questionId) {
			return this.get('/api/questions/' + questionId);
		};


		/*******************************************EXAM*******************************************/
		this.saveExam = function (exam, isNew) {
			if(isNew){
				return this.post('/api/exams', exam);
			}
			else {
				return this.put('/api/exams/' + exam.id, exam);
			}
		};

		this.getExam = function (examId) {
			return this.get('/api/exams/' + examId);			
		};


		this.getAllExams = function () {
			return this.getAll('/api/exams');
		};

		this.deleteExam = function (examId) {
			return this.delete('/api/exams/' + examId);
		};

		/********************************USER EXAM*******************************************/
		this.getUsersForExam = function(examId) {
			return this.getAll('/api/userExams/exam/' + examId);
		};

		this.getNewUsersForExam = function(examId){
			return this.getAll('/api/userExams/exam/new/' + examId);
		};
		
		this.getExamsForUser = function(userId) {
			return this.getAll('/api/userExams/user/' + userId);
		};

		this.getNewExamsForUser = function(userId){
			return this.getAll('/api/userExams/user/new/' + userId);
		};

		this.deleteUserExam = function(recordId){
			return this.delete('/api/userExams/' + recordId);
		};

		this.assignUsers = function(body){
			return this.post('/api/userExams/assign', body);
		};

		/***********************************Institutes****************************************************/
		this.getInstitutes = function () {
			return this.getAll('/api/institutes');
		};

		

		this.getInstitute = function(instituteId) {
			return this.get('/api/institutes/' + instituteId);
		};

		this.activateInstitute = function(instituteId, adminPassword) {
			return this.post('/api/institutes/activate/' + instituteId, {
				password: adminPassword
			});
		};

		this.resetAdminPassword = function(instituteId, adminPassword) {
			return this.post('/api/institutes/resetAdminPassword/' + instituteId, {
				password: adminPassword
			});
		};

		this.getMyInstitute = function() {
			return this.get('/api/institutes/current/details');
		}

		this.getCurrentLogo = function(instituteId) {
			return this.get('/api/institutes/logo/' + instituteId);
		}

		this.allStats = function(instituteId) {
			return this.get('/api/institutes/allStats/' + instituteId);
		};

		this.stats = function(instituteId) {
			return this.get('/api/institutes/stats/' + instituteId);
		};

		this.reactivateInstitute = function(instituteId) {
			return this.post('/api/institutes/reactivate/' + instituteId, {});
		};

		this.deactivateInstitute = function(instituteId) {
			return this.post('/api/institutes/deactivate/' + instituteId, {});
		}

		this.saveInstitute = function (institute){
			var isNew = true;
			if(institute.id){
				isNew = false;
			}

			if (isNew) {
				return $http.post('/api/institutes', institute).then(function (response) {
					return response.data;
				});
			}
			else {
				return $http.put('/api/institutes/' + institute.id, institute).then(function (response) {
					return response.data;
				});
			}		
		};

		this.deleteInsitute = function(instituteId){
			return this.delete('/api/institutes/' + instituteId);
		};

		/**************************************SHARE EXAM***********************************/

		this.getExamsForInstitutes = function(instituteId) {
			return this.getAll('/api/shareExams/institute/' + instituteId);
		};

		this.getNewExamsForInstitutes = function(instituteId){
			return this.getAll('/api/shareExams/institute/new/' + instituteId);
		};

		this.getInstitutesForExam = function(examId) {
			return this.getAll('/api/shareExams/exam/' + examId);
		}

		this.getNewInstitutesForExam = function(examId){
			return this.getAll('/api/shareExams/exam/new/' + examId);
		}

		this.shareExams = function(body) {
			return this.post('/api/shareExams/assign', body);
		}

		this.deleteShareExam = function(recordId) {
			return this.delete('/api/shareExams/' + recordId);
		}

		/***************************************USER Id***********************************/
		this.resetPassword = function(userId, password){
			return this.post('/api/users/' + userId + '/resetPassword', {password: password});
		};

		this.resetPasswordSelf = function(oldPassword, newPassword){
			return this.post('/api/users/resetPasswordSelf', {oldPassword: oldPassword, password: newPassword});
		};

		this.startBackup = function(){
			return this.getAll('/templates/backup');
		};

		var lastBackup;

		this.updateBackupDate = function(){
			lastBackup = 0;
		};

		this.lastBackup = function(){
			var deferred = $q.defer();

			if(lastBackup !== undefined) {
				deferred.resolve(lastBackup);
			}
			else {
				$http.get('/templates/lastBackup').then(function(result){
					lastBackup = result.data.days;
					deferred.resolve(lastBackup);
				});
			}
			return deferred.promise;
		};


	});


