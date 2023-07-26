const {
  TimeoutError,
  WebapiError,
  WebapiRegularError,
  WebapiAuthenticationError,
  WebapiPlayerError
} = require('../src/response-error');

describe('Test error classes', () => {
  test('Timeout', done => {
    let error = new TimeoutError();

    expect(error.name).toBe('TimeoutError');
    expect(error.message).toBe(
      "A timeout occurred while communicating with Spotify's Web API."
    );
    done();
  });

  test('WebapiError', done => {
    const body = {
        success: false
      },
      headers = {
        'Content-Type': 'application/json',
        'X-Experimental': false
      },
      statusCode = 400,
      message = 'An unfortunate error occurred.';

    let error = new WebapiError(body, headers, statusCode, message);

    expect(error.name).toBe('WebapiError');
    expect(error.body).toBe(body);
    expect(error.headers).toBe(headers);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);

    done();
  });

  test('WebapiRegularError', done => {
    const body = {
        error: {
          message: 'Not found',
          status: 404
        }
      },
      headers = {
        'Content-Type': 'application/json',
        'X-Experimental': true
      },
      statusCode = 404,
      message =
        "An error occurred while communicating with Spotify's Web API.\nDetails: Not found.";

    let error = new WebapiRegularError(body, headers, statusCode, message);

    expect(error.name).toBe('WebapiRegularError');
    expect(error.body).toBe(body);
    expect(error.headers).toBe(headers);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);

    done();
  });

  test('WebapiAuthenticationError', done => {
    const body = {
        error: 'invalid client id',
        error_description: 'Invalid Client ID'
      },
      headers = {
        'Content-Type': 'application/json'
      },
      statusCode = 400,
      message =
        "An authentication error occurred while communicating with Spotify's Web API.\nDetails: invalid client id Invalid Client ID.";

    let error = new WebapiAuthenticationError(
      body,
      headers,
      statusCode,
      message
    );

    expect(error.name).toBe('WebapiAuthenticationError');
    expect(error.body).toBe(body);
    expect(error.headers).toBe(headers);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);

    done();
  });

  test('WebapiPlayerError', done => {
    const body = {
        error: {
          message: 'Not allowed to shuffle',
          status: 403,
          reason: 'Not premium'
        }
      },
      headers = {
        'Content-Type': 'application/json'
      },
      statusCode = 403,
      message =
        "An error occurred while communicating with Spotify's Web API.\nDetails: Not allowed to shuffle Not premium.";

    let error = new WebapiPlayerError(body, headers, statusCode, message);

    expect(error.name).toBe('WebapiPlayerError');
    expect(error.body).toBe(body);
    expect(error.headers).toBe(headers);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);

    done();
  });
});
