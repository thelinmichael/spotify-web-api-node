var mockery = require('mockery');
var Request = require("../src/base-request");

function useSuperagentMock(method, error, response) {
  // method
  // response
    // data
    // headers
    // statusCode

  var onEnd = function (callback) {
    if (error) {
      return callback(error)
    }
    callback(null, {
      body: response.data,
      headers: response.headers || {},
      statusCode: response.statusCode || 200
    });
  };

  var noop = function () {}

  var superagentMock = { };
  superagentMock[method] = function (url) {
    return {
      query: noop,
      send: noop,
      set: noop,
      end: onEnd
    }
  };

  mockery.registerMock('superagent', superagentMock);
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

      useSuperagentMock('get', null, {
        data: 'some data',
        headers: {},
        statusCode: 200
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

    it("Should process an error GET request", function(done) {

      useSuperagentMock('get', new Error('GET request error'));

      var HttpManager = require('../src/http-manager');
      var request = Request.builder()
        .withHost("such.api.wow")
        .withPort(1337)
        .withScheme("http")
        .build();

      HttpManager.get(request, function(errorObject) {
        errorObject.should.be.an.instanceOf(Error);
        errorObject.message.should.equal('GET request error');
        done();
      });
    });

    it("Should process an error GET request with an error message", function(done) {

      useSuperagentMock('get', new Error('There is a problem in your request'));

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
  });

  it("Should make a successful POST request", function(done) {

    useSuperagentMock('post', null, {
      data: 'some data',
      headers: {},
      statusCode: 200
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

    useSuperagentMock('put', null, {
      data: 'some data',
      headers: {},
      statusCode: 200
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

    useSuperagentMock('del', null, {
      data: 'some data',
      headers: {},
      statusCode: 200
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
