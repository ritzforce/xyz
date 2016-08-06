'use strict';

angular.module('examApp')
	.controller('MainCtrl', function ($state, $http, $log, $filter, api, Auth) {
	
		var vm = this;
		var PAGE_SIZE = 10;

		//Variables
		vm.categories = [];

		//Pagination and Search related variables
		vm.masterListExam = [];
		vm.allExamsChunk = [[]];
		vm.activeExams = [];
		vm.categoryName = '';
		vm.isAdmin = null;
		
		vm.searchBoxText = '';

		vm.total = 0;
		vm.currentPage = -1;

		init();

		//--Initialize 
		function init() {
			if(!Auth.isLoggedIn()){
				$state.go('login');
				return;
			}
			getCategories();
			loadAllExam();
			vm.isAdmin = Auth.isAdmin;
		}

	
		vm.hidePager = function(){
			if(vm.total < PAGE_SIZE){
				return true;
			}
			return false;
		};

		vm.pageChanged = function(){
			vm.activeExams = vm.allExamsChunk[vm.currentPage - 1];
		};

		vm.search = function () {
			vm.searchText = vm.searchBoxText;
			var filteredList = $filter('filter')(vm.masterListExam,vm.searchText);
			if(vm.categoryName){
				filteredList = $filter('filter')(filteredList,{category: vm.categoryName});
			}

			reGenerateChunks(filteredList);
		};

		vm.filterByCategory = function(categoryName){
			vm.categoryName = categoryName;
			vm.search();
		};

		/*********************************Private Functions**************************************/

		function reGenerateChunks(masterList){
			vm.allExamsChunk = _.chunk(masterList,PAGE_SIZE);
			vm.activeExams = vm.allExamsChunk[0];
			vm.currentPage = 1;
			vm.total = masterList.length;
		}


		/******************************************AJAX **************************************/
		function loadAllExam(){
			api.connectApi(vm,'Loading Exams...',api.getAllExams.bind(api), function(result){
				vm.masterListExam = result;
				reGenerateChunks(result);
			});	
		}

		function getCategories() {
			vm.isLoading = true;

			api.getCategories()
				.then(function (result) {
					vm.categories = result;
				})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

	});
