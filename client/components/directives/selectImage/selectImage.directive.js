'use strict';

angular.module('examApp')
	.controller('selectImageModalController', function ($scope,$log) {
		var vm = this;
		var maxImages = 18;

		vm.images = [];
		init();

		function init(){
			for(var i = 1; i <= 18; i++){
				vm.images.push(i);
			}
		}

		vm.selectImage = function(imageId) {
			$scope.$close(imageId);	
		};

	});


angular.module('examApp')
	.directive('selectImage', function () {
		return {
			templateUrl: 'components/directives/selectImage/selectImage.html',
			restrict: 'EA',
			scope: {
				selectedImage : '=',
			},
			bindToController: true,
			controllerAs: 'vm',
			controller: function ($uibModal, $log) {
				var vm = this;
				var modalInstance;

				vm.launchModal = function () {
					modalInstance = $uibModal.open({
						templateUrl: 'selectImage.html',
						controller: 'selectImageModalController',
						controllerAs: 'vm',
						bindToController:true,
						windowClass: 'modal-success'
					});

					modalInstance.result.then(function(selectedImage){
						$log.log('Inside Directive' + selectedImage);
						//vm.onImageSelected(selectedImage);
						vm.selectedImage = selectedImage;
					});

				};
			}
		};
	});