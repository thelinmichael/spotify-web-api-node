'use strict';

var Request = require('./base-request');

var DEFAULT_HOST = process.env.SPOTIFY_API_HOST || 'api.spotify.com',
    DEFAULT_PORT = 443,
    DEFAULT_SCHEME = 'https';

module.exports.builder = function() {
  return Request.builder()
      .withHost(DEFAULT_HOST)
      .withPort(DEFAULT_PORT)
      .withScheme(DEFAULT_SCHEME);
};
