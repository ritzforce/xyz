'use strict';

describe('Directive: launchCorrectAnswer', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/launchCorrectAnswer/launchCorrectAnswer.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<launch-correct-answer></launch-correct-answer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the launchCorrectAnswer directive');
  }));
});