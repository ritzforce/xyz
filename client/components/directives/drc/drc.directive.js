'use strict';

angular.module('examApp')
	.directive('drc', function () {
		return {
			restrict: 'EA',
			link: function (scope, element) {
				element.bind('contextmenu', function (e) {
					e.preventDefault();
				});

				element.bind('mousedown', function(e){
					e.preventDefault();
				});

				element.bind('mousemove', function(e){
					e.preventDefault();
				});

				element.addClass('noSelect');

				element.bind('keydown', function(e){
					var keycode = e.which || e.keyCode;
					
					if(keycode == 17){
						e.preventDefault();
						return;
					}
				});
			}
		};
	});