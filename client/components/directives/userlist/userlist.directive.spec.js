'use strict';

describe('Directive: userlist', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/userlist/userlist.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<userlist></userlist>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the userlist directive');
  }));
});