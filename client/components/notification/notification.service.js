'use strict';

angular.module('examApp')
	.factory('notification', function () {
		
		var saveMessageOption = { 'closeButton': true, 'timeOut':2000,
		                          'positionClass': 'toast-top-right'};
		var displayProgress = {'closeButton': false, 'extendedTimeOut': 0, tapToDismiss : false, 
		                       'positionClass': 'toast-top-center', 'timeOut': 0,'preventDuplicates': false};
		var lastToastr = null;					   
		
		return {
			success: function (title, message) {
				return toastr.success(message, title, saveMessageOption);
			},
			error: function (title, message) {
				return toastr.error(message, title, saveMessageOption);
			},
			info: function (title, message) {
				return toastr.info(message, title, saveMessageOption);
			},
			notify: function(message){
				if(lastToastr){
					lastToastr.remove();
				}
				lastToastr = toastr.info('<i class="fa fa-refresh fa-spin fa-fw"></i>  ' + message, null, displayProgress);
			},
			hide: function(){
				if(lastToastr){
					lastToastr.remove();
				}
			}

		};
	});
