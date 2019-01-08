var Request = require('../src/base-request');
var superagent = require('superagent-proxy')(require('superagent'));

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

  describe('Requests proxified', () => {
    const OLD_ENV = process.env;
    const HTTP_PROXY = 'http://proxy.com';
    const HTTPS_PROXY = 'https://proxy.com';
    const NO_PROXY = 'without.proxy';

    beforeAll(() => {
      process.env = { ...OLD_ENV };
      process.env.http_proxy = HTTP_PROXY;
      process.env.https_proxy = HTTPS_PROXY;
      process.env.no_proxy = NO_PROXY;
    });

    beforeEach(() => {
      superagent.proxy.mockReset();

      superagent.__setMockResponse({
        status: 200,
        data: 'some data'
      });
    });

    afterAll(() => {
      process.env = OLD_ENV;
    });

    test('Should make a successful HTTP GET request with proxy', done => {
      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('such.api.wow')
        .withPort(80)
        .withScheme('http')
        .build();

      HttpManager.get(request, function(errorObject) {
        expect(superagent.proxy.mock.calls[0][0]).toBe(HTTP_PROXY);
        done(errorObject);
      });
    });

    test('Should make a successful HTTPS GET request with proxy', done => {
      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('such.api.wow')
        .withPort(443)
        .withScheme('https')
        .build();

      HttpManager.get(request, function(errorObject) {
        expect(superagent.proxy.mock.calls[0][0]).toBe(HTTPS_PROXY);
        done(errorObject);
      });
    });

    test('Should make a successful GET request with url domain in no proxy', done => {
      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost('url.without.proxy')
        .withPort(80)
        .withScheme('http')
        .build();

      HttpManager.get(request, function(errorObject) {
        expect(superagent.proxy.mock.calls[0][0]).toBeNull();
        done(errorObject);
      });
    });
  });
});
