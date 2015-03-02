var restler = require('restler'),
    HttpManager = require('../src/http-manager'),
    WebApiRequest = require("../src/webapi-request"),
    sinon = require('sinon'),
    should = require('should');

describe("Make requests", function() {

  beforeEach(function(done){
    done();
  });

  afterEach(function(done){
    if (typeof HttpManager._makeRequest.restore == 'function') {
      HttpManager._makeRequest.restore();
    }
    done();
  });

});
