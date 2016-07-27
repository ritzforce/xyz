'use strict';

describe('Controller: MassUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('examApp'));

  var MassUploadCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MassUploadCtrl = $controller('MassUploadCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
