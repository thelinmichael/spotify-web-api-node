var AuthenticationRequest = require('./authentication-request'),
    WebApiRequest = require('./webapi-request'),
    HttpManager = require('./http-manager'),
    PromiseImpl = require('promise');

function SpotifyWebApi(credentials) {
  'use strict';

  var _credentials = credentials || {};

  function _addQueryParametersAndPerformGetRequest(request, options) {
    request.addQueryParameters(options);
    return _performRequest(HttpManager.get, request);
  }

  function _addBodyParameters(request, options) {
    if (options) {
      for (var key in options) {
        if (key !== 'credentials') {
          request.addBodyParameter(key, options[key]);
        }
      }
    }
  }

  function _addQueryParameters(request, options) {
    if (!options) {
      return;
    }
    for (var key in options) {
      if (key !== 'credentials') {
        request.addQueryParameter(key, options[key]);
      }
    }
  }

  function _performPostRequest(request, options) {
    return _performRequest(HttpManager.post, request);
  }

  function _performGetRequest(request, options) {
    return _performRequest(HttpManager.get, request);
  }

  function _performRequest(method, request) {
    var promiseFunction = function(resolve, reject) {
      method(request, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    };
    return new PromiseImpl(promiseFunction);
  }

  function _addAccessToken(request, options) {
    var accessToken = _determineCredentials('accessToken', options);
    if (accessToken) {
      request.addHeaders({
        'Authorization' : 'Bearer ' + accessToken
      });
    }
  }

  function _addBasicAuthorization(request, options) {
    var clientId = _determineCredentials('clientId', options);
    var clientSecret = _determineCredentials('clientSecret', options);
    request.addHeaders({
      'Authorization' : 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
    });
  }

  function _determineCredentials(credential, options) {
    if (options && options.credentials && options.credentials[credential]) {
      return options.credentials[credential];
    } else {
      return _credentials[credential];
    }
  }

  this.setCredentials = function(credentials) {
    for (var key in credentials) {
      _credentials[key] = credentials[key];
    }
  };

  this.getCredentials = function() {
    return _credentials;
  };

  this.resetCredentials = function() {
    _credentials = null;
  };

  this.setClientId = function(clientId) {
    _setCredential('clientId', clientId);
  };

  this.setClientSecret = function(clientSecret) {
    _setCredential('clientSecret', clientSecret);
  };

  this.setCode = function(code) {
    _setCredential('code', code);
  };

  this.setAccessToken = function(accessToken) {
    _setCredential('accessToken', accessToken);
  };

  this.setRefreshToken = function(refreshToken) {
    _setCredential('refreshToken', refreshToken);
  };

  this.setRedirectURI = function(redirectUri) {
    _setCredential('redirectUri', redirectUri);
  };

  this.getRedirectURI = function() {
    return _getCredential('redirectUri');
  };

  this.getClientId = function() {
    return _getCredential('clientId');
  };

  this.getClientSecret = function() {
    return _getCredential('clientSecret');
  };

  this.getCode = function() {
    return _getCredential('code');
  };

  this.getAccessToken = function() {
    return _getCredential('accessToken');
  };

  this.getRefreshToken = function() {
    return _getCredential('refreshToken');
  };

  this.resetClientId = function() {
    _resetCredential('clientId');
  };

  this.resetClientSecret = function() {
    _resetCredential('clientSecret');
  };

  this.resetCode = function() {
    _resetCredential('code');
  };

  this.resetAccessToken = function() {
    _resetCredential('accessToken');
  };

  this.resetRefreshToken = function() {
    _resetCredential('refreshToken');
  };

  this.resetRedirectURI = function() {
    _resetCredential('redirectUri');
  };

  function _setCredential(credentialKey, value) {
    _credentials = _credentials || {};
    _credentials[credentialKey] = value;
  }

  function _getCredential(credentialKey) {
    if (!_credentials) {
      return;
    } else {
      return _credentials[credentialKey];
    }
  }

  function _resetCredential(credentialKey) {
    if (!_credentials) {
      return;
    } else {
      _credentials[credentialKey] = null;
    }
  }

  this.getTrack = function(id, options) {
    var request = WebApiRequest.builder().withPath('/v1/tracks/' + id).build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getTracks = function(ids, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/tracks')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getAlbum = function(id, options) {
    var request = WebApiRequest.builder().withPath('/v1/albums/' + id).build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getAlbums = function(ids, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();

    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getArtist = function(id, options) {
    var request = WebApiRequest.builder().withPath('/v1/artists/' + id).build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getArtists = function(ids, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();

    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.searchAlbums = function(query, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'album',
        q : query
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.searchArtists = function(query, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'artist',
        q : query
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.searchTracks = function(query, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'track',
        q : query
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.getArtistAlbums = function(id, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + id + '/albums')
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.getAlbumTracks = function(id, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums/' + id + '/tracks')
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.getArtistTopTracks = function(id, country, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + id + '/top-tracks')
      .withQueryParameters({
        'country' : country
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.getUser = function(id, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + id)
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options);
  };

  this.getMe = function(options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me')
      .build();

    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getUserPlaylists = function(userId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists')
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.getUserPlaylist = function(userId, playlistId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId)
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options);
  };

  this.createPlaylist = function(userId, name, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters({ 'name' : name })
      .build();
    _addAccessToken(request, options);
    _addBodyParameters(request, options);
    return _performPostRequest(request, options);
  };

  /**
   * TODO: Add position.
   */
  this.addTracksToPlaylist = function(userId, playlistId, tracks, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(tracks)
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(options);
    return _performPostRequest(request, options);
  };

  this.clientCredentialsGrant = function(options) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'client_credentials'
      })
      .build();
      _addBasicAuthorization(request, options);
      _addBodyParameters(request, options);
      return _performPostRequest(request);
  };

  this.authorizationCodeGrant = function(options) {
     var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'authorization_code',
        'redirect_uri' : _determineCredentials('redirectUri', options),
        'code' : _determineCredentials('code', options),
      })
      .build();
      _addBasicAuthorization(request, options);
      return _performPostRequest(request);
  };

  this.refreshAccessToken = function(clientId, clientSecret, refreshToken, options) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'refresh_token',
        'refresh_token' : refreshToken
      })
      .build();

      _addBasicAuthorization(request, options);
      _addBodyParameters(request, options);
      return _performPostRequest(request, options);
  };

  this.createAuthorizeURL = function(scopes, state, options) {
    var request = AuthenticationRequest.builder()
      .withPath('/authorize')
      .withQueryParameters({
        'client_id' : _determineCredentials('clientId', options),
        'response_type' : 'code',
        'redirect_uri' : _determineCredentials('redirectUri', options),
        'scope' : scopes.join('%20'),
        'state' : state
      })
      .build();

      _addQueryParameters(request, options);
      return request.getURL();
  };

}

module.exports = SpotifyWebApi;