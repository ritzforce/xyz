'use strict';

angular.module('examApp')
  .controller('ShareexamCtrl', function ($state, $stateParams, $log, api, notification) {
   	var vm = this;
	vm.exam = {};
	vm.institutes = null;

	vm.institute = {};
	vm.exams = null;

	init();

	function init(){
		if($stateParams.examId){
			vm.exam = { id: $stateParams.examId, name : $stateParams.examName};
			loadInstitutesForExam(vm.exam.id);
		}
		if($stateParams.instituteId){
			vm.institute = {id: $stateParams.instituteId, name : $stateParams.instituteName};
			loadExamsForInstitute(vm.institute.id);
		}
		
	}

	vm.shareExams = function(){
		var requestBody = {instituteId: vm.institute.id};

		var examIdArray = [];
		for(var i = 0; i < vm.exams.length;i++){
			if(vm.exams[i].isSelected){
				examIdArray.push(vm.exams[i].id);
			}
		}
		requestBody.examId = examIdArray.join(',');
		saveAssigned(requestBody);
	};

	vm.shareInstitutes = function(){	
		var requestBody = {examId: vm.exam.id};
		var instituteIdArray = [];
		for(var i = 0; i < vm.institutes.length;i++){
			if(vm.institutes[i].isSelected){
				instituteIdArray.push(vm.institutes[i].id);
			}
		}
		requestBody.instituteId = instituteIdArray.join(',');
		saveAssigned(requestBody);
	};

	vm.cancel = function(){
		if(vm.exam.id){
			$state.go('exam', { examId: vm.exam.id, tab: 'shareInstitute' });
		}
		if(vm.institute.id){
			$state.go('instituteDetail',{instituteId: vm.institute.id, tab: 'sharedExam'});
		}
	};

	function saveAssigned(requestBody){
		if(!requestBody.instituteId) {
			vm.error = 'Please select atleast 1 row';
			return;
		}
		if(!requestBody.examId) {
			vm.error = 'Please select atleast 1 row';
			return;
		}

		api.connectApi(vm, 'Loading...', api.shareExams.bind(api, requestBody), function(result) {
			console.log('****Result****');
			console.log(result);

			if(result && result.failureCount > 0){
				vm.error = 'An internal server error has occurred. Please check the server logs to diagnose the error';
				return;
			}

			if(vm.exam.id) {
				notification.info('Institute Assignments','Institute assigned successfully');
				loadInstitutesForExam(vm.exam.id);
			}
			if(vm.institute.id){
				notification.info('Exam Share','Exam shared with institute successfully');
				loadExamsForInstitute(vm.institute.id);
			}
		});
	}

	function loadInstitutesForExam(examId){
		
		api.connectApi(vm, 'Loading...', api.getNewInstitutesForExam.bind(api, examId), function (result) {
			vm.institutes = result;
		});
		
	}

	function loadExamsForInstitute(instituteId){
		api.connectApi(vm, 'Loading...', api.getNewExamsForInstitutes.bind(api, instituteId), function (result) {
			vm.exams = result;
			console.log(result);
			console.log('here');
		});
	}

  });
