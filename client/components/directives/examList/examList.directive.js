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
			controller: function ($scope,$state,Modal) {
				var vm = this;
				
				vm.launchExam = function(recordId){
					$state.go('launch', {examId: recordId});
				};

				vm.editExam = function (recordId) {
					console.log(recordId);
					$state.go('examEdit',{examId: recordId});
				};

				vm.deleteExam = Modal.confirm.delete(function(record){
					console.log(record);
				});
			},
		};
	});