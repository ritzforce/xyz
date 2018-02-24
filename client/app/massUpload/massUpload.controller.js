'use strict';

angular.module('examApp')
	.controller('MassUploadCtrl', function ($scope, $timeout, Upload, Auth) {
		var vm = this;
		vm.error = {};

		init();

		function init() {
			vm.isSuperAdmin = Auth.isSuperAdmin;
		}

	});
