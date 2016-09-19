'use strict';

angular.module('examApp')
	.factory('Auth', function Auth($log, $window, $location, $rootScope, $http, User, api, $cookieStore, $q) {
		var currentUser = {};
		
		function loadCurrentUserFromDatabase() {			
			return api.getMe().then(function(user){
				if(user === null){
					throw Error('User not found in the database');
				}
				currentUser = user;
				return user;
			})
			.catch(function(err){
				$log.error(err);
				//$window.alert('Error in getting current user');
			});
		}

		if ($cookieStore.get('token')) {
			loadCurrentUserFromDatabase();
		}

		return {
			login: function(user){
				var deferred = $q.defer();
				var that = this;

				$http.post('/auth/local',{
					email: user.email,
					password: user.password
				})
				.then(function(response){

					var data = response.data;
					$cookieStore.put('token', data.token);
					
				})
				.then(function(){
					return loadCurrentUserFromDatabase();
				})
				.then(function(dbUser){
					deferred.resolve(dbUser);
				})
				.catch(function (err) {
					$log.error(err);
					that.logout();
					deferred.reject(err);
				});

				return deferred.promise;
			},

			/**
			 * Authenticate user and save token
			 *
			 * @param  {Object}   user     - login info
			 * @param  {Function} callback - optional
			 * @return {Promise}
			 */
			login1: function (user, callback) {
				var cb = callback || angular.noop;
				var deferred = $q.defer();

				$http.post('/auth/local', {
					email: user.email,
					password: user.password
				}).
				success(function (data) {
					
					$cookieStore.put('token', data.token);
					return User.get();

				}).
				then(function(dbUser){
					currentUser = dbUser;
					deferred.resolve(currentUser);
					return cb();
				})
				.error(function (err) {
					$log.error(err);
					this.logout();
					deferred.reject(err);
					return cb(err);
				}.bind(this));

				return deferred.promise;
			},

			/**
			 * Delete access token and user info
			 *
			 * @param  {Function}
			 */
			logout: function () {
				$cookieStore.remove('token');
				currentUser = {};
			},


			/**
			 * 
			 */
			saveToken: function(data, cb){
				$cookieStore.put('token', data.token);
				loadCurrentUserFromDatabase();
			},

			/**
			 * Create a new user
			 *
			 * @param  {Object}   user     - user info
			 * @param  {Function} callback - optional
			 * @return {Promise}
			 */
			createUser1: function (user, callback) {
				var cb = callback || angular.noop;
				this.logout();
				
				return User.save(user,
					function (data) {
						$cookieStore.put('token', data.token);
						currentUser = User.get();
						return cb(user);
					},
					function (err) {
						this.logout();
						return cb(err);
					}.bind(this)).$promise;
			},

			/**
			 * Change password
			 *
			 * @param  {String}   oldPassword
			 * @param  {String}   newPassword
			 * @param  {Function} callback    - optional
			 * @return {Promise}
			 */
			changePassword: function (oldPassword, newPassword, callback) {
				var cb = callback || angular.noop;

				return User.changePassword({ id: currentUser._id }, {
					oldPassword: oldPassword,
					newPassword: newPassword
				}, function (user) {
					return cb(user);
				}, function (err) {
					return cb(err);
				}).$promise;
			},

			/**
			 * Gets all available info on authenticated user
			 *
			 * @return {Object} user
			 */
			getCurrentUser: function () {
				return currentUser;
			},

			/**
			 * Check if a user is logged in
			 *
			 * @return {Boolean}
			 */
			isLoggedIn: function () {
				return currentUser.hasOwnProperty('role');
			},

			/**
			 * Waits for currentUser to resolve before checking if user is logged in
			 */
			isLoggedInAsync: function (cb) {
				if (currentUser.hasOwnProperty('$promise')) {
					currentUser.$promise.then(function () {
						cb(true);
					}).catch(function () {
						cb(false);
					});
				} else if (currentUser.hasOwnProperty('role')) {
					cb(true);
				} else {
					cb(false);
				}
			},

			/**
			 * Check if a user is an admin
			 *
			 * @return {Boolean}
			 */
			isAdmin: function () {
				return currentUser.role === 'admin';
			},

			/**
			 * Get auth token
			 */
			getToken: function () {
				return $cookieStore.get('token');
			}
		};
	});
