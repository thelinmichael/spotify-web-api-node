var Request = require('../src/base-request'),
  {
    TimeoutError,
    WebapiError,
    WebapiRegularError,
    WebapiAuthenticationError,
    WebapiPlayerError
  } = require('../src/response-error');

var HttpManager = require('../src/http-manager');
var request = Request.builder()
  .withHost('such.api.wow')
  .withPort(1337)
  .withScheme('http')
  .build();

describe('Make requests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should make a successful GET request', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify('some data'),
      status: 200,
      headers: { 'content-type': 'application/json' }
    }));

    HttpManager.get(request, function (error, result) {
      expect(result.body).toBe('some data');
      expect(result.statusCode).toBe(200);
      expect(result.headers.get('Content-Type')).toBe('application/json');
      done(error);
    });
  });

  test('Should process an error of unknown type', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify('GET request error'),
      headers: {},
      status: 400
    }));

    HttpManager.get(request, function (error, result) {
      expect(error).toBeInstanceOf(WebapiError);
      expect(error.message).toBe('GET request error');
      expect(result).toBeFalsy();
      done();
    });
  });

  test('Should process an error of regular type', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify({
        error: {
          status: 400,
          message: 'There is a problem in your request'
        }
      }),
      headers: {},
      status: 400
    }));

    HttpManager.get(request, function (error) {
      expect(error).toBeInstanceOf(WebapiRegularError);
      expect(error.message).toBe(
        "An error occurred while communicating with Spotify's Web API.\nDetails: There is a problem in your request."
      );
      done();
    });
  });

  test('Should process an error of player type', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify({
        error: {
          message: 'Detailed Web API Error message',
          status: 400,
          reason: 'You messed up!'
        }
      }),
      status: 400,
      headers: {}
    }));

    HttpManager.get(request, function (error) {
      expect(error).toBeInstanceOf(WebapiPlayerError);
      expect(error.message).toBe(
        "An error occurred while communicating with Spotify's Web API.\nDetails: Detailed Web API Error message You messed up!."
      );
      expect(error.body.error.reason).toBe('You messed up!');
      expect(error.body.error.message).toBe('Detailed Web API Error message');
      done();
    });
  });

  test('should process error of authentication type', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify({
        error: 'invalid_client',
        error_description: 'Invalid client'
      }),
      headers: { 'Content-Type': 'application/json' },
      status: 400
    }));

    HttpManager.get(request, function (error) {
      expect(error).toBeInstanceOf(WebapiAuthenticationError);
      expect(error.statusCode).toBe(400);
      expect(error.headers.get('Content-Type')).toBe('application/json');
      expect(error.message).toBe(
        "An authentication error occurred while communicating with Spotify's Web API.\nDetails: invalid_client Invalid client."
      );

      done();
    });
  });

  test('should process error of authentication type with missing description', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify({
        error: 'invalid_client'
      }),
      headers: { 'Content-Type': 'application/json' },
      status: 400
    }));

    HttpManager.get(request, function (error) {
      expect(error).toBeInstanceOf(WebapiAuthenticationError);
      expect(error.message).toBe(
        "An authentication error occurred while communicating with Spotify's Web API.\nDetails: invalid_client."
      );

      done();
    });
  });

  test('Should get Retry Headers', done => {
    fetch.mockResponse(async () => ({
      body: JSON.stringify({
        error: {
          message: 'Rate limit exceeded',
          status: 429
        }
      }),
      status: 429,
      headers: { 'Retry-After': '5' }
    }));

    HttpManager.get(request, function (error) {
      expect(error).toBeInstanceOf(WebapiRegularError);
      expect(error.body.error.message).toBe('Rate limit exceeded');
      expect(error.headers.get('Retry-After')).toBe('5');
      expect(error.message).toBe(
        "An error occurred while communicating with Spotify's Web API.\nDetails: Rate limit exceeded."
      );
      done();
    });
  });

  test('Should make a successful POST request', done => {
    fetch.mockResponse(async () => ({
      status: 200,
      body: JSON.stringify('some data')
    }));

    HttpManager.post(request, function (error, response) {
      expect(response.body).toBe('some data');
      done(error);
    });
  });

  test('Should make a successful PUT request', done => {
    fetch.mockResponse(async () => ({
      status: 200,
      body: JSON.stringify('some data')
    }));

    HttpManager.put(request, function (error, response) {
      expect(response.body).toBe('some data');
      done(error);
    });
  });

  test('Should make a successful DELETE request', done => {
    fetch.mockResponse(async () => ({
      status: 200,
      body: JSON.stringify('some data')
    }));

    HttpManager.del(request, function (error, response) {
      expect(response.body).toBe('some data');
      done(error);
    });
  });

  test('Should handle timeouts', done => {
    fetch.mockResponse(
      async () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                status: 204
              }),
            100
          )
        )
    );

    var timeoutRequest = Request.builder()
      .withHost('such.api.wow')
      .withPort(1337)
      .withScheme('http')
      .withTimeout(10)
      .build();

    HttpManager.get(timeoutRequest, function (error) {
      console.log(error);
      expect(error).toBeInstanceOf(TimeoutError);
      done();
    });
  });

  test('Should handle arbitrary exceptions', done => {
    fetch.mockReject(new Error('ops'));

    HttpManager.get(request, function (error) {
      expect(error).toBeInstanceOf(Error);
      done();
    });
  });
});
