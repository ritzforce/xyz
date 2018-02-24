'use strict';

angular.module('examApp')
  .controller('StatsCtrl', function ($state, $stateParams, $log, api, notification, Auth) {
     var vm = this;
     vm.stats = {};

     init();

     function init() {
      vm.isSuperAdmin = Auth.isSuperAdmin;

     	loadStats();
     }

     function loadStats(){
		    api.connectApi(vm, 'Loading...', api.stats.bind(api, 1), function (result) {
			   vm.stats = result;
		  });
		
	}

});
