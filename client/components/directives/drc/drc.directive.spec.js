'use strict';

describe('Directive: drc', function () {

  // load the directive's module
  beforeEach(module('examApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drc></drc>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drc directive');
  }));
});