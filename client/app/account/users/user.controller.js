'use strict';

angular.module('examApp')
	.controller('UserCtrl', function ($state, $log, api, notification, Modal, Auth) {
		var vm = this;
		vm.isLoading = false;
		vm.allUsers = null;

		init();

		function init() {
			getUsers();
			vm.isSuperAdmin = Auth.isSuperAdmin;
		}

		vm.delete = Modal.confirm.delete(function (record) {
			api.connectApi(vm,'Deleting...',api.deleteUser.bind(api, record.id), function(result){
				notification.info('User', record.name + ' deleted successfully');
				$state.reload();
			});
		});

		vm.activate = Modal.confirm.question(function(record){
			var user = {id : record.id, active : 1};
			api.connectApi(vm,'Activating...', api.saveUser.bind(api, user), function(result){
				notification.info('User', record.name + ' activated successfully');
				$state.reload();				
			});
		});

		vm.deActivate = Modal.confirm.question(function(record){
			var user = {id : record.id, active : 0};
			api.connectApi(vm,'Deactivating...', api.saveUser.bind(api, user), function(result){
				notification.info('User', record.name + ' deactivated successfully');
				$state.reload();				
			});
		});

	
		vm.goToNewUser = function(){
			$state.go('userNew');
		};

		/**********************************AJAX CALLS****************************/
		function getUsers() {
			api.connectApi(vm,'Loading...',api.getUsers.bind(api), function(result){
				vm.allUsers = result;
			});
		}	
		
	});
