'use strict';

describe('Controller: AssignuserCtrl', function () {

  // load the controller's module
  beforeEach(module('examApp'));

  var AssignuserCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssignuserCtrl = $controller('AssignuserCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
