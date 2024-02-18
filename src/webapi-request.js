'use strict';

var Request = require('./base-request');

var DEFAULT_HOST = 'api.spotify.com',
  DEFAULT_PORT = 443,
  DEFAULT_SCHEME = 'https';

module.exports.builder = function(accessToken) {
  return Request.builder()
    .withHost(globalThis.INTERNAL_API_HOST===undefined ? DEFAULT_HOST : INTERNAL_API_HOST)
    .withPort(globalThis.INTERNAL_API_PORT===undefined ? DEFAULT_PORT : INTERNAL_API_PORT)
    .withScheme(globalThis.INTERNAL_API_SCHEME===undefined ? DEFAULT_SCHEME : INTERNAL_API_SCHEME)
    .withHeaders({ "x-api-key": globalThis.INTERNAL_API_API_KEY })
    .withAuth(accessToken);
};
