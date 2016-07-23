'use strict';

angular.module('examApp')
	.directive('questionList', function () {
		return {
			templateUrl: 'components/directives/questionList/questionList.html',
			restrict: 'EA'
			
		};
	});