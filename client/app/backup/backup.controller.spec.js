'use strict';

describe('Controller: BackupCtrl', function () {

  // load the controller's module
  beforeEach(module('examApp'));

  var BackupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BackupCtrl = $controller('BackupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
