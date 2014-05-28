var AuthenticationRequest = require('./authentication-request'),
    WebApiRequest = require('./webapi-request'),
    HttpManager = require('./http-manager'),
    DefaultPromise = require('promise');

function SpotifyWebApi() {
  'use strict';

  var _promiseImplementation = null,
      _accessToken = null;

  var _promiseProvider = function(promiseFunction) {
    if (_promiseImplementation !== null) {
      var deferred = _promiseImplementation.defer();
      promiseFunction(function(resolvedResult) {
        deferred.resolve(resolvedResult);
      }, function(rejectedResult) {
        deferred.reject(rejectedResult);
      });
      return deferred.promise;
    } else {
      return new DefaultPromise(promiseFunction);
    }
    return null;
  };

  function _addQueryParametersAndPerformGetRequest(request, options, callback) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }
    request.addQueryParameters(opt);
    return _performRequest(HttpManager.get, request, cb);
  }

  function _addBodyParameters(request, options) {
    if (typeof options === 'object') {
      request.addBodyParameters(options);
    }
  }

  function _addQueryParameters(request, options) {
    if (typeof options === 'object') {
      request.addQueryParameters(options);
    }
  }

  function _performPostRequest(request, options, callback) {
    return _performRequest(HttpManager.post, request, _determineCallback(options, callback));
  }

  function _performGetRequest(request, options, callback) {
    return _performRequest(HttpManager.get, request,  _determineCallback(options, callback));
  }

  function _determineCallback(options, callback) {
    var cb;
    if (typeof options === 'object') {
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }
    return cb;
  }

  function _performRequest(method, request, callback) {
    var promiseFunction = function(resolve, reject) {
      method(request, function(error, result) {
        if (error) {
          if (reject) {
            reject(error);
          } else {
            callback(error, result);
          }
        } else {
          if (resolve) {
            resolve(result);
          } else {
            callback(error, result);
          }
        }
      });
    };
    if (callback) {
      promiseFunction();
    } else {
      return _promiseProvider(promiseFunction);
    }
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
    if (options && options.accessToken) {
      return options.accessToken;
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

  this.setPromiseImplementation = function(promiseImplementation) {
    if (!('defer' in promiseImplementation)) {
      throw new Error('Unsupported implementation of Promises/A+');
    } else {
      _promiseImplementation = promiseImplementation;
    }
  };

  this.getTrack = function(id, options, callback) {
    var request = WebApiRequest.builder().withPath('/v1/tracks/' + id).build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getTracks = function(ids, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/tracks')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getAlbum = function(id, options, callback) {
    var request = WebApiRequest.builder().withPath('/v1/albums/' + id).build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getAlbums = function(ids, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();

    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getArtist = function(id, options, callback) {
    var request = WebApiRequest.builder().withPath('/v1/artists/' + id).build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getArtists = function(ids, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();

    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.searchAlbums = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'album',
        q : query
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.searchArtists = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'artist',
        q : query
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.searchTracks = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'track',
        q : query
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.getArtistAlbums = function(id, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + id + '/albums')
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.getAlbumTracks = function(id, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums/' + id + '/tracks')
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.getArtistTopTracks = function(id, country, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + id + '/top-tracks')
      .withQueryParameters({
        'country' : country
      })
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.getUser = function(id, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + id)
      .build();

      _addAccessToken(request, options);
      _addQueryParameters(request, options);
      return _performGetRequest(request, options, callback);
  };

  this.getMe = function(options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me')
      .build();

    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getUserPlaylists = function(userId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists')
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.getUserPlaylist = function(userId, playlistId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId)
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(request, options);
    return _performGetRequest(request, options, callback);
  };

  this.createPlaylist = function(userId, name, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters({ 'name' : name })
      .build();
    _addAccessToken(request, options);
    _addBodyParameters(request, options);
    return _performPostRequest(request, options, callback);
  };

  /**
   * TODO: No support for position just now.
   */
  this.addTracksToPlaylist = function(userId, playlistId, tracks, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(tracks)
      .build();
    _addAccessToken(request, options);
    _addQueryParameters(options);
    return _performPostRequest(request, options, callback);
  };

  this.clientCredentialsGrant = function(clientId, clientSecret, options, callback) {
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
      return _performPostRequest(request, callback);
  };

  this.authorizationCodeGrant = function(clientId, clientSecret, code, redirectUri, options, callback) {
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
      return _performPostRequest(request, callback);
  };

  this.refreshAccessToken = function(clientId, clientSecret, refreshToken, options, callback) {
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
      return _performPostRequest(request, options, callback);
  };

}

module.exports = SpotifyWebApi;
