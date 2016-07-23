'use strict';

angular.module('examApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    var vm = this;
   

    //Set Initial Values
    function init(){
      vm.isCollapsed = true;
      vm.isLoggedIn = Auth.isLoggedIn;
      vm.isAdmin = Auth.isAdmin;

      console.log('**is Logged In***');
      console.log(vm.isLoggedIn());
      
      console.log('***vm.isAdmin***');
      console.log(vm.isAdmin());
      
      //console.log(value.isAdmin());

      vm.getCurrentUser = Auth.getCurrentUser;
    }

    //Logout the user
    vm.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    //Check if the Current User is Active
    vm.isActive = function(route) {
      return route === $location.path();
    };

    init();
  });