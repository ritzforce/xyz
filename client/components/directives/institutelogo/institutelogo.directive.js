'use strict';

angular.module('examApp')
  .directive('institutelogo', function () {
    return {
      templateUrl: 'components/directives/institutelogo/institutelogo.html',
      restrict: 'EA',
      scope: {
			uploadUrl: "@",
			currentLogo: "@",
			instituteid:"@"
		},
      controller: function ($scope, $log, $timeout, Upload, $http, $window, notification) {
				$scope.complete = false;
				$scope.uploadResult = {};
				$scope.uploadFiles = function (file, errFiles) {


					$scope.f = file;
					$scope.errFile = errFiles && errFiles[0];
					if (file) {
					
						file.upload = Upload.upload({
							url: $scope.uploadUrl,
							method: 'POST',
							data: {instituteid: $scope.instituteid, file: file}
						});

						file.upload.then(function (response) {
							$log.log(response);

							$timeout(function () {
								$scope.complete = true;
								$scope.uploadResult = response.data;
								file.result = response.data;

								if (response.status == 200) {
									notification.info("Institute", "Logo uploaded successfully");
								}
							});
						}, function (response) {
					
							$scope.complete = true;
							if (response.status > 0) {
								$scope.errorMsg = response.status + ': ' + response.data;
							}
							else {
								notification.info("Institute", "Logo uploaded successfully");
							}

						}, function (evt) {
							file.progress = Math.min(100, parseInt(100.0 *
								evt.loaded / evt.total));
						});
					}
				}
			}
    };
  });