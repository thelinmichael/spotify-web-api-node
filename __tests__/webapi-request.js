var WebApiRequest = require('../src/webapi-request');

describe('Create Web Api Requests', () => {
  test('Should use default settings if none are supplied', () => {
    var request = WebApiRequest.builder('token').build();

    expect(request.getHost()).toBe('api.spotify.com');
    expect(request.getPort()).toBe(443);
    expect(request.getScheme()).toBe('https');
    expect(request.getHeaders().Authorization).toBeTruthy();
    expect(request.getPath()).toBeFalsy();
    expect(request.getQueryParameters()).toBeFalsy();
    expect(request.getBodyParameters()).toBeFalsy();
  });

  test('Can overwrite one of the default parameters', () => {
    var request = WebApiRequest.builder('token')
      .withHost('such.host.wow')
      .build();

    expect(request.getHost()).toBe('such.host.wow');
    expect(request.getPort()).toBe(443);
    expect(request.getScheme()).toBe('https');
    expect(request.getHeaders().Authorization).toBeTruthy();
    expect(request.getPath()).toBeFalsy();
    expect(request.getQueryParameters()).toBeFalsy();
    expect(request.getBodyParameters()).toBeFalsy();
  });
});
