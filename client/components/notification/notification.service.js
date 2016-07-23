'use strict';

angular.module('examApp')
	.factory('notification', function () {
		toastr.options = { "closeButton": true};

		return {
			success: function (title, message) {
				toastr.success(message, title);
			},
			error: function (title, message) {
				toastr.error(message, title);
			},
			info: function (title, message) {
				toastr.info(message, title);
			}
		};
	});
