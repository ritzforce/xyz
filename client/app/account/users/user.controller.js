'use strict';

angular.module('examApp')
	.controller('UserCtrl', function ($state, $log, api, notification, Modal) {
		var vm = this;
		vm.isLoading = false;
		vm.allUsers = null;

		init();

		function init() {
			getUsers();
		}

		vm.delete = Modal.confirm.delete(function (record) {
			api.connectApi(vm,'Deleting...',api.deleteUser.bind(api, record.id), function(result){
				notification.info('User', record.name + ' deleted successfully');
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
