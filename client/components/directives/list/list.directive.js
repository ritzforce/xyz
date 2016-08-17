'use strict';

angular.module('examApp')
	.directive('list', function () {
		return {
			templateUrl: 'components/directives/list/list.html',
			restrict: 'EA',
			scope: {
				records: '=',
				headerFields: '=',
				fields: '=',
				showdelete: '=',
				showcheckbox: '=',
				filterText: '@',
				nameField: '@',
				titleText: '@',
				del: '&'
			},
			bindToController: true,
			controllerAs: 'vm',
			controller: function ($scope, $log, Modal) {
				var vm = this;
				vm.masterSelected = false;

				vm.delete = Modal.confirm.delete(function(record){
					vm.del()(record);
				});

				vm.setAll = function(){
					for(var i = 0; i < vm.records.length;i++) {
						vm.records[i].isSelected = vm.masterSelected;
					}
				};
			}
		};
	});