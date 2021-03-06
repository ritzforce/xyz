'use strict';

angular.module('examApp')
  .controller('CategoryCtrl', function ($state, $stateParams, $log, $location, api,notification, Modal) {
    var vm = this;
	vm.allCategory = [];
	vm.category = {};
	vm.editMode = null;
	vm.headerText = null;
	vm.error = '';

	init();
	function init() {
		var currentPath = $location.path();
		//edit or new mode
		if(currentPath.indexOf('/e') > -1) {
			vm.editMode = true;
			if($stateParams.categoryId) {
				getCategory($stateParams.categoryId);
			}
			else {
				vm.headerText = 'New Category';
			}
		}
		else {
			vm.editMode = false;
			getAllCategories();
		}
	}

	function getAllCategories(){
		api.connectApi(vm,'Loading...',api.getCategoriesForAdmin.bind(api), function(result){
			vm.allCategory = result;
		});
	}

	function getCategory(categoryId){
		api.connectApi(vm,'Loading...',api.getCategory.bind(api,categoryId), function(result){
			vm.category = result;
			vm.headerText = 'Edit Category - ' + vm.category.name;
			vm.oldText = vm.category.name;
		});
	}

	/***********************************************************************************/
	vm.addCategory = function(){
		$state.go('categoryEdit');
	};

	vm.save = function(){
		api.connectApi(vm,'Saving..',api.saveCategory.bind(api,vm.category), function(result){
			$state.go('category');	
		});
	};

	vm.cancel = function(){
		$state.go('category');
	};

	vm.delete = Modal.confirm.delete(function (record) {
		api.connectApi(vm,'Deleting...',api.deleteCategory.bind(api, record.id), function(result){
			notification.info('Category', record.name + ' deleted successfully');
			$state.reload();
		});
	});
});
