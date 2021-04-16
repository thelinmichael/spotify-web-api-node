'use strict';

var AuthenticationRequest = require('./authentication-request');
var HttpManager = require('./http-manager');

module.exports = {

  /**
   * Retrieve a URL where the user can give the application permissions.
   * @param {string[]} scopes The scopes corresponding to the permissions the application needs.
   * @param {string} state A parameter that you can use to maintain a value between the request and the callback to redirect_uri.It is useful to prevent CSRF exploits.
   * @param {boolean} showDialog A parameter that you can use to force the user to approve the app on each login rather than being automatically redirected.
   * @param {string} responseType An optional parameter that you can use to specify the code response based on the authentication type - can be set to 'code' or 'token'. Default 'code' to ensure backwards compatability.
   * @returns {string} The URL where the user can give application permissions.
   */
  createAuthorizeURL: function(scopes, state, showDialog, responseType = 'code') {
    let parameters = {
      client_id: this.getClientId(),
      response_type: responseType,
      redirect_uri: this.getRedirectURI(),
      scope: scopes.join('%20'),
      state: state,
      show_dialog: showDialog && !!showDialog
    };
    if (!this.getClientSecret()) {
      // No client secret, use PKCE
      if (!this.getClientVerifier()) {
        // Generate verifier if we don't have one set
        this.generateClientVerifier();
      }
      parameters.code_challenge = this.getClientChallenge();
      parameters.code_challenge_method = 'S256';
    }
    return AuthenticationRequest.builder()
      .withPath('/authorize')
      .withQueryParameters(parameters)
      .build()
      .getURL();
  },

  /**
   * Request an access token using the Client Credentials flow.
   * Requires that client ID and client secret has been set previous to the call.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
   *          token type and time to expiration. If rejected, it contains an error object. Not returned if a callback is given.
   */
  clientCredentialsGrant: function(callback) {
    return AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        grant_type: 'client_credentials'
      })
      .withHeaders({
        Authorization:
          'Basic ' +
          new Buffer(
            this.getClientId() + ':' + this.getClientSecret()
          ).toString('base64'),
        'Content-Type' : 'application/x-www-form-urlencoded'        
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
    let parameters = {
      grant_type: 'authorization_code',
      redirect_uri: this.getRedirectURI(),
      code: code,
      client_id: this.getClientId(),
    };
    if (this.getClientSecret()) {
      parameters.client_secret = this.getClientSecret();
    } else {
      // No secret, assume PKCE
      parameters.code_verifier = this.getClientVerifier();
    }
    return AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters(parameters)
      .withHeaders({ 'Content-Type' : 'application/x-www-form-urlencoded' })
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
        refresh_token: this.getRefreshToken(),
        client_id: this.getClientId()
      })
      .withHeaders({
        Authorization:
          'Basic ' +
          new Buffer(
            this.getClientId() + ':' + this.getClientSecret()
          ).toString('base64'),
          'Content-Type' : 'application/x-www-form-urlencoded'
      })
      .build()
      .execute(HttpManager.post, callback);
  }
};
