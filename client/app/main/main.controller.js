'use strict';

angular.module('examApp')
	.controller('MainCtrl', function ($scope, $http, $log, $filter, api, Auth) {
		$scope.awesomeThings = [];

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
			loadAllExam();
			getCategories();
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
			vm.isLoading = true;

			api.getAllExams()
			.then(function(result){
				//Contains all data in chunked format
				vm.masterListExam = result;
				reGenerateChunks(result);
				
			})
			.catch(function(err){
				console.log(err);
			})
			.finally(function(){
				vm.isLoading = false;
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
