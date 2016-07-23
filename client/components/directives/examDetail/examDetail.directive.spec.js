'use strict';

describe('Directive: examDetail', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/examDetail/examDetail.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<exam-detail></exam-detail>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the examDetail directive');
  }));
});