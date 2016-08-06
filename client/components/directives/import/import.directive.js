'use strict';

angular.module('examApp')
	.directive('import', function () {
		return {
			templateUrl: 'components/directives/import/import.html',
			restrict: 'EA',
			scope: {
				uploadUrl: "@"
			},

			controller: function ($scope, $log, $timeout, Upload, $http, $window) {
				$scope.complete = false;
				$scope.uploadResult = {};

				$scope.downloadFile = function(){
					return $window.open('/templates/download/' + $scope.uploadResult.fileName);
				};

				$scope.uploadFiles = function (file, errFiles) {

					$scope.f = file;
					$scope.errFile = errFiles && errFiles[0];
					if (file) {
						file.upload = Upload.upload({
							url: $scope.uploadUrl,
							method: 'POST',
							file : file,
							data: {}
						});

						file.upload.then(function (response) {
							$timeout(function () {
								$scope.complete = true;
								$scope.uploadResult = response.data;
								file.result = response.data;
							});
						}, function (response) {
							$scope.complete = true;

							if (response.status > 0)
								$scope.errorMsg = response.status + ': ' + response.data;
						}, function (evt) {
							file.progress = Math.min(100, parseInt(100.0 *
								evt.loaded / evt.total));
						});
					}
				}
			}

		};
	});