'use strict';

angular.module('examApp')
  .controller('InstituteEditCtrl',function ($state, $stateParams, $location,  $log, api, notification) {
   		var vm = this;
		vm.institute = {isTableCreated: false};
		vm.editMode = null;
		vm.headerText = null;	
		vm.error = '';
	
		init();
		function init() {
			vm.editMode = true;
			if ($stateParams.instituteId) {
				getInstitute($stateParams.instituteId);
			}
			else {
				vm.headerText = 'New Institute';
				vm.editMode = false;
			}
		}

		function getInstitute(instituteId) {
			api.connectApi(vm, 'Loading...', api.getInstitute.bind(api, instituteId), function (result) {
				vm.institute = result;
				vm.headerText = 'Edit Institute - ' + vm.institute.name;
			});
		}

		/***********************************************************************************/
		vm.save = function () {
			
			if(vm.frm.$invalid){
				return;
			}

			api.connectApi(vm, 'Saving..', api.saveInstitute.bind(api, vm.institute), function (result) {
				var message = vm.editMode ? ' saved' : 'created';
				notification.success('Institute','Institute ' + message + ' successfully');
				$state.go('institutes');
			});
		};

		vm.cancel = function () {
			$state.go('institutes');
		};
  });
