'use strict';

describe('Service: mockData', function () {

  // load the service's module
  beforeEach(module('examApp'));

  // instantiate service
  var mockData;
  beforeEach(inject(function (_mockData_) {
    mockData = _mockData_;
  }));

  it('should do something', function () {
    expect(!!mockData).toBe(true);
  });

});
