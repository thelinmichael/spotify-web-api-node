'use strict';

var Request = require('./base-request');

var DEFAULT_HOST = 'api.spotify.com',
  DEFAULT_PORT = 443,
  DEFAULT_SCHEME = 'https';

module.exports.builder = function(accessToken) {
  return Request.builder()
    .withHost(globalThis.WEBAPI_HOST===undefined ? DEFAULT_HOST : WEBAPI_HOST)
    .withPort(globalThis.WEBAPI_PORT===undefined ? DEFAULT_PORT : WEBAPI_PORT)
    .withScheme(globalThis.WEBAPI_SCHEME===undefined ? DEFAULT_SCHEME : WEBAPI_SCHEME)
    .withAuth(accessToken);
};
