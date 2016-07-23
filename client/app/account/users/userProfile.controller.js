'use strict';

angular.module('examApp')
	.controller('UserProfileCtrl', function ($stateParams, $log, api) {
		
		var vm = this;
		vm.isLoading = true;

		console.log('HHHH');

		init();

		function init(){
			getProfile();
		}

		/**********************************AJAX CALLS****************************/
		function getProfile() {
			vm.isLoading = true;

			api.getProfile($stateParams.userId)
				.then(function (result) {
					console.log(result);
					vm.user = result;
					processScore();
				})
				.catch(function (err) {
					$log.error(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		function processScore(){
			if(!vm.user.exams){
				return;
			}
			for(var i = 0; i < vm.user.exams.length;i++){
				var currentExam = vm.user.exams[i];
				currentExam.computedScore = Math.round((currentExam.maxMarks * currentExam.percent) / 100);
				//currentExam
			}
		}

	});
