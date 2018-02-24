'use strict';

angular.module('examApp')
  .directive('rootSideMenu', function() {
    return {
      templateUrl: 'components/directives/rootSideMenu/rootSideMenu.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {},
      controller: function ($scope, api, Auth) {
				$scope.lastBackup = -1;
				$scope.showBackupDays = false;
				$scope.backupClass = 'badge badge-ok';
				
				if (Auth.isSuperAdmin()) {
					api.lastBackup().then(function (result) {					
						$scope.lastBackup = result;

						var backupDays = $scope.lastBackup;
						if($scope.lastBackup > 3){
							$scope.showBackupDays = true;
						}

						if(backupDays > 7) {
							$scope.backupClass = 'badge badge-warning';
						}
						if(backupDays > 10){
							$scope.backupClass = 'badge badge-danger';
						}
					});
				}
			}
    };
  })
 
