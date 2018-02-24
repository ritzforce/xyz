'use strict';

angular.module('examApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    var vm = this;
   

    //Set Initial Values
    function init(){
      vm.isCollapsed = true;
      vm.isLoggedIn = Auth.isLoggedIn;
      vm.isAdmin = Auth.isAdmin;
	  
      vm.getCurrentUser = Auth.getCurrentUser;
      vm.getCurrentInstitute = Auth.getCurrentInstitute;
    }

    vm.name = function() {
      var result = Auth.getCurrentInstitute();
     
      if (result == null || result.name == null) {
         return 'Exam Center';
      }
      return result.name;
    }

    vm.contactAddress = function() {
       var completeAddress = vm.address() + '\n' + vm.contact();
       return completeAddress.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    

    vm.contact = function() {
      var result = Auth.getCurrentInstitute();
      var contactString = '';

      if (result == null || result.phone == null) {
        contactString += "Call Us: 9950072039, 7821932915";
      }
      else {
        contactString += 'Call Us: ' + result.phone;
      }

      if (result == null || result.email == null) {
        contactString += " | Email To: <a href='mailto:rscitsharma@gmail.com'>rscitsharma@gmail.com</a>" ;
      }
      else {
        contactString += " | Email To: <a href=" + result.email + ">" + result.email + "</a>"
      }

      return contactString;     
    }

    vm.address = function() {
      var result = Auth.getCurrentInstitute();
      if (result == null || result.address == null) {
         return "D-13, Bapu Nagar Senthi, Road No. 8, Chittorgarh(Raj.)<br/>" + 
                "B-13, S.K. Plaza, Maharana Pratap Setu Marg, Near Head Post Office, Chittorgarh (Raj.) ";
      }
      return result.address;
    }

    vm.logo = function() {
       var result = Auth.getCurrentInstitute();
       if (result == null || result.logo == null) {
          return 'assets/images/logo1.png';
       }
       return result.logo;
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