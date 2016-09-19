'use strict';

angular.module('examApp')
	.controller('BackupCtrl', function ($log, $window, api, notification) {
		var vm = this;
		vm.fileName = '';

		vm.message = '';
		vm.icon = '';

		init();

		function init(){
			api.lastBackup().then(function(lastBackUp){
				if(!lastBackUp || lastBackUp < 3){
					return;
				}

				if(lastBackUp > 3){
					vm.icon = 'success';
				}
				if(lastBackUp > 10){
					vm.icon = 'danger';
				}
				vm.message = 'It has been ' + lastBackUp + ' days since you backed up the database. Please do regular backups';
			});
		}


		vm.startBackup = function(){
			api.connectApi(vm,'Loading...',api.startBackup.bind(api), function(result){
				vm.fileName = result.fileName;
				api.updateBackupDate();
				vm.message = '';
			});
		};

		vm.downloadFile = function(){
			return $window.open('/templates/download/' + vm.fileName);
		};

	});
