var AuthenticationRequest = require('../src/authentication-request');

describe('Create Authentication Requests', () => {
  test('Should use default settings if none are supplied', () => {
    var request = AuthenticationRequest.builder().build();

    expect(request.getHost()).toBe('accounts.spotify.com');
    expect(request.getPort()).toBe(443);
    expect(request.getScheme()).toBe('https');
    expect(request.getHeaders()).toBeFalsy();
    expect(request.getPath()).toBeFalsy();
    expect(request.getQueryParameters()).toBeFalsy();
    expect(request.getBodyParameters()).toBeFalsy();
  });

  test('Can overwrite one of the default parameters', () => {
    var request = AuthenticationRequest.builder()
      .withHost('such.host.wow')
      .build();

    expect(request.getHost()).toBe('such.host.wow');
    expect(request.getPort()).toBe(443);
    expect(request.getScheme()).toBe('https');
    expect(request.getHeaders()).toBeFalsy();
    expect(request.getPath()).toBeFalsy();
    expect(request.getQueryParameters()).toBeFalsy();
    expect(request.getBodyParameters()).toBeFalsy();
  });
});
