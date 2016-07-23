'use strict';

describe('Directive: categoryList', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/categoryList/categoryList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<category-list></category-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the categoryList directive');
  }));
});