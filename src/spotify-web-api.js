var AuthenticationRequest = require('./authentication-request'),
    WebApiRequest = require('./webapi-request'),
    HttpManager = require('./http-manager'),
    PromiseImpl = require('promise');

function SpotifyWebApi(credentials) {
  'use strict';

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
   * @example getTrack('3Qm86XLflmIXVm1wcwkgDK').then(...)
   * @returns {Promise} A promise that if successful, returns an object containing information
   *          about the track.
   */
  this.getTrack = function(trackId) {
    var request = WebApiRequest.builder()
      .withPath('/v1/tracks/' + trackId)
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Look up several tracks.
   * @param {string[]} trackIds The ID's of the artists.
   * @example getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing information
   *          about the artists.
   */
  this.getTracks = function(trackIds) {
    var request = WebApiRequest.builder()
      .withPath('/v1/tracks')
      .withQueryParameters({
        'ids' : trackIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Look up an album.
   * @param {string} albumId The album's ID.
   * @example getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(...)
   * @returns {Promise} A promise that if successful, returns an object containing information
   *          about the album.
   */
  this.getAlbum = function(albumId) {
    var request = WebApiRequest.builder().withPath('/v1/albums/' + albumId).build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Look up several albums.
   * @param {string[]} artistIds The ID's of the artists.
   * @example getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing information
   *          about the artists.
   */
  this.getAlbums = function(albumIds) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums')
      .withQueryParameters({
        'ids' : albumIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Look up an artist.
   * @param {string} artistId The artist's ID.
   * @example api.getArtist('1u7kkVrr14iBvrpYnZILJR').then(...)
   * @returns {Promise} A promise that if successful, returns an object containing information
   *          about the artist.
   */
  this.getArtist = function(artistId) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId)
      .build();

    _addAccessToken(request);
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Look up several artists.
   * @param {string[]} artistIds The ID's of the artists.
   * @example getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing information
   *          about the artists.
   */
  this.getArtists = function(artistIds) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists')
      .withQueryParameters({
        'ids' : artistIds.join(',')
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Search for an album.
   * @param {string} query The search query.
   * @param {Object} [options] The possible options, e.g. limit, offset.
   * @example searchArtists('David Bowie', { limit : 5, offset : 1 }).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object.
   */
  this.searchAlbums = function(query, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'album',
        q : query
      })
      .build();

      _addAccessToken(request, this.getAccessToken());
      _addQueryParameters(request, options);
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Search for an artist.
   * @param {string} query The search query.
   * @param {Object} [options] The possible options, e.g. limit, offset.
   * @example searchArtists('David Bowie', { limit : 5, offset : 1 }).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object.
   */
  this.searchArtists = function(query, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'artist',
        q : query
      })
      .build();

      _addAccessToken(request, this.getAccessToken());
      _addQueryParameters(request, options);
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Search for a track.
   * @param {string} query The search query.
   * @param {Object} [options] The possible options, e.g. limit, offset.
   * @example searchTracks('Mr. Brightside', { limit : 3, offset : 2 }).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the
   *          search results. The result is paginated. If the promise is rejected,
   *          it contains an error object.
   */
  this.searchTracks = function(query, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'track',
        q : query
      })
      .build();

      _addAccessToken(request, this.getAccessToken());
      _addQueryParameters(request, options);
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Get an artist's albums.
   * @param {string} artistId The artist's ID.
   * @options {Object} [options] The possible options, e.g. limit, offset.
   * @example getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 }).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the albums
   *          for the given artist. The result is paginated. If the promise is rejected,
   *          it contains an error object.
   */
  this.getArtistAlbums = function(artistId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId + '/albums')
      .build();

      _addAccessToken(request, this.getAccessToken());
      _addQueryParameters(request, options);
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Get the tracks of an album.
   * @param albumId the album's ID.
   * @options {Object} [options] The possible options, e.g. limit.
   * @example getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 }).then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the
   *                    tracks in the album. The result is paginated. If the promise is rejected.
   *                    it contains an error object.
   */
  this.getAlbumTracks = function(albumId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/albums/' + albumId + '/tracks')
      .build();

      _addAccessToken(request, this.getAccessToken());
      _addQueryParameters(request, options);
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Get an artist's top tracks.
   * @param {string} artistId The artist's ID.
   * @param {string} country The country/territory where the tracks are most popular. (format: ISO 3166-1 alpha-2)
   * @example getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB').then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the
   *          artist's top tracks in the given country. If the promise is rejected,
   *          it contains an error object.
   */
  this.getArtistTopTracks = function(artistId, country) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId + '/top-tracks')
      .withQueryParameters({
        'country' : country
      })
      .build();

      _addAccessToken(request, this.getAccessToken());
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Get related artists.
   * @param {string} artistId The artist's ID.
   * @example getArtistRelatedArtists('0oSGxfWSnnOXhD2fKuz2Gy').then(...)
   * @returns {Promise} A promise that if successful, returns an object containing the
   *          related artists. If the promise is rejected, it contains an error object.
   */
  this.getArtistRelatedArtists = function(artistId) {
    var request = WebApiRequest.builder()
      .withPath('/v1/artists/' + artistId + '/related-artists')
      .build();

      _addAccessToken(request, this.getAccessToken());
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Get information about a user.
   * @param userId The user ID.
   * @example getUser('thelinmichael').then(...)
   * @returns {Promise} A promise that if successful, resolves to an object
   *          containing information about the user. If the promise is
   *          rejected, it contains an error object.
   */
  this.getUser = function(userId) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId)
      .build();

      _addAccessToken(request, this.getAccessToken());
      return _performRequest(HttpManager.get, request);
  };

  /**
   * Get information about the user that has signed in (the current user).
   * @example getMe().then(...)
   * @returns {Promise} A promise that if successful, resolves to an object
   *          containing information about the user. The amount of information
   *          depends on the permissions given by the user. If the promise is
   *          rejected, it contains an error object.
   */
  this.getMe = function() {
    var request = WebApiRequest.builder()
      .withPath('/v1/me')
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Get a user's playlists.
   * @param {string} userId The user ID.
   * @example getUserPlaylists('thelinmichael').then(...)
   * @returns {Promise} A promise that if successful, resolves to an object containing
   *          the a list of playlists. If rejected, it contains an error object.
   */
  this.getUserPlaylists = function(userId) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists')
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Get a playlist.
   * @param {string} userId The playlist's owner's user ID.
   * @param {string} playlistId The playlist's ID.
   * @param {Object} [options] The options supplied to this request.
   * @example getPlaylist('thelinmichael', '3EsfV6XzCHU8SPNdbnFogK').then(...)
   * @returns {Promise} A promise that if successful, resolves to an object containing
   *          the playlist. If rejected, it contains an error object.
   */
  this.getPlaylist = function(userId, playlistId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId)
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);
    return _performRequest(HttpManager.get, request);
  };

  /**
   * Get tracks in a playlist.
   * @param {string} userId THe playlist's owner's user ID.
   * @param {string} playlistId The playlist's ID.
   * @param {Object} [options] Optional options, such as fields.
   * @example getPlaylistTracks('thelinmichael', '3ktAYNcRHpazJ9qecm3ptn').then(...)
   * @returns {Promise} A promise that if successful, resolves to an object that containing
   * the tracks in the playlist. If rejected, it contains an error object.
   */
   this.getPlaylistTracks = function(userId, playlistId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks')
      .withQueryParameters(options)
      .build();
     _addAccessToken(request, this.getAccessToken());
     return _performRequest(HttpManager.get, request);
   };

  /**
   * Create a playlist.
   * @param {string} userId The playlist's owner's user ID.
   * @param {string} playlistName The name of the playlist.
   * @example createPlaylist('thelinmichael', 'My cool playlist!').then(...)
   * @returns {Promise} A promise that if successful, resolves to an object containing information about the
   *          created playlist. If rejected, it contains an error object.
   */
  this.createPlaylist = function(userId, playlistName) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters({ 'name' : playlistName })
      .build();

    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.post, request);
  };

  /**
   * Change playlist details.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {Object} [options] The possible options, e.g. name, public.
   * @example changePlaylistDetails('thelinmichael', '3EsfV6XzCHU8SPNdbnFogK', {name: 'New name', public: true}).then(...)
   * @returns {Promise} A promise that if successful, simply resolves to an empty object. If rejected,
   * it contains an error object.
   */
  this.changePlaylistDetails = function(userId, playlistId, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(options)
      .build();

      _addAccessToken(request, this.getAccessToken());
      return _performRequest(HttpManager.put, request);
  };

  /**
   * Add tracks to a playlist.
   * @todo: Add position.
   * @param {string} userId The playlist's owner's user ID
   * @param {string} playlistId The playlist's ID
   * @param {string[]} tracks ID's of the tracks to add to the playlist.
   * @param {Object} [options] Options, position being the only one.
   * @example addTracksToPlaylist('thelinmichael', '3EsfV6XzCHU8SPNdbnFogK',
              '["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]').then(...)
   * @returns {Promise} A promise that if successful, simply resolves to an empty object. If rejected,
   * it contains an error object.
   */
  this.addTracksToPlaylist = function(userId, playlistId, tracks, options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/users/' + userId + '/playlists/' + playlistId + '/tracks')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(tracks)
      .build();

    _addQueryParameters(request, options);
    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.post, request);
  };

  /**
   * Request an access token using the Client Credentials flow.
   * Requires that client ID and client secret has been set previous to the call.
   * @
   * @returns {Promise} A promise that if successful, resolves into an object containing the access token,
   *          token type and time to expiration. If rejected, it contains an error object.
   */
  this.clientCredentialsGrant = function(options) {
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
      return _performRequest(HttpManager.post, request);
  };

  /**
   * Request an access token using the Authorization Code flow.
   * Requires that client ID, client secret, and redirect URI has been set previous to the call.
   * @param {string} code The authorization code returned in the callback in the Authorization Code flow.
   * @returns {Promise} A promise that if successful, resolves into an object containing the access token,
   *          refresh token, token type and time to expiration. If rejected, it contains an error object.
   */
  this.authorizationCodeGrant = function(code) {
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

      return _performRequest(HttpManager.post, request);
  };

  /**
   * Refresh the access token given that it hasn't expired.
   * Requires that client ID, client secret and refresh token has been set previous to the call.
   * @returns {Promise} A promise that if successful, resolves to an object containing the
   *          access token, time to expiration and token type. If rejected, it contains an error object.
   */
  this.refreshAccessToken = function() {
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

      return _performRequest(HttpManager.post, request);
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
   * @param {Object} [options] Options, being limit and/or offset.
   * @returns {Promise} A promise that if successful, resolves to an object containing a paging object which in turn contains
   * playlist track objects.
   */
  this.getMySavedTracks = function(options) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/tracks')
      .withQueryParameters(options)
      .build();
     _addAccessToken(request, this.getAccessToken());
     return _performRequest(HttpManager.get, request);
  };

  /**
   * Check if one or more tracks is already saved in the current Spotify user’s “Your Music” library.
   * @param {string[]} trackIds The track IDs
   * @returns {} Returns a promise that if successful, resolves into an array of booleans. The order
   * of the returned array's elements correspond to the track ID in the request.
   * The boolean value of true indiciates that the track is part of the user's library, otherwise false.
   */
   this.containsMySavedTracks = function(trackIds) {
    var request = WebApiRequest.builder()
      .withPath('/v1/me/tracks/contains')
      .withQueryParameters({
        'ids' : trackIds.join(',')
      })
      .build();
     _addAccessToken(request, this.getAccessToken());
     return _performRequest(HttpManager.get, request);
  };

  /**
   * Remove a track from the authenticated user's Your Music library.
   * @param {string[]} trackIds The track IDs
   * @returns {Promise} Returns a promise that if successfull returns null, otherwise an error.
   */
  this.removeFromMySavedTracks = function(trackIds) {
    var request = WebApiRequest.builder()
    .withPath('/v1/me/tracks')
    .withHeaders({ 'Content-Type' : 'application/json' })
    .withBodyParameters(trackIds)
    .build();
    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.del, request);
  };

   /**
   * Remove a track from the authenticated user's Your Music library.
   * @param {string[]} trackIds The track IDs
   * @returns {Promise} Returns a promise that if successfull returns null, otherwise an error.
   */
  this.addToMySavedTracks = function(trackIds) {
    var request = WebApiRequest.builder()
    .withPath('/v1/me/tracks')
    .withHeaders({ 'Content-Type' : 'application/json' })
    .withBodyParameters(trackIds)
    .build();
    _addAccessToken(request, this.getAccessToken());
    return _performRequest(HttpManager.put, request);
  };
}

module.exports = SpotifyWebApi;
