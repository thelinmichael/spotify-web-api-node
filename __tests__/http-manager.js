var Request = require('../src/base-request'),
    superagent = require('superagent'),
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

  afterEach(() => {
    superagent.__reset();
    jest.restoreAllMocks();
  });

  test('Should make a successful GET request', done => {
    superagent.__setMockResponse({
      statusCode: 200,
      headers: { 'Content-Type' : 'application/json' },
      body: 'some data'
    });

    HttpManager.get(request, function(error, result) {
      expect(result.body).toBe('some data');
      expect(result.statusCode).toBe(200);
      expect(result.headers['Content-Type']).toBe('application/json');

      done(error);
    });
  });

  test('Should process an error of unknown type', done => {
    superagent.__setMockError({ 
      response : { 
        body: 'GET request error', 
        headers : {}, 
        statusCode: 400 
      } 
    });

    HttpManager.get(request, function(error, result) {
      expect(error).toBeInstanceOf(WebapiError);
      expect(error.message).toBe('GET request error');
      done();
    });
  });

  test('Should process an error of regular type', done => {
    superagent.__setMockError({ 
        response : { 
          body : {
            error: {
              status : 400,
              message : 'There is a problem in your request'
            },
          },
          headers : {},
          statusCode : 400
        }
    });

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(WebapiRegularError);
      expect(error.message).toBe('An error occurred while communicating with Spotify\'s Web API.\nDetails: There is a problem in your request.');
      done();
    });
  });

  test('Should process an error of player type', done => {
    superagent.__setMockError({
      response: {
        body: {
          error : {
            message: 'Detailed Web API Error message',
            status: 400,
            reason: 'You messed up!'
          }
        },
        statusCode : 400,
        headers : []
      }
    });

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(WebapiPlayerError);
      expect(error.message).toBe('An error occurred while communicating with Spotify\'s Web API.\nDetails: Detailed Web API Error message You messed up!.');
      expect(error.body.error.reason).toBe('You messed up!');
      expect(error.body.error.message).toBe('Detailed Web API Error message');
      done();
    });
  });

  test('should process error of authentication type', done => {
    superagent.__setMockError({
      response : {
        body : {
          error: 'invalid_client',
          error_description : 'Invalid client'
        },
        headers: { 'Content-Type' : 'application/json'},
        statusCode : 400
      }
    });

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(WebapiAuthenticationError);
      expect(error.statusCode).toBe(400);
      expect(error.headers['Content-Type']).toBe('application/json');
      expect(error.message).toBe('An authentication error occurred while communicating with Spotify\'s Web API.\nDetails: invalid_client Invalid client.');

      done();
    });

  });

  test('should process error of authentication type with missing description', done => {
    superagent.__setMockError({
      response : {
        body : {
          error: 'invalid_client'
        },
        headers: { 'Content-Type' : 'application/json'},
        statusCode : 400
      }
    });

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(WebapiAuthenticationError);
      expect(error.message).toBe('An authentication error occurred while communicating with Spotify\'s Web API.\nDetails: invalid_client.');

      done();
    });

  });

  test('Should get Retry Headers', done => {
    superagent.__setMockError({
      response: {
        body: {
          error : {
            message: 'Rate limit exceeded',
            status : 429
          }
        },
        statusCode : 429,
        headers : { 'Retry-After' : '5' }
      }
    });

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(WebapiRegularError);
      expect(error.body.error.message).toBe('Rate limit exceeded');
      expect(error.headers['Retry-After']).toBe('5');
      expect(error.message).toBe('An error occurred while communicating with Spotify\'s Web API.\nDetails: Rate limit exceeded.')
      done();
    });
  });

  test('Should make a successful POST request', done => {
    superagent.__setMockResponse({
      status: 200,
      data: 'some data'
    });

    HttpManager.post(request, function(error) {
      done(error);
    });
  });

  test('Should make a successful PUT request', done => {
    superagent.__setMockResponse({
      status: 200,
      data: 'some data'
    });

    HttpManager.put(request, function(error) {
      done(error);
    });
  });

  test('Should make a successful DELETE request', done => {
    superagent.__setMockResponse({
      status: 200,
      data: 'some data'
    });

    HttpManager.del(request, function(error) {
      done(error);
    });
  });

  test('Should handle timeouts', done => {
    superagent.__setMockError({
      timeout: true
    });

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(TimeoutError);
      done();
    });
  });

  test('Should handle arbitrary exceptions', done => {
    superagent.__setMockError(new Error('ops'));

    HttpManager.get(request, function(error) {
      expect(error).toBeInstanceOf(Error);
      done();
    });
  });
});

