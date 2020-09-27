var Request = require('../src/base-request');
var superagent = require('superagent');
var WebApiError = require('../src/webapi-error');

describe('Make requests', () => {
  afterEach(() => {
    superagent.__reset();
    jest.restoreAllMocks();
  });

  describe('GET requests', () => {
    test('Should make a successful GET request', done => {
      superagent.__setMockResponse({
        status: 200,
        data: 'some data'
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('such.api.wow')
        .withPort(1337)
        .withScheme('http')
        .build();

      HttpManager.get(request, function(errorObject) {
        done(errorObject);
      });
    });

    test('Should process an error GET request', done => {
      superagent.__setMockError(new Error('GET request error'));

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('such.api.wow')
        .withPort(1337)
        .withScheme('http')
        .build();

      HttpManager.get(request, function(errorObject) {
        expect(errorObject).toBeInstanceOf(Error);
        expect(errorObject.message).toBe('GET request error');
        done();
      });
    });

    test('Should process an error GET request with an error message', done => {
      superagent.__setMockError(
        new Error('There is a problem in your request')
      );

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('such.api.wow')
        .withPort(1337)
        .withScheme('http')
        .build();

      HttpManager.get(request, function(errorObject) {
        expect(errorObject).toBeInstanceOf(Error);
        expect(errorObject.message).toBe('There is a problem in your request');
        done();
      });
    });

    test('Should process an error GET request with an error reason when detailed Web API error object is in response', done => {
      superagent.__setMockError({
        message: 'Generic Error Message',
        response: {
          body: {
            error: {
              message: 'Detailed Web API Error message',
              status: 400,
              reason: 'You messed up!'
            }
          }
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('such.api.wow')
        .withPort(1337)
        .withScheme('http')
        .build();

      HttpManager.get(request, function(errorObject) {
        expect(errorObject).toBeInstanceOf(Error);
        expect(errorObject.message).toBe('Detailed Web API Error message');
        expect(errorObject.reason).toBe('You messed up!');
        done();
      });
    });
  });

  test('Should make a successful POST request', done => {
    superagent.__setMockResponse({
      status: 200,
      data: 'some data'
    });
    var HttpManager = require('../src/http-manager');
    var request = Request.builder()
      .withHost('such.api.wow')
      .withPort(1337)
      .withScheme('http')
      .build();

    HttpManager.post(request, function(errorObject) {
      done(errorObject);
    });
  });

  test('Should make a successful PUT request', done => {
    superagent.__setMockResponse({
      status: 200,
      data: 'some data'
    });

    var HttpManager = require('../src/http-manager');
    var request = Request.builder()
      .withHost('such.api.wow')
      .withPort(1337)
      .withScheme('http')
      .build();

    HttpManager.put(request, function(errorObject) {
      done(errorObject);
    });
  });

  test('Should make a successful DELETE request', done => {
    superagent.__setMockResponse({
      status: 200,
      data: 'some data'
    });

    var HttpManager = require('../src/http-manager');
    var request = Request.builder()
      .withHost('such.api.wow')
      .withPort(1337)
      .withScheme('http')
      .build();

    HttpManager.del(request, function(errorObject) {
      done(errorObject);
    });
  });
});
