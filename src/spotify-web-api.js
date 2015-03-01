'use strict';

var AuthenticationRequest = require('./authentication-request'),
    WebApiRequest = require('./webapi-request'),
    HttpManager = require('./http-manager'),
    PromiseImpl = require('promise');

function SpotifyWebApi(credentials) {

  var _credentials = credentials || {};

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

  function _addAccessToken(request, accessToken) {
    if (accessToken) {
      request.addHeaders({
        'Authorization' : 'Bearer ' + accessToken
      });
    }
  }

  this.setCredentials = function(credentials) {
    for (var key in credentials) {
      if (credentials.hasOwnProperty(key)) {
        _credentials[key] = credentials[key];
      }
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

  /**
   * Look up a track.
   * @param {string} trackId The track's ID.
   * @param {Object} [options] The possible options, currently only market.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getTrack('3Qm86XLflmIXVm1wcwkgDK').then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the track. Not returned if a callback is given.
   */
  this.getTrack = function(trackId, options, callback) {
     // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = {};
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withPath('/v1/tracks/' + trackId)
      .withQueryParameters(actualOptions)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Look up several tracks.
   * @param {string[]} trackIds The IDs of the artists.
   * @param {Object} [options] The possible options, currently only market.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the artists. Not returned if a callback is given.
   */
  this.getTracks = function(trackIds, options, callback) {
    // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = {};
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withPath('/v1/tracks')
      .withQueryParameters({
        'ids' : trackIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, actualOptions);

    var promise = _performRequest(HttpManager.get, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Look up an album.
   * @param {string} albumId The album's ID.
   * @param {Object} [options] The possible options, currently only market.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the album. Not returned if a callback is given.
   */
  this.getAlbum = function(albumId, options, callback) {
    // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = {};
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withPath('/v1/albums/' + albumId)
      .withQueryParameters(actualOptions)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Look up several albums.
   * @param {string[]} artistIds The IDs of the artists.
   * @param {Object} [options] The possible options, currently only market.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the artists. Not returned if a callback is given.
   */
  this.getAlbums = function(albumIds, options, callback) {
    // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = {};
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withPath('/v1/albums')
      .withQueryParameters({
        'ids' : albumIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, actualOptions);

    var promise = _performRequest(HttpManager.get, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Look up an artist.
   * @param {string} artistId The artist's ID.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example api.getArtist('1u7kkVrr14iBvrpYnZILJR').then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the artist. Not returned if a callback is given.
   */
  this.getArtist = function(artistId, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Look up several artists.
   * @param {string[]} artistIds The IDs of the artists.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing information
   *          about the artists. Not returned if a callback is given.
   */
  this.getArtists = function(artistIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists')
      .withQueryParameters({
        'ids' : artistIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Search for an album.
   * @param {string} query The search query.
   * @param {Object} [options] The possible options, e.g. limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example searchArtists('David Bowie', { limit : 5, offset : 1 }).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.searchAlbums = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'album',
        q : query
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Search for an artist.
   * @param {string} query The search query.
   * @param {Object} [options] The possible options, e.g. limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example searchArtists('David Bowie', { limit : 5, offset : 1 }).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.searchArtists = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'artist',
        q : query
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise =  _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Search for a track.
   * @param {string} query The search query.
   * @param {Object} [options] The possible options, e.g. limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example searchTracks('Mr. Brightside', { limit : 3, offset : 2 }).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.searchTracks = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'track',
        q : query
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Search for playlists.
   * @param {string} query The search query.
   * @param {Object} options The possible options.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example searchPlaylists('workout', { limit : 1, offset : 0 }).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.searchPlaylists = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'playlist',
        q : query
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get an artist's albums.
   * @param {string} artistId The artist's ID.
   * @options {Object} [options] The possible options, e.g. limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 }).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the albums
   *          for the given artist. The result is paginated. If the promise is rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.getArtistAlbums = function(artistId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId + '/albums')
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get the tracks of an album.
   * @param albumId the album's ID.
   * @options {Object} [options] The possible options, e.g. limit.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 }).then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *                    tracks in the album. The result is paginated. If the promise is rejected.
   *                    it contains an error object. Not returned if a callback is given.
   */
  this.getAlbumTracks = function(albumId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums/' + albumId + '/tracks')
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get an artist's top tracks.
   * @param {string} artistId The artist's ID.
   * @param {string} country The country/territory where the tracks are most popular. (format: ISO 3166-1 alpha-2)
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB').then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *          artist's top tracks in the given country. If the promise is rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.getArtistTopTracks = function(artistId, country, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId + '/top-tracks')
      .withQueryParameters({
        'country' : country
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get related artists.
   * @param {string} artistId The artist's ID.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getArtistRelatedArtists('0oSGxfWSnnOXhD2fKuz2Gy').then(...)
   * @returns {Promise|undefined} A promise that if successful, returns an object containing the
   *          related artists. If the promise is rejected, it contains an error object. Not returned if a callback is given.
   */
  this.getArtistRelatedArtists = function(artistId, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId + '/related-artists')
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get information about a user.
   * @param userId The user ID.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getUser('thelinmichael').then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves to an object
   *          containing information about the user. If the promise is
   *          rejected, it contains an error object. Not returned if a callback is given.
   */
  this.getUser = function(userId, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get information about the user that has signed in (the current user).
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getMe().then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves to an object
   *          containing information about the user. The amount of information
   *          depends on the permissions given by the user. If the promise is
   *          rejected, it contains an error object. Not returned if a callback is given.
   */
  this.getMe = function(callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me')
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get a user's playlists.
   * @param {string} userId The user ID.
   * @param {Object} [options] The options supplied to this request.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getUserPlaylists('thelinmichael').then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing
   *          the a list of playlists. If rejected, it contains an error object. Not returned if a callback is given.
   */
  this.getUserPlaylists = function(userId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists')
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get a playlist.
   * @param {string} userId The playlist's owner's user ID.
   * @param {string} playlistId The playlist's ID.
   * @param {Object} [options] The options supplied to this request.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getPlaylist('thelinmichael', '3EsfV6XzCHU8SPNdbnFogK').then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing
   *          the playlist. If rejected, it contains an error object. Not returned if a callback is given.
   */
  this.getPlaylist = function(userId, playlistId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId)
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Get tracks in a playlist.
   * @param {string} userId THe playlist's owner's user ID.
   * @param {string} playlistId The playlist's ID.
   * @param {Object} [options] Optional options, such as fields.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getPlaylistTracks('thelinmichael', '3ktAYNcRHpazJ9qecm3ptn').then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves to an object that containing
   * the tracks in the playlist. If rejected, it contains an error object. Not returned if a callback is given.
   */
  this.getPlaylistTracks = function(userId, playlistId, options, callback) {
    var request = WebApiRequest.builder().
      withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks').
      withQueryParameters(options).
      build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Create a playlist.
   * @param {string} userId The playlist's owner's user ID.
   * @param {string} playlistName The name of the playlist.
   * @param {Object} [options] The possible options, currently only public.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example createPlaylist('thelinmichael', 'My cool playlist!', { public : false }).then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing information about the
   *          created playlist. If rejected, it contains an error object. Not returned if a callback is given.
   */
  this.createPlaylist = function(userId, playlistName, options, callback) {
    // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = { 'name' : playlistName };
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(actualOptions)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.post, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Follow a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {Object} [options] The possible options, currently only public.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.followPlaylist = function(userId, playlistId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/followers')
      .withBodyParameters(options)
      .withHeaders({ 'Content-Type' : 'application/json' })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Unfollow a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {Object} [options] The possible options, currently only public.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.unfollowPlaylist = function(userId, playlistId, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/followers')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.del, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Change playlist details.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {Object} [options] The possible options, e.g. name, public.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example changePlaylistDetails('thelinmichael', '3EsfV6XzCHU8SPNdbnFogK', {name: 'New name', public: true}).then(...)
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.changePlaylistDetails = function(userId, playlistId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId)
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Add tracks to a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {string[]} tracks IDs of the tracks to add to the playlist.
   * @param {Object} [options] Options, position being the only one.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example addTracksToPlaylist('thelinmichael', '3EsfV6XzCHU8SPNdbnFogK',
              '["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]').then(...)
   * @returns {Promise|undefined} A promise that if successful returns an object containing a snapshot_id. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.addTracksToPlaylist = function(userId, playlistId, tracks, options, callback) {
    var tracksString;
    if (typeof tracks === 'object') {
      tracksString = tracks.join();
    } else {
      tracksString = tracks;
    }
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withQueryParameters({
        uris: tracksString
      })
      .build();

    _addQueryParameters(request, options);
    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.post, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Remove tracks from a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {Object[]} tracks An array of objects containing a property called uri with the track URI (String), and
   * a an optional property called positions (int[]), e.g. { uri : "spotify:track:491rM2JN8KvmV6p0oDDuJT", positions : [0, 15] }
   * @param {Object} options Options, snapshot_id being the only one.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns an object containing a snapshot_id. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.removeTracksFromPlaylist = function(userId, playlistId, tracks, options, callback) {
    var request = WebApiRequest.builder().
      withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks').
      withHeaders({ 'Content-Type' : 'application/json' }).
      withBodyParameters({
        'tracks': tracks
      }).
      build();

    _addBodyParameters(request, options);
    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.del, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Remove tracks from a playlist by position instead of specifying the tracks' URIs.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {int[]} positions The positions of the tracks in the playlist that should be removed
   * @param {string} snapshot_id The snapshot ID, or version, of the playlist. Required
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns an object containing a snapshot_id. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.removeTracksFromPlaylistByPosition = function(userId, playlistId, positions, snapshotId, callback) {
    var request = WebApiRequest.builder().
      withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks').
      withHeaders({ 'Content-Type' : 'application/json' }).
      withBodyParameters({
        'positions': positions,
        'snapshot_id' : snapshotId
      }).
      build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.del, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Replace tracks in a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {Object[]} uris An array of track URIs (strings)
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns an empty object. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.replaceTracksInPlaylist = function(userId, playlistId, uris, callback) {
    var request = WebApiRequest.builder().
      withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks').
      withHeaders({ 'Content-Type' : 'application/json' }).
      withBodyParameters({
        'uris': uris
      }).
      build();

    _addAccessToken(request, this.getAccessToken());

    var promise =  _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Reorder tracks in a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {int} rangeStart The position of the first track to be reordered.
   * @param {int} insertBefore The position where the tracks should be inserted.
   * @param {Object} options Optional parameters, i.e. range_length and snapshot_id.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns an object containing a snapshot_id. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.reorderTracksInPlaylist = function(userId, playlistId, rangeStart, insertBefore, options, callback) {
    var request = WebApiRequest.builder().
      withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks').
      withHeaders({ 'Content-Type' : 'application/json' }).
      withBodyParameters({
        'range_start': rangeStart,
        'insert_before' : insertBefore
      }).
      build();

    _addAccessToken(request, this.getAccessToken());
    _addBodyParameters(request, options);

    var promise =  _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Request an access token using the Client Credentials flow.
   * Requires that client ID and client secret has been set previous to the call.
   * @param {Object} options Options.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
   *          token type and time to expiration. If rejected, it contains an error object. Not returned if a callback is given.
   */
  this.clientCredentialsGrant = function(options, callback) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'client_credentials'
      })
      .withHeaders({
        Authorization : ('Basic ' + new Buffer(this.getClientId() + ':' + this.getClientSecret()).toString('base64'))
      })
      .build();

    _addBodyParameters(request, options);

    var promise =  _performRequest(HttpManager.post, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Request an access token using the Authorization Code flow.
   * Requires that client ID, client secret, and redirect URI has been set previous to the call.
   * @param {string} code The authorization code returned in the callback in the Authorization Code flow.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
   *          refresh token, token type and time to expiration. If rejected, it contains an error object.
   *          Not returned if a callback is given.
   */
  this.authorizationCodeGrant = function(code, callback) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'authorization_code',
        'redirect_uri' : this.getRedirectURI(),
        'code' : code,
        'client_id' : this.getClientId(),
        'client_secret' : this.getClientSecret()
      })
      .build();

    var promise = _performRequest(HttpManager.post, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Refresh the access token given that it hasn't expired.
   * Requires that client ID, client secret and refresh token has been set previous to the call.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing the
   *          access token, time to expiration and token type. If rejected, it contains an error object.
   *          Not returned if a callback is given.
   */
  this.refreshAccessToken = function(callback) {
    var request = AuthenticationRequest.builder()
      .withPath('/api/token')
      .withBodyParameters({
        'grant_type' : 'refresh_token',
        'refresh_token' : this.getRefreshToken()
      })
      .withHeaders({
        Authorization : ('Basic ' + new Buffer(this.getClientId() + ':' + this.getClientSecret()).toString('base64'))
      })
      .build();

    var promise = _performRequest(HttpManager.post, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Retrieve a URL where the user can give the application permissions.
   * @param {string[]} scopes The scopes corresponding to the permissions the application needs.
   * @param {string} state A parameter that you can use to maintain a value between the request and the callback to redirect_uri.It is useful to prevent CSRF exploits.
   * @returns {string} The URL where the user can give application permissions.
   */
  this.createAuthorizeURL = function(scopes, state) {
    var request = AuthenticationRequest.builder()
      .withPath('/authorize')
      .withQueryParameters({
        'client_id' : this.getClientId(),
        'response_type' : 'code',
        'redirect_uri' : this.getRedirectURI(),
        'scope' : scopes.join('%20'),
        'state' : state
      })
      .build();

    return request.getURL();
  };

  /**
   * Retrieve the tracks that are saved to the authenticated users Your Music library.
   * @param {Object} [options] Options, being market, limit, and/or offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which in turn contains
   *          playlist track objects. Not returned if a callback is given.
   */
  this.getMySavedTracks = function(options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/tracks')
      .withQueryParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Check if one or more tracks is already saved in the current Spotify user’s “Your Music” library.
   * @param {string[]} trackIds The track IDs
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an array of booleans. The order
   * of the returned array's elements correspond to the track ID in the request.
   * The boolean value of true indicates that the track is part of the user's library, otherwise false.
   * Not returned if a callback is given.
   */
  this.containsMySavedTracks = function(trackIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/tracks/contains')
      .withQueryParameters({
        'ids' : trackIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Remove a track from the authenticated user's Your Music library.
   * @param {string[]} trackIds The track IDs
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns null, otherwise an error.
   * Not returned if a callback is given.
   */
  this.removeFromMySavedTracks = function(trackIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(trackIds)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.del, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

   /**
   * Remove a track from the authenticated user's Your Music library.
   * @param {string[]} trackIds The track IDs
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns null, otherwise an error. Not returned if a callback is given.
   */
  this.addToMySavedTracks = function(trackIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(trackIds)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Add the current user as a follower of one or more other Spotify users.
   * @param {string[]} userIds The IDs of the users to be followed.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example followUsers(['thelinmichael', 'wizzler']).then(...)
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.followUsers = function(userIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/following')
      .withQueryParameters({
        ids: userIds.join(','),
        type: 'user'
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Add the current user as a follower of one or more artists.
   * @param {string[]} artistIds The IDs of the artists to be followed.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example followArtists(['0LcJLqbBmaGUft1e9Mm8HV', '3gqv1kgivAc92KnUm4elKv']).then(...)
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.followArtists = function(artistIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/following')
      .withQueryParameters({
        ids: artistIds.join(','),
        type: 'artist'
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.put, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Remove the current user as a follower of one or more other Spotify users.
   * @param {string[]} userIds The IDs of the users to be unfollowed.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example unfollowUsers(['thelinmichael', 'wizzler']).then(...)
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.unfollowUsers = function(userIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/following')
      .withQueryParameters({
        ids: userIds.join(','),
        type: 'user'
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.del, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Remove the current user as a follower of one or more artists.
   * @param {string[]} artistIds The IDs of the artists to be unfollowed.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example unfollowArtists(['0LcJLqbBmaGUft1e9Mm8HV', '3gqv1kgivAc92KnUm4elKv']).then(...)
   * @returns {Promise|undefined} A promise that if successful, simply resolves to an empty object. If rejected,
   *          it contains an error object. Not returned if a callback is given.
   */
  this.unfollowArtists = function(artistIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/following')
      .withQueryParameters({
        ids: artistIds.join(','),
        type: 'artist'
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.del, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Check to see if the current user is following one or more other Spotify users.
   * @param {string[]} userIds The IDs of the users to check if are followed by the current user.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example isFollowingUsers(['thelinmichael', 'wizzler']).then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves into an array of booleans. The order
   *          of the returned array's elements correspond to the users IDs in the request.
   *          The boolean value of true indicates that the user is following that user, otherwise is not.
   *          Not returned if a callback is given.
   */
  this.isFollowingUsers = function(userIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/following/contains')
      .withQueryParameters({
        ids: userIds.join(','),
        type: 'user'
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };


  /**
   * Check if users are following a playlist.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {String[]} User IDs of the following users
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful returns an array of booleans. If rejected,
   * it contains an error object. Not returned if a callback is given.
   */
  this.areFollowingPlaylist = function(userId, playlistId, followerIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/followers/contains')
      .withQueryParameters({
        ids : followerIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Check to see if the current user is following one or more artists.
   * @param {string[]} artistIds The IDs of the artists to check if are followed by the current user.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example isFollowingArtists(['0LcJLqbBmaGUft1e9Mm8HV', '3gqv1kgivAc92KnUm4elKv']).then(...)
   * @returns {Promise|undefined} A promise that if successful, resolves into an array of booleans. The order
   *          of the returned array's elements correspond to the artists IDs in the request.
   *          The boolean value of true indicates that the user is following that artist, otherwise is not.
   *          Not returned if a callback is given.
   */
  this.isFollowingArtists = function(artistIds, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/following/contains')
      .withQueryParameters({
        ids: artistIds.join(','),
        type: 'artist'
      })
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Retrieve new releases
   * @param {Object} [options] Options, being country, limit and/or offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
   * album objects. Not returned if a callback is given.
   */
  this.getNewReleases = function(options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/browse/new-releases')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withQueryParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Retrieve featured playlists
   * @param {Object} [options] Options, being country, locale, timestamp, limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
   * featured playlists. Not returned if a callback is given.
   */
  this.getFeaturedPlaylists = function(options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/browse/featured-playlists')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withQueryParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise =  _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Retrieve a list of categories used to tag items in Spotify (e.g. in the 'Browse' tab)
   * @param {Object} [options] Options, being country, locale, limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object of categories.
   * Not returned if a callback is given.
   */
  this.getCategories = function(options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/browse/categories')
      .withQueryParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Retrieve a category.
   * @param {string} categoryId The id of the category to retrieve.
   * @param {Object} [options] Options, being country, locale.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a category object.
   * Not returned if a callback is given.
   */
  this.getCategory = function(categoryId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/browse/categories/' + categoryId)
      .withQueryParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Retrieve playlists for a category.
   * @param {string} categoryId The id of the category to retrieve playlists for.
   * @param {Object} [options] Options, being country, limit, offset.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves to a paging object containing simple playlists.
   * Not returned if a callback is given.
   */
  this.getPlaylistsForCategory = function(categoryId, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/browse/categories/' + categoryId + '/playlists')
      .withQueryParameters(options)
      .build();

    _addAccessToken(request, this.getAccessToken());

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

}

module.exports = SpotifyWebApi;
