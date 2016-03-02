var mockery = require('mockery');
var Request = require("../src/base-request");

function useRestlerMock(options) {
  // method
  // event
  // response
    // data
    // headers
    // statusCode

  var onFunction = function (event, callback) {
    if (event === (options.event || 'success')) {
      callback(options.response.data, {
        headers: options.response.headers || {},
        statusCode: options.response.statusCode || 200
      });
    }
    return {on: onFunction};
  };

  var restlerMock = { };
  restlerMock[options.method] = function (url, opt) {
    return { on: onFunction }
  };

  mockery.registerMock('restler', restlerMock);
}

describe("Make requests", function() {

  beforeEach(function(){

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  describe("GET requests", function() {

    it("Should make a successful GET request", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'success',
        response: {
          data: 'some data',
          headers: {},
          statusCode: 200
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        done(errorObject);
      });
    });

    it("Should process a failing GET request with a generic error", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'fail',
        response: {
          data: null,
          headers: {},
          statusCode: 500
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        done();
      });
    });

    it("Should process a failing GET request with a string error", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'fail',
        response: {
          data: 'There was a problem processing your request',
          headers: {},
          statusCode: 500
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('Request failed: \"There was a problem processing your request\"');
        done();
      });
    });

    it("Should process a failing GET request with a Web API error object with description", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'fail',
        response: {
          data: { error:'Unknown user', error_description: 'User does not exist' },
          headers: {},
          statusCode: 404
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('Unknown user: User does not exist');
        done();
      });
    });

    it("Should process a failing GET request with a JSON string formatted error object with message and status", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'fail',
        response: {
          data: '{ "error": { "message": "API rate limit exceeded", "status": 429 } }',
          headers: {},
          statusCode: 429
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('API rate limit exceeded');
        errorObject.statusCode.should.equal(429)
        done();
      });
    });

    it("Should process a failing GET request with a Web API error object with message", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'fail',
        response: {
          data: { error: { message:'User does not exist' }},
          headers: {},
          statusCode: 404
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('User does not exist');
        done();
      });
    });

    it("Should process an error GET request", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'error',
        response: {
          data: null,
          headers: {},
          statusCode: 401
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('Request error');
        done();
      });
    });

    it("Should process an error GET request with an error message", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'error',
        response: {
          data: { error: { message:'There is a problem in your request' }},
          headers: {},
          statusCode: 401
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('There is a problem in your request');
        done();
      });
    });

    it("Should process a timing out GET request", function(done) {

      useRestlerMock({
        method: 'get',
        event: 'timeout',
        response: {
          data: 2000,
          headers: {},
          statusCode: 404
        }
      });

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('Request timed out (2000)');
        done();
      });
    });
  });

  it("Should make a successful POST request", function(done) {

    useRestlerMock({
      method: 'post',
      event: 'success',
      response: {
        data: 'some data',
        headers: {},
        statusCode: 200
      }
    });

    var HttpManager = require('../src/http-manager');
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .build();

    HttpManager.post(request, function(errorObject) {
      done(errorObject);
    });
  });

  it("Should make a successful PUT request", function(done) {

    useRestlerMock({
      method: 'put',
      event: 'success',
      response: {
        data: 'some data',
        headers: {},
        statusCode: 200
      }
    });

    var HttpManager = require('../src/http-manager');
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .build();

    HttpManager.put(request, function(errorObject) {
      done(errorObject);
    });
  });

  it("Should make a successful DELETE request", function(done) {

    useRestlerMock({
      method: 'del',
      event: 'success',
      response: {
        data: 'some data',
        headers: {},
        statusCode: 200
      }
    });

    var HttpManager = require('../src/http-manager');
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .build();

    HttpManager.del(request, function(errorObject) {
      done(errorObject);
    });
  });
});
