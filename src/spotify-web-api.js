var AuthenticationRequest = require('./authentication-request'),
    WebApiRequest = require('./webapi-request'),
    HttpManager = require('./http-manager'),
    PromiseImpl = require('promise');

function SpotifyWebApi() {
  'use strict';

  var _accessToken = null;

  function _addQueryParametersAndPerformGetRequest(request, options) {
    request.addQueryParameters(options);
    return _performRequest(HttpManager.get, request);
  }

  function _addBodyParameters(request, options) {
    if (options) {
      request.addBodyParameters(options);
    }
  }

  function _addQueryParameters(request, options) {
    if (options) {
      request.addQueryParameters(options);
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
    var accessToken = _determineToken(options);
    if (accessToken) {
      request.addHeaders({
        'Authorization' : 'Bearer ' + accessToken
      });
    }
  }

  function _determineToken(options) {
    if (options && options.credentials && options.credentials.accessToken) {
      return options.credentials.accessToken;
    } else {
      return _accessToken;
    }
  }

  this.resetAccessToken = function() {
    _accessToken = null;
  };

  this.setAccessToken = function(accessToken) {
    _accessToken = accessToken;
  };

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
   * TODO: No support for position just now.
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

  this.clientCredentialsGrant = function(clientId, clientSecret, options) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'client_credentials'
      })
      .withHeaders({
        'Authorization' : 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
      })
      .build();
      _addBodyParameters(request, options);
      return _performPostRequest(request);
  };

  this.authorizationCodeGrant = function(clientId, clientSecret, code, redirectUri, options) {
     var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'authorization_code',
        'redirect_uri' : redirectUri,
        'code' : code
      })
      .withHeaders({
        'Authorization' : 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
      })
      .build();
      _addBodyParameters(request, options);
      return _performPostRequest(request);
  };

  this.refreshAccessToken = function(clientId, clientSecret, refreshToken, options) {
    var request =AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'refresh_token',
        'refresh_token' : refreshToken
      })
      .withHeaders({
        'Authorization' : 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
      })
      .build();

      _addBodyParameters(request, options);
      return _performPostRequest(request, options);
  };

}

module.exports = SpotifyWebApi;
