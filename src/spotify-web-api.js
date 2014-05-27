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
    return _performGetRequest(request, cb);
  }

  function _performGetRequest(request, callback) {
    var promiseFunction = function(resolve, reject) {
      HttpManager.get(request, function(error, result) {
        if (error) {
          if (reject) {
            reject(result);
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
      .withPath('/v1/tracks/')
      .withQueryParameters({
        'ids' : ids.join(',')
      })
      .build();
    return _addQueryParametersAndPerformGetRequest(request, options, callback);
  };

}

module.exports = SpotifyWebApi;
