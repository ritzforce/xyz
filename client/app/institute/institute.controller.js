'use strict';

angular.module('examApp')
  .controller('InstituteCtrl', function ($state, $stateParams, $location,  $log, api, notification, Modal,Auth) {
     	var vm = this;
		vm.isLoading = false;
		vm.allInstitutes = null;
		vm.institute = {};
		vm.currentTab = 'detail';
		vm.sharedExams = null;
		vm.settings = {passwordTitle: '', password:'' , confirmPassword: '', isConfirmPassword: true, adminUser: {}};
		vm.activationResult = {};
		vm.stats = {};
		vm.uploadUrl = '/api/institutes/logoupload';

		init();

		function init() {	

			vm.isSuperAdmin = Auth.isSuperAdmin;

			if ($stateParams.instituteId) {
				getInstitute($stateParams.instituteId);
			} else {
				getAllInstitutes();
			}

			if ($stateParams.tab) {
				vm.setTab($stateParams.tab);
			}
		}

		vm.setTab = function (activeTabName) {
			vm.currentTab = activeTabName;
			if (vm.currentTab === 'settings') {
				vm.initializeSettings();
			}

			if(vm.currentTab === 'sharedExam'){
				vm.loadExamsForInstitute();
			}
			if(vm.currentTab == 'stats') {
				vm.loadAllStats();
			}
			if(vm.currentTab == 'logo') {
				vm.getCurrentLogo();
			}

			return;
		};

		vm.shareExam = function(){
			$state.go('shareExam',{instituteId : vm.institute.id, instituteName: vm.institute.name});
		};

		vm.loadAllStats = function() {
			if(vm.institute.isTableCreated == true) {
				loadAllStats(vm.institute.id);
			}
		};

		vm.edit = function() {
			$state.go('instituteEdit', {
				instituteId: vm.institute.id 
			} );
		};

		vm.goToNewInstitute = function(){
			$state.go('instituteNew');
		};

		vm.getCurrentLogo = function() {
			getCurrentLogo(vm.institute.id);
		}

		vm.goToEditInstitute = function(id){
			$state.go('instituteEdit', {
				instituteId: id 
			} );
		};

		vm.loadExamsForInstitute = function() {
			if (vm.sharedExams != null) {
				return;
			}
			loadSharedExams(vm.institute.id);
		}

		vm.deleteShareExam = function (record) {
			api.connectApi(vm,'Deleting...',api.deleteShareExam.bind(api, record.id), function(result){
				notification.info('Exam', record.name + ' deleted successfully');
				loadSharedExams(vm.institute.id);
			});
		};

		vm.activate = function() {
			if (validatePassword()) {
				activateInstitute(vm.institute.id, vm.settings.password);
			}
		}

		vm.showPasswordScreen = function() {
			if (vm.institute.isTableCreated && vm.institute.active) {
				return true;
			}
			if(!vm.institute.isTableCreated) {
				return true;
			}
			return false;
		}

		vm.resetAdminPassword = function() {
			if(validatePassword()) {
				resetAdminPassword(vm.institute.id, vm.settings.password);
			}
		}

		vm.reactivate = function() {
			reactivate(vm.institute.id);
		}


		vm.deactivate = function() {
			deactivate(vm.institute.id);
		}

		vm.initializeSettings = function() {
			if(vm.institute.isTableCreated) {
				vm.settings.passwordTitle = 'Reset Admin Password';	
			}
			else {
				vm.settings.password = vm.institute.code;
				vm.settings.confirmPassword = vm.institute.code;
				vm.settings.passwordTitle = 'Set Admin Password & Activate';
			}
		}

		/****************************************Functions*******************************/
		function validatePassword() {
			vm.settings.isConfirmPassword = (vm.settings.password === vm.settings.confirmPassword);
			return vm.settings.isConfirmPassword;
		}

		function loadAllStats(instituteId) {
			if (!vm.institute.active) {
				return;
			}

			api.connectApi(vm,'Loading...',api.allStats.bind(api, instituteId), function(result){
				vm.stats = result;
			});	
		}

		function getCurrentLogo(instituteId) {
			api.connectApi(vm, 'Loading...', api.getCurrentLogo.bind(api, instituteId), function(result) {
				vm.logo = result.logo;
			});
		}


		function getInstitute(instituteId) {
			api.connectApi(vm,'Loading...',api.getInstitute.bind(api, instituteId), function(result){
				vm.institute = result;
				//console.log(result);
				api.connectApi(vm,null,api.getAdminUser.bind(api, result.code), function(userResult){
					vm.settings.adminUser = userResult;
				})
			});
		}

		function resetAdminPassword(instituteId, password) {
			api.connectApi(vm,'Loading...',api.resetAdminPassword.bind(api, instituteId, password), function(result){
				notification.info('Institute', vm.institute.name + ' admin password reset successfully');
				vm.setTab('detail');
				getInstitute($stateParams.instituteId);
			});
		}

		function deactivate(instituteId) {
			api.connectApi(vm,'Loading...',api.deactivateInstitute.bind(api, instituteId), function(result){
				notification.info('Institute', vm.institute.name + ' deactivated successfully');
				vm.setTab('detail');
				getInstitute($stateParams.instituteId);
			});
		}

		function reactivate(instituteId) {
			api.connectApi(vm,'Loading...',api.reactivateInstitute.bind(api, instituteId), function(result){
				notification.info('Institute', vm.institute.name + ' reactivated successfully');
				vm.setTab('detail');
				getInstitute($stateParams.instituteId);
			});
		}

		function activateInstitute(instituteId, adminPassword) {
			api.connectApi(vm,'Please wait...',api.activateInstitute.bind(api, instituteId, adminPassword), function(result){
				vm.activationResult = result;
				
				notification.info('Institute', vm.institute.name + ' activated successfully');
				vm.setTab('detail');
				getInstitute($stateParams.instituteId);
			});
		}

		function loadSharedExams(instituteId) {
			api.connectApi(vm,'Loading...',api.getExamsForInstitutes.bind(api, instituteId), function(result){
				vm.sharedExams = result;
				//console.log(result);
			});
		}

		function getAllInstitutes(){
			api.connectApi(vm,'Loading...',api.getInstitutes.bind(api), function(result){
				vm.allInstitutes = result;
				//console.log(result);
			});
		}
  });
