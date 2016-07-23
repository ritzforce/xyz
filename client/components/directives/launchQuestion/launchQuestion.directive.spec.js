'use strict';

describe('Directive: launchQuestion', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/launchQuestion/launchQuestion.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<launch-question></launch-question>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the launchQuestion directive');
  }));
});