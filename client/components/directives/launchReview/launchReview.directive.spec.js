'use strict';

describe('Directive: launchReview', function () {

  // load the directive's module and view
  beforeEach(module('examApp'));
  beforeEach(module('components/launchReview/launchReview/launchReview.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<launch-review></launch-review>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the launchReview directive');
  }));
});