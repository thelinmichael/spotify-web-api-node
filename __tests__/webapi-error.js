var WebApiError = require('../src/webapi-error');

describe('Create Web Api Error', () => {
  test('should create error with message and status code', () => {
    var error = new WebApiError('Something has gone terribly wrong!', 500);
    expect(error.message).toBe('Something has gone terribly wrong!');
    expect(error.statusCode).toBe(500);
  });
});
