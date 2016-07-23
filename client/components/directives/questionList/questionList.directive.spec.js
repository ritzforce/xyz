'use strict';

describe('Directive: questionList', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/questionList/questionList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<question-list></question-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the questionList directive');
  }));
});