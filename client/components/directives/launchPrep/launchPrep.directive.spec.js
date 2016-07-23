'use strict';

describe('Directive: launchPrep', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/launchPrep/launchPrep.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<launch-prep></launch-prep>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the launchPrep directive');
  }));
});