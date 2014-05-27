var AuthenticationRequest = require("../src/authentication-request"),
    should = require("should");

describe("Create Authentication Requests", function() {

  it("Should use default settings if none are supplied", function() {
    var request = AuthenticationRequest.builder().build();

    request.getHost().should.equal("accounts.spotify.com");
    request.getPort().should.equal(443);
    request.getScheme().should.equal("https");
    should.not.exist(request.getHeaders());
    should.not.exist(request.getPath());
    should.not.exist(request.getQueryParameters());
    should.not.exist(request.getBodyParameters());
  });

  it("Can overwrite one of the default parameters", function() {
    var request = AuthenticationRequest.builder().withHost("such.host.wow").build();

    request.getHost().should.equal("such.host.wow");
    request.getPort().should.equal(443);
    request.getScheme().should.equal("https");
    should.not.exist(request.getHeaders());
    should.not.exist(request.getPath());
    should.not.exist(request.getQueryParameters());
    should.not.exist(request.getBodyParameters());
  });

});