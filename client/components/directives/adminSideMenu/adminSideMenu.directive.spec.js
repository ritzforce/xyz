'use strict';

describe('Directive: adminSideMenu', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/adminSideMenu/adminSideMenu.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<admin-side-menu></admin-side-menu>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the adminSideMenu directive');
  }));
});