'use strict';

describe('Directive: selectImage', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/directives/selectImage/selectImage.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<select-image></select-image>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the selectImage directive');
  }));
});