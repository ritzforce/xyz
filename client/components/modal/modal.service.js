'use strict';

angular.module('examApp')
	.factory('Modal', function ($rootScope, $uibModal) {
		/**
		 * Opens a modal
		 * @param  {Object} scope      - an object to be merged with modal's scope
		 * @param  {String} modalClass - (optional) class(es) to be applied to the modal
		 * @return {Object}            - the instance $modal.open() returns
		 */
		function openModal(scope, modalClass) {
			var modalScope = $rootScope.$new();
			scope = scope || {};
			modalClass = modalClass || 'modal-default';

			angular.extend(modalScope, scope);

			return $uibModal.open({
				templateUrl: 'components/modal/modal.html',
				windowClass: modalClass,
				scope: modalScope
			});
		}

		// Public API here
		return {

			/* Confirmation modals */
			confirm: {

				question: function (ques) {
					ques = ques || angular.noop;

					/**
					 * Open a delete confirmation modal
					 * @param  {String} name   - name or info to show on modal
					 * @param  {All}           - any additional args are passed staight to del callback
					 */
					return function () {
						var args = Array.prototype.slice.call(arguments),
							operation = args.shift(),
							name = args.shift(),
							questionModal;

						questionModal = openModal({
							modal: {
								dismissable: true,
								title: 'Confirm ' + operation,
								html: '<p>Are you sure you want to '  + operation +  ' <strong>' + name + '</strong> ?</p>',
								buttons: [{
									classes: 'btn-success',
									text: 'OK',
									click: function (e) {
										questionModal.close(e);
									}
								}, {
										classes: 'btn-default',
										text: 'Cancel',
										click: function (e) {
											questionModal.dismiss(e);
										}
									}]
							}
						}, 'modal-success');

						questionModal.result.then(function (event) {
							ques.apply(event, args);
						});
					};		
				
				},

				/**
				 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
				 * @param  {Function} del - callback, ran when delete is confirmed
				 * @return {Function}     - the function to open the modal (ex. myModalFn)
				 */
				delete: function (del) {
					del = del || angular.noop;

					/**
					 * Open a delete confirmation modal
					 * @param  {String} name   - name or info to show on modal
					 * @param  {All}           - any additional args are passed staight to del callback
					 */
					return function () {
						var args = Array.prototype.slice.call(arguments),
							name = args.shift(),
							deleteModal;

						deleteModal = openModal({
							modal: {
								dismissable: true,
								title: 'Confirm Delete',
								html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
								buttons: [{
									classes: 'btn-danger',
									text: 'Delete',
									click: function (e) {
										deleteModal.close(e);
									}
								}, {
										classes: 'btn-default',
										text: 'Cancel',
										click: function (e) {
											deleteModal.dismiss(e);
										}
									}]
							}
						}, 'modal-danger');

						deleteModal.result.then(function (event) {
							del.apply(event, args);
						});
					};
				}
			}

		};

	});
