'use strict';

describe('Directive: launchResult', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/launchResult/launchResult/launchResult.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<launch-result></launch-result>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the launchResult directive');
  }));
});