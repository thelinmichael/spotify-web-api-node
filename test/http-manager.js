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

  it("should make get request by using the request object", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search');
      should.not.exist(options.data);
      callback(null, {});
    });

    var request = WebApiRequest.builder()
        .withPath("/v1/search")
        .withQueryParameters({
          q : "overwerk",
          type : "album",
          limit : 1,
          offset: 2
        })
        .build();

    HttpManager.get(request, function(error, result) {
      should.not.exist(error);
      should.exist(result);
      done();
    });

  });

});
