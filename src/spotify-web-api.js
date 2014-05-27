var AuthenticationRequest = require('./authentication-request'),
    WebApiRequest = require('./webapi-request'),
    HttpManager = require('./http-manager'),
    DefaultPromise = require('promise');

function SpotifyWebApi() {
  'use strict';

  var _promiseImplementation = null;

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

  function _addBodyParametersAndPerformPostRequest(request, options, callback) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }
    request.addBodyParameters(opt);
    return _performRequest(HttpManager.post, request, cb);
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

  this.setPromiseImplementation = function(promiseImplementation) {
    if (!('defer' in promiseImplementation)) {
      throw new Error('Unsupported implementation of Promises/A+');
    } else {
      _promiseImplementation = promiseImplementation;
    }
  };

  this.getTrack = function(id, options, callback) {
    var request = WebApiRequest.builder().withPath('/v1/tracks/' + id).build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getTracks = function(ids, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/tracks')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getAlbum = function(id, options, callback) {
    var request = WebApiRequest.builder().withPath('/v1/albums/' + id).build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getAlbums = function(ids, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getArtist = function(id, options, callback) {
    var request = WebApiRequest.builder().withPath('/v1/artists/' + id).build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getArtists = function(ids, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.searchAlbums = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'album',
        q : query
      })
      .build();
      return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.searchArtists = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'artist',
        q : query
      })
      .build();
      return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.searchTracks = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'track',
        q : query
      })
      .build();
      return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getArtistAlbums = function(id, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + id + '/albums')
      .build();
      return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.getAlbumTracks = function(id, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums/' + id + '/tracks')
      .build();
      return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

  this.authClientCredentials = function(clientId, clientSecret, options, callback) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'client_credentials'
      })
      .withHeaders({
        'Authorization' : 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
      })
      .build();

      return _addBodyParametersAndPerformPostRequest(request, options, callback);
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

      return _addBodyParametersAndPerformPostRequest(request, options, callback);
  };

}

module.exports = SpotifyWebApi;
