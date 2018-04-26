var WebApiRequest = require('../src/webapi-request'),
  should = require('should');

describe('Create Web Api Requests', function() {
  it('Should use default settings if none are supplied', function() {
    var request = WebApiRequest.builder('token').build();

    request.getHost().should.equal('api.spotify.com');
    request.getPort().should.equal(443);
    request.getScheme().should.equal('https');
    should.exist(request.getHeaders().Authorization);
    should.not.exist(request.getPath());
    should.not.exist(request.getQueryParameters());
    should.not.exist(request.getBodyParameters());
  });

  it('Can overwrite one of the default parameters', function() {
    var request = WebApiRequest.builder('token')
      .withHost('such.host.wow')
      .build();

    request.getHost().should.equal('such.host.wow');
    request.getPort().should.equal(443);
    request.getScheme().should.equal('https');
    should.exist(request.getHeaders().Authorization);
    should.not.exist(request.getPath());
    should.not.exist(request.getQueryParameters());
    should.not.exist(request.getBodyParameters());
  });
});
