'use strict';

var AuthenticationRequest = require('./authentication-request');
var HttpManager = require('./http-manager');

module.exports = {
  /**
   * Request an access token using the Client Credentials flow.
   * Requires that client ID and client secret has been set previous to the call.
   * @param {Object} options Options.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
   *          token type and time to expiration. If rejected, it contains an error object. Not returned if a callback is given.
   */
  clientCredentialsGrant: function(options, callback) {
    return AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        grant_type: 'client_credentials'
      })
      .withBodyParameters(options)
      .withHeaders({
        Authorization:
          'Basic ' +
          new Buffer(
            this.getClientId() + ':' + this.getClientSecret()
          ).toString('base64')
      })
      .build()
      .execute(HttpManager.post, callback);
  },

  /**
   * Request an access token using the Authorization Code flow.
   * Requires that client ID, client secret, and redirect URI has been set previous to the call.
   * @param {string} code The authorization code returned in the callback in the Authorization Code flow.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
   *          refresh token, token type and time to expiration. If rejected, it contains an error object.
   *          Not returned if a callback is given.
   */
  authorizationCodeGrant: function(code, callback) {
    return AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        grant_type: 'authorization_code',
        redirect_uri: this.getRedirectURI(),
        code: code,
        client_id: this.getClientId(),
        client_secret: this.getClientSecret()
      })
      .build()
      .execute(HttpManager.post, callback);
  },

  /**
   * Refresh the access token given that it hasn't expired.
   * Requires that client ID, client secret and refresh token has been set previous to the call.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing the
   *          access token, time to expiration and token type. If rejected, it contains an error object.
   *          Not returned if a callback is given.
   */
  refreshAccessToken: function(callback) {
    return AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        grant_type: 'refresh_token',
        refresh_token: this.getRefreshToken()
      })
      .withHeaders({
        Authorization:
          'Basic ' +
          new Buffer(
            this.getClientId() + ':' + this.getClientSecret()
          ).toString('base64')
      })
      .build()
      .execute(HttpManager.post, callback);
  }
};
