'use strict';

angular.module('examApp')
	.directive('examList', function () {
		return {
			templateUrl: 'components/directives/examList/examList.html',
			bindToController: true,
			restrict: 'E',
			scope: {
				lstExam: '='
			},
			controllerAs: 'vm',
			controller: function ($scope,$state,Modal, Auth) {
				var vm = this;
				
				vm.launchExam = function(recordId){
					$state.go('launch', {examId: recordId});
				};

				vm.goToExamDetail = function(recordId){
					if(Auth.isAdmin()){
						$state.go('exam',{examId: recordId});
					}
					return;
				};

				vm.editExam = function (recordId) {
					$state.go('examEdit',{examId: recordId});
				};

				vm.deleteExam = Modal.confirm.delete(function(record){
					
				});
			},
		};
	});