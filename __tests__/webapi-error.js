var WebApiError = require('../src/webapi-error');

describe('Create Web Api Error', () => {
  test('should create error with message and status code', () => {
    var error = new WebApiError('Something has gone terribly wrong!', 500);
    expect(error.message).toBe('Something has gone terribly wrong!');
    expect(error.statusCode).toBe(500);
  });

  test('should create error with message, status code and reason if reason is provided', () => {
    var error = new WebApiError(
      'Something has gone terribly wrong!',
      500,
      'You messed up!'
    );
    expect(error.message).toBe('Something has gone terribly wrong!');
    expect(error.reason).toBe('You messed up!');
    expect(error.statusCode).toBe(500);
  });
});
