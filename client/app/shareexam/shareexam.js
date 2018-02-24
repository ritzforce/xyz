'use strict';

angular.module('examApp')
  .config(function ($stateProvider) {
    $stateProvider
	  .state('shareInstitute', {
			url: '/share/exam/:examId/:examName',
			templateUrl: 'app/shareexam/shareexam.html',
			controller: 'ShareexamCtrl',
			controllerAs: 'vm',
			admin: true
	   })
		.state('shareExam', {
			url: '/share/institute/:instituteId/:instituteName',
			templateUrl: 'app/shareexam/shareexam.html',
			controller: 'ShareexamCtrl',
			controllerAs: 'vm',
			admin: true
		});

  });