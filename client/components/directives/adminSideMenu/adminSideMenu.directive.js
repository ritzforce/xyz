'use strict';

angular.module('examApp')
	.directive('adminSideMenu', function () {
		return {
			templateUrl: 'components/directives/adminSideMenu/adminSideMenu.html',
			restrict: 'EA',
			link: function (scope, element, attrs) {
			}
			
		};
	});