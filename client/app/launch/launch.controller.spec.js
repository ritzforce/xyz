'use strict';

describe('Controller: LaunchCtrl', function () {

  // load the controller's module
  beforeEach(module('examApp'));

  var LaunchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LaunchCtrl = $controller('LaunchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
