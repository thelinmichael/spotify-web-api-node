const { stub } = require('sinon');
var superagent = require('superagent'),
  HttpManager = require('../src/http-manager'),
  sinon = require('sinon'),
  SpotifyWebApi = require('../src/server'),
  { TimeoutError, 
    WebapiError, 
    WebapiRegularError, 
    WebapiAuthenticationError,
    WebapiPlayerError 
  } =  require('../src/response-error');

('use strict');

describe('Spotify Web API', () => {
  beforeEach(done => {
    done();
  });

  afterEach(done => {
    if (typeof HttpManager._makeRequest.restore == 'function') {
      HttpManager._makeRequest.restore();
    }
    done();
  });

  test('should set clientId, clientSecret and redirectUri', () => {
    var credentials = {
      clientId: 'someClientId',
      clientSecret: 'someClientSecret',
      redirectUri: 'myRedirectUri',
      accessToken: 'mySuperNiceAccessToken',
      refreshToken: 'iCanEvenSaveMyAccessToken'
    };

    var api = new SpotifyWebApi(credentials);

    expect(api.getCredentials().clientId).toBe(credentials.clientId);
    expect(api.getCredentials().clientSecret).toBe(credentials.clientSecret);
    expect(api.getCredentials().redirectUri).toBe(credentials.redirectUri);
    expect(api.getCredentials().accessToken).toBe(credentials.accessToken);
    expect(api.getCredentials().refreshToken).toBe(credentials.refreshToken);
  });
  
  test('response should contain body, headers and status code', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      callback(null, {
        body: { uri: 'spotify:track:3Qm86XLflmIXVm1wcwkgDK' },
        headers: { 'cache-control': 'public, max-age=7200' },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        expect(data.body.uri).toBe('spotify:track:3Qm86XLflmIXVm1wcwkgDK');
        expect(data.statusCode).toBe(200);
        expect(data.headers['cache-control']).toBe('public, max-age=7200');
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve track metadata', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.data).toBeFalsy();
      callback(null, {});
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('error response should contain body, headers and status code', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.data).toBeFalsy();
      callback(new WebapiRegularError(
        { 
          error : {
            message : 'Do NOT do that again!',
            status : 400
          }
        },
        {
          'Content-Type' : 'application/json'
        },
        400
      ));
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        done(new Error('Test failed!'));
      },
      function(err) {
        expect(err.body.error.message).toBe('Do NOT do that again!');
        expect(err.body.error.status).toBe(400);
        expect(err.headers['Content-Type']).toBe('application/json');
        expect(err.statusCode).toBe(400);
        done();
      }
    );
  });

  test('should get track for Swedish market', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.query.market).toBe('SE');
      expect(options.data).toBeFalsy();
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK', { market: 'SE' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve track metadata using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.data).toBeFalsy();
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK', {}, function(err, data) {
      expect(err).toBeFalsy();
      done(err);
    });
  });

  test('should retrieve metadata for several tracks', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/tracks');
      expect(options.query.ids).toBe(
        '0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G'
      );
      expect(options.data).toBeFalsy();
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTracks(['0eGsygTp906u18L0Oimnem', '1lDWb6b6ieDQ2xT7ewTC3G']).then(
      function(data) {
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve metadata for an album', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: { uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj' },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(
      function(data) {
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve metadata for an album for a market ', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
      );
      expect(options.data).toBeFalsy();
      expect(options.query.market).toBe('SE');
      callback(null, {
        body: { uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj' },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj', { market: 'SE' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve metadata for an album using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
      );
      expect(options.data).toBeFalsy();
      callback(null, {});
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj', {}, function(err, data) {
      done(err);
    });
  });

  test('should retrieve metadata for several albums', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/albums');
      expect(options.query.ids).toBe(
        '41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4'
      );
      expect(options.data).toBeFalsy();
      callback(null, {});
    });

    var api = new SpotifyWebApi();
    api.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4']).then(
      function(data) {
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve metadata for several albums using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/albums');
      expect(options.query.ids).toBe(
        '41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          albums: [
            { uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ' },
            { uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4' }
          ]
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbums(
      ['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4'],
      {},
      function(err, data) {
        done(err);
      }
    );
  });

  test('should retrieve metadata for an artist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: { uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV' }
      });
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve metadata for an artist using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: { uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV' }
      });
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV', function(err, data) {
      expect(err).toBeFalsy();
      done();
    });
  });

  test('should retrieve metadata for several artists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/artists');
      expect(options.query.ids).toBe(
        '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          artists: [
            { uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy' },
            { uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin' }
          ]
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']).then(
      function(data) {
        expect(data.body.artists[0].uri).toBe(
          'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'
        );
        expect(data.body.artists[1].uri).toBe(
          'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'
        );
        expect(data.statusCode).toBe(200);
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve metadata for several artists using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/artists');
      expect(options.query.ids).toBe(
        '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          artists: [
            { uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy' },
            { uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin' }
          ]
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.getArtists(
      ['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin'],
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.artists[0].uri).toBe(
          'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'
        );
        expect(data.body.artists[1].uri).toBe(
          'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'
        );
        expect(data.statusCode).toBe(200);
        done();
      }
    );
  });

  test('should search for an album using limit and offset', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 3,
        offset: 2,
        q: 'The Best of Keane',
        type: 'album'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          albums: {
            href:
              'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
          }
        },
        headers: {
          test: 'value'
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit: 3, offset: 2 }).then(
      function(data) {
        expect(data.body.albums.href).toBe(
          'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
        );
        expect(data.statusCode).toBe(200);
        expect('value').toBe(data.headers.test);
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should search for an album using limit and offset using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 3,
        offset: 2,
        q: 'The Best of Keane',
        type: 'album'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          albums: {
            href:
              'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit: 3, offset: 2 }, function(
      err,
      data
    ) {
      expect(err).toBeFalsy();
      expect(data.body.albums.href).toBe(
        'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
      );
      done();
    });
  });

  test('should search for playlists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 1,
        offset: 0,
        q: 'workout',
        type: 'playlist'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          playlists: {
            href:
              'https://api.spotify.com/v1/search?q=workout&offset=0&limit=1&type=playlist'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchPlaylists('workout', { limit: 1, offset: 0 }).then(
      function(data) {
        expect(data.body.playlists.href).toBe(
          'https://api.spotify.com/v1/search?q=workout&offset=0&limit=1&type=playlist'
        );
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should search for an artist using limit and offset', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 5,
        offset: 1,
        q: 'David Bowie',
        type: 'artist'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          artists: {
            href:
              'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit: 5, offset: 1 }).then(
      function(data) {
        expect(data.body.artists.href).toBe(
          'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
        );
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should search for an artist using limit and offset using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 5,
        offset: 1,
        q: 'David Bowie',
        type: 'artist'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          artists: {
            href:
              'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit: 5, offset: 1 }, function(
      err,
      data
    ) {
      expect(err).toBeFalsy();
      expect(data.body.artists.href).toBe(
        'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
      );
      done();
    });
  });

  test('should search for a track using limit and offset', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          tracks: {
            href:
              'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit: 3, offset: 2 }).then(
      function(data) {
        expect(data.body.tracks.href).toBe(
          'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
        );
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should search for a track using limit and offset using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          tracks: {
            href:
              'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit: 3, offset: 2 }, function(
      err,
      data
    ) {
      expect(err).toBeFalsy();
      expect(data.body.tracks.href).toBe(
        'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
      );
      done();
    });
  });

  test('should search for several types using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/search/');
      expect(options.query).toEqual({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track,album'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          tracks: {
            href:
              'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track,album'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.search(
      'Mr. Brightside',
      ['track', 'album'],
      { limit: 3, offset: 2 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.tracks.href).toBe(
          'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track,album'
        );
        done();
      }
    );
  });

  test('should get artists albums', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums'
      );
      expect(options.query).toEqual({
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          href:
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        }
      });
    });

    var api = new SpotifyWebApi();
    api
      .getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', {
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      })
      .then(
        function(data) {
          expect(data.body.href).toBe(
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
          );
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test('should get artists albums using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums'
      );
      expect(options.query).toEqual({
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          href:
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getArtistAlbums(
      '0oSGxfWSnnOXhD2fKuz2Gy',
      { album_type: 'album', country: 'GB', limit: 2, offset: 5 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.href).toBe(
          'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        );
        done();
      }
    );
  });

  test('should get tracks from album', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks'
      );
      expect(options.query).toEqual({
        offset: 1,
        limit: 5
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          href:
            'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit: 5, offset: 1 }).then(
      function(data) {
        expect(data.body.href).toBe(
          'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        );
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should get tracks from album using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks'
      );
      expect(options.query).toEqual({
        offset: 1,
        limit: 5
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          href:
            'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbumTracks(
      '41MnTivkwTO3UUJ8DrqEJJ',
      { limit: 5, offset: 1 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.href).toEqual(
          'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        );
        done();
      }
    );
  });

  test('should get top tracks for artist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks'
      );
      expect(options.query).toEqual({
        country: 'GB'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var api = new SpotifyWebApi();

    api.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB').then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should get top tracks for artist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks'
      );
      expect(options.query).toEqual({
        country: 'GB'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var api = new SpotifyWebApi();

    api.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB', function(err, data) {
      expect(err).toBeFalsy();
      done();
    });
  });

  test('should get similar artists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          artists: [{}]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy').then(
      function(data) {
        expect(data.body.artists).toBeTruthy();
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should get similar artists using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists'
      );
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          artists: [{}]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy', function(err, data) {
      expect(data.body.artists).toBeTruthy();
      done();
    });
  });

  test('should get a user', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/users/petteralexis');
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          uri: 'spotify:user:petteralexis'
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis').then(
      function(data) {
        expect('spotify:user:petteralexis').toBe(data.body.uri);
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test("should get a user with a '#' character and encode it properly", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/users/%23matze23');
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          uri: 'spotify:user:%23matze23'
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('#matze23').then(
      function(data) {
        expect('spotify:user:%23matze23').toBe(data.body.uri);
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should get a user using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/users/petteralexis');
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          uri: 'spotify:user:petteralexis'
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis', function(err, data) {
      expect('spotify:user:petteralexis').toBe(data.body.uri);
      done();
    });
  });

  test("should get the authenticated user's information", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me');
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          uri: 'spotify:user:thelinmichael'
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMe().then(function(data) {
      expect('spotify:user:thelinmichael').toBe(data.body.uri);
      done();
    });
  });

  test("should get the authenticated user's information with accesstoken set on the api object", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me');
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          uri: 'spotify:user:thelinmichael'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('someAccessToken');

    api.getMe().then(function(data) {
      expect('spotify:user:thelinmichael').toBe(data.body.uri);
      done();
    });
  });

  test('should get a users playlists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/users/thelinmichael/playlists'
      );
      expect(options.query).toBeFalsy();
      callback(null, {
        body: {
          items: [
            {
              uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'
            },
            {
              uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK'
            }
          ]
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryLongAccessToken');

    api.getUserPlaylists('thelinmichael').then(function(data) {
      expect(2).toBe(data.body.items.length);
      expect(data.statusCode).toBe(200);
      done();
    });
  });

  test('should get the current users playlists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/playlists');
      expect(options.query).toBeFalsy();
      callback(null, {
        body: {
          items: [
            {
              uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'
            },
            {
              uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK'
            }
          ]
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryLongAccessToken');

    api.getUserPlaylists().then(function(data) {
      expect(2).toBe(data.body.items.length);
      expect(data.statusCode).toBe(200);
      done();
    });
  });

  test('should get the current users playlists with options', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/playlists');
      expect(options.query).toEqual({ limit: 27, offset: 7 });
      callback(null, {
        body: {
          items: [
            {
              uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'
            },
            {
              uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK'
            }
          ]
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryLongAccessToken');

    api.getUserPlaylists({ limit: 27, offset: 7 }).then(function(data) {
      expect(2).toBe(data.body.items.length);
      expect(data.statusCode).toBe(200);
      done();
    });
  });

  test('should get a playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK'
      );
      expect(options.query).toBeFalsy();
      callback(null, {
        body: {
          uri: 'spotify:playlist:5ieJqeLJjjI8iJWaxeBLuK'
        },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryVeryLongAccessToken');

    api.getPlaylist('5ieJqeLJjjI8iJWaxeBLuK', {}, function(err, data) {
      expect(data.body.uri).toBe('spotify:playlist:5ieJqeLJjjI8iJWaxeBLuK');
      expect(data.statusCode).toBe(200);
      done();
    });
  });

  test('should create a playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://api.spotify.com/v1/me/playlists'
      );
      expect(JSON.parse(options.data)).toEqual({
        name: 'My Cool Playlist'
      });
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.query).toBeFalsy();
      callback(null, {
        body: { name: 'My Cool Playlist' },
        statusCode: 200
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api
      .createPlaylist('My Cool Playlist')
      .then(
        function(data) {
          expect(data.body.name).toBe('My Cool Playlist');
          expect(data.statusCode).toBe(200);
          done();
        },
        function(err) {
          console.log(err.error);
          done(err);
        }
      );
  });

  test('should create a private playlist using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://api.spotify.com/v1/me/playlists'
      );
      expect(JSON.parse(options.data)).toEqual({
        name: 'My Cool Playlist',
        description: 'It\'s really cool',
        public: false
      });
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.query).toBeFalsy();
      callback(null, {});
    });

    var api = new SpotifyWebApi();

    api.createPlaylist(
      'My Cool Playlist',
      { description: 'It\'s really cool', public: false },
      function(err, data) {
        done(err);
      }
    );
  });

  test('should change playlist details', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK'
      );
      expect(JSON.parse(options.data)).toEqual({
        name:
          'This is a new name for my Cool Playlist, and will become private',
        public: false
      });
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.query).toBeFalsy();
      callback(null, { statusCode: 200 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.changePlaylistDetails('5ieJqeLJjjI8iJWaxeBLuK', {
        name: 'This is a new name for my Cool Playlist, and will become private',
        public: false
      })
      .then(function(data) {
        expect(data.statusCode).toBe(200);
        done();
      });
  });

  test('should add tracks to playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(options.query).toBeFalsy();
      expect(JSON.parse(options.data)['uris']).toBeInstanceOf(Array);
      expect(JSON.parse(options.data)['uris']).toHaveLength(2);
      expect(options.headers['Content-Type']).toBe('application/json');
      callback(null, { body: { snapshot_id: 'aSnapshotId' }, statusCode: 201 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api
      .addTracksToPlaylist('5ieJqeLJjjI8iJWaxeBLuK', [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ])
      .then(function(data) {
        expect(201).toBe(data.statusCode);
        done();
      });
  });

  test('should add tracks to playlist with specified index', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(JSON.parse(options.data)['uris']).toBeInstanceOf(Array);
      expect(JSON.parse(options.data)['uris']).toHaveLength(2);
      expect(options.query).toEqual({
        position: 10
      });
      expect(options.headers['Content-Type']).toBe('application/json');
      callback(null, { body: { snapshot_id: 'aSnapshotId' }, statusCode: 201 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api
      .addTracksToPlaylist(
        '5ieJqeLJjjI8iJWaxeBLuK',
        [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M'
        ],
        {
          position: 10
        }
      )
      .then(function(data) {
        done();
      });
  });

  /* Get a Playlist's Items */
  test('should get a playlist items', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/playlists/3iV5W9uYEdYUVa79Axb7Rh/tracks');
      expect(options.query).toEqual({
        limit: 5,
        offset: 1,
        market: 'SE',
        additional_types : 'episode',
        fields : 'total'
      });
      callback(null, {
        body: {}
      });
    });

    var api = new SpotifyWebApi();

    api.getPlaylistTracks('3iV5W9uYEdYUVa79Axb7Rh', { limit: 5, offset: 1, market: 'SE', additional_types: 'episode', fields : 'total' }).then(function(data) {
      done();
    });
  });

  /* Upload a Custom Playlist Cover Image */
  test('should upload custom playlist cover image', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/playlists/3iV5W9uYEdYUVa79Axb7Rh/images');
      expect(options.headers['Content-Type']).toBe('image/jpeg');
      expect(options.data).toEqual('longbase64uri');
      
      callback(null, {
        body: {}
      });
    });

    var api = new SpotifyWebApi();

    api.uploadCustomPlaylistCoverImage('3iV5W9uYEdYUVa79Axb7Rh', 'longbase64uri').then(function(data) {
      done();
    });
  });

  test("should get user's top artists", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/top/artists');
      expect(options.query).toEqual({
        limit: 5
      });
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          items: []
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyTopArtists({ limit: 5 }).then(function(data) {
      expect(data.body.items).toBeTruthy();
      done();
    });
  });

  test("should get user's top tracks", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/top/tracks');
      expect(options.query).toEqual({
        limit: 5
      });
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          items: []
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyTopTracks({ limit: 5 }).then(function(data) {
      expect(data.body.items).toBeTruthy();
      done();
    });
  });

  test("should get user\'s currently playing track", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/currently-playing');
      expect(options.query).toStrictEqual({ market: 'NO' });
      expect(options.headers).toEqual({ Authorization: 'Bearer someAccessToken' });
      callback(null, {});
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyCurrentPlayingTrack({ market: 'NO' }).then(function(data, err) {
      done(err);
    });
  });

  test("should get user's recently played tracks:", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/recently-played');
      expect(options.query).toEqual({
        limit: 5
      });
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          items: []
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyRecentlyPlayedTracks({ limit: 5 }).then(function(data) {
      expect(data.body.items).toBeTruthy();
      done();
    });
  });

  test("should add songs to the user's queue:", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/queue');
      expect(options.query).toEqual({
        uri: 'spotify:track:2jpDioAB9tlYXMdXDK3BGl'
      });
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, null);
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.addToQueue('spotify:track:2jpDioAB9tlYXMdXDK3BGl').then(done);
  });

  test("should get user's devices:", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/devices');
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          devices: []
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyDevices().then(function(data) {
      expect(data.body.devices).toBeTruthy();
      done();
    });
  });

  test("should get user's current playback status:", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/player');
      expect(options.query).toEqual({
        market: 'GB'
      });
      expect(options.headers).toEqual({
        Authorization: 'Bearer someAccessToken'
      });
      callback(null, {
        body: {
          device: {}
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyCurrentPlaybackState({ market: 'GB' }).then(function(data) {
      expect(data.body.device).toBeTruthy();
      done();
    });
  });

  test("should transfer the user's playback", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player');
      expect(JSON.parse(options.data)).toEqual({
        device_ids : ['my-device-id'],
        play: true
      });
      expect(options.query).toBeFalsy();
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .transferMyPlayback(['my-device-id'], {
        play: true
      })
      .then(
        function(data) {
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test("should transfer the user's playback without using options", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
        method,
        options,
        uri,
        callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player');
      expect(JSON.parse(options.data)).toEqual({
        device_ids : ['my-device-id']
      });
      expect(options.query).toBeFalsy();
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
        .transferMyPlayback(['my-device-id'])
        .then(
            function(data) {
              done();
            },
            function(err) {
              console.log(err);
              done(err);
            }
        );
  });

  test("should resume the user's playback", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/play');
      expect(options.query).toBeFalsy();
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.play().then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should resume the user's playback with options", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/play');
      expect(options.query).toEqual({ device_id: 'my_device_id' });
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(options.data)).toEqual({
        context_uri: 'my_context',
        offset: {
          position: 5
        }
      });
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .play({
        device_id: 'my_device_id',
        context_uri: 'my_context',
        offset: { position: 5 }
      })
      .then(
        function(data) {
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test("should pause the user's playback", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/pause');
      expect(options.query).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.pause().then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should pause the user's playback with options", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/pause');
      expect(options.query).toEqual({ device_id: 'my_device_id' });
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.pause({ device_id: 'my_device_id' }).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should skip the user's playback to next track", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/next');
      expect(options.query).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.skipToNext().then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should skip the user's playback to previous track", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/previous');
      expect(options.query).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.skipToPrevious().then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should set the user's playback repeat mode", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/repeat');
      expect(options.query).toBeTruthy();
      expect(options.query.state).toEqual('off');
      expect(options.query.device_id).toEqual('some-device-id');
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setRepeat('off', { device_id: 'some-device-id' }).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should set the user's playback repeat mode without given device", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/repeat');
      expect(options.query).toBeTruthy();
      expect(options.query.state).toEqual('context');
      expect(options.query.device_id).toBeFalsy();
      expect(options.body).toBeFalsy();
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      expect(options.headers['Content-Type']).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setRepeat('context', {}).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should set the user's playback shuffle mode with device", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/shuffle');
      expect(options.query).toBeTruthy();
      expect(options.query.state).toEqual(true)
      expect(options.query.device_id).toEqual('my-device');
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setShuffle(true, { device_id : 'my-device' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test("should set the user's playback shuffle mode without device id", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/shuffle');
      expect(options.query).toBeTruthy();
      expect(options.query.state).toEqual(false)
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setShuffle(false).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should set the user's playback volume without device id", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/volume');
      expect(options.query).toEqual({
        volume_percent: 75
      });
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setVolume(75).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test("should set the user's playback volume", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/volume');
      expect(options.query).toEqual({
        volume_percent: 80,
        device_id: 'my_device_id'
      });
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setVolume(80, { device_id: 'my_device_id' }).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should seek', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/seek');
      expect(options.query).toEqual({ position_ms: 2000 });
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.seek(2000).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should seek on a certain device', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/player/seek');
      expect(options.query).toEqual({
        position_ms: 2000,
        device_id: 'my_device_id'
      });
      expect(options.body).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.seek(2000, { device_id: 'my_device_id' }).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should remove tracks in the users library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(JSON.parse(options.data)).toEqual({
        ids: ['3VNWq8rTnQG6fM1eldSpZ0']
      });
      expect(uri).toBe('https://api.spotify.com/v1/me/tracks');
      expect(options.query).toBeFalsy();
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.removeFromMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  /* Get My Saved Tracks */
  test('should get tracks in the user\' library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(options.data).toBeFalsy();
      expect(uri).toBe('https://api.spotify.com/v1/me/tracks');
      expect(options.query.limit).toBe(1);
      expect(options.query.offset).toBe(3);
      expect(options.query.market).toBe('SE');
      expect(options.headers['Content-Type']).toBeFalsy();
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getMySavedTracks({ market : 'SE', limit: 1, offset: 3}).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  /* Check if Track is in User\'s Saved Tracks */
  test('should check if track is in user\'s library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/tracks/contains');
      expect(options.data).toBeFalsy();
      expect(options.query.ids).toBe('27cZdqrQiKt3IT00338dws,37cZdqrQiKt3IT00338dzs')
      expect(options.headers['Content-Type']).toBeFalsy();
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.containsMySavedTracks(['27cZdqrQiKt3IT00338dws', '37cZdqrQiKt3IT00338dzs']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should remove albums in the users library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(JSON.parse(options.data)).toEqual(['27cZdqrQiKt3IT00338dws']);
      expect(uri).toBe('https://api.spotify.com/v1/me/albums');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.query).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.removeFromMySavedAlbums(['27cZdqrQiKt3IT00338dws']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should add albums to the users library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(JSON.parse(options.data)).toEqual(['27cZdqrQiKt3IT00338dws']);
      expect(uri).toBe('https://api.spotify.com/v1/me/albums');
      expect(options.query).toBeFalsy();
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.addToMySavedAlbums(['27cZdqrQiKt3IT00338dws']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should get albums in the users library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/albums');
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      expect(options.query.limit).toBe(2);
      expect(options.query.offset).toBe(1);
      callback(null, {
        body: {
          href: 'https://api.spotify.com/v1/me/albums?offset=1&limit=2',
          items: [
            { added_at: '2014-07-08T18:18:33Z', album: { name: 'Album!' } }
          ]
        }
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .getMySavedAlbums({
        limit: 2,
        offset: 1
      })
      .then(
        function(data) {
          expect(data.body.href).toBe(
            'https://api.spotify.com/v1/me/albums?offset=1&limit=2'
          );
          expect(data.body.items[0]['added_at']).toBe('2014-07-08T18:18:33Z');
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test('should determine if an album is in the users library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/albums/contains');
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      expect(options.query.ids).toBe('27cZdqrQiKt3IT00338dws');
      callback(null, { body: [true] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });
    api.containsMySavedAlbums(['27cZdqrQiKt3IT00338dws']).then(
      function(data) {
        expect(Object.prototype.toString.call(data.body)).toBe(
          '[object Array]'
        );
        expect(data.body.length).toBe(1);
        expect(data.body[0]).toBe(true);
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should follow a playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(JSON.parse(options.data)).toEqual({ public: false });
      expect(options.query).toBeFalsy();
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/7p9EIC2KW0NNkTEOnTUZJl/followers'
      );
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .followPlaylist('7p9EIC2KW0NNkTEOnTUZJl', {
        public: false
      })
      .then(
        function(data) {
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test('should unfollow a playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(options.data).toBeFalsy();
      expect(options.query).toBeFalsy();
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/7p9EIC2KW0NNkTEOnTUZJl/followers'
      );
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.unfollowPlaylist('7p9EIC2KW0NNkTEOnTUZJl').then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should follow several users', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.followUsers(['thelinmichael', 'wizzler']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should follow several users using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.followUsers(['thelinmichael', 'wizzler'], function(err, data) {
      expect(err).toBeFalsy();
      done();
    });
  });

  test('should follow several artists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.followArtists(['137W8MRPWKqSmrBGDBFSop']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should follow several artists using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.followArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      done();
    });
  });

  test('should unfollow several users', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.unfollowUsers(['thelinmichael', 'wizzler']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should unfollow several users using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.unfollowUsers(['thelinmichael', 'wizzler'], function(err, data) {
      done();
    });
  });

  test('should unfollow several artists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      expect(options.data).toBeFalsy();
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.unfollowArtists(['137W8MRPWKqSmrBGDBFSop']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should unfollow several artists using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      expect(options.data).toBeFalsy();
      callback(null, { statusCode: 200 });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.unfollowArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      expect(data.statusCode).toBe(200);
      done();
    });
  });

  test('should check whether the current user follows several other users', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/following/contains');
      expect(options.query).toEqual({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: [true, false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.isFollowingUsers(['thelinmichael', 'wizzler']).then(
      function(data) {
        expect(data.body).toEqual([true, false]);
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should check whether the current user follows several other users using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/following/contains');
      expect(options.query).toEqual({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: [true, false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.isFollowingUsers(['thelinmichael', 'wizzler'], function(err, data) {
      expect(err).toBeFalsy();
      expect(data.body).toEqual([true, false]);
      done();
    });
  });

  test('should check whether the current user follows several artists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/following/contains');
      expect(options.query).toEqual({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: [false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.isFollowingArtists(['137W8MRPWKqSmrBGDBFSop']).then(
      function(data) {
        expect(data.body).toEqual([false]);
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should check whether the current user follows several artists using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/following/contains');
      expect(options.query).toEqual({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: [false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.isFollowingArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      expect(err).toBeFalsy();
      expect(data.body).toEqual([false]);
      done();
    });
  });

  test("should get a user's followed artists using callback", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'artist',
        after: '6tbXwhqy3WAFqanusCLvEU',
        limit: 3
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: { artists: { items: [] } } });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getFollowedArtists({ after: '6tbXwhqy3WAFqanusCLvEU', limit: 3 }).then(
      function(data) {
        expect(data.body.artists).toBeTruthy();
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test("should get a user's followed artists using callback", done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/me/following');
      expect(options.query).toEqual({
        type: 'artist',
        after: '6tbXwhqy3WAFqanusCLvEU',
        limit: 3
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: { artists: { items: [] } } });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getFollowedArtists(
      { after: '6tbXwhqy3WAFqanusCLvEU', limit: 3 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.artists).toBeTruthy();
        done();
      }
    );
  });

  test('should check whether users follows a playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/users/spotify_germany/playlists/2nKFnGNFvHX9hG5Kv7Bm3G/followers/contains'
      );
      expect(options.query).toEqual({
        ids: 'thelinmichael,ella'
      });
      expect(options.data).toBeFalsy();
      callback(null, { body: [true, false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .areFollowingPlaylist('spotify_germany', '2nKFnGNFvHX9hG5Kv7Bm3G', [
        'thelinmichael',
        'ella'
      ])
      .then(
        function(data) {
          expect(data.body).toEqual([true, false]);
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test('should add tracks to playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(options.query).toBeFalsy();
      expect(JSON.parse(options.data)['uris']).toBeInstanceOf(Array);
      expect(JSON.parse(options.data)['uris']).toHaveLength(2);
      expect(options.headers.Authorization).toBe('Bearer long-access-token');
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api
      .addTracksToPlaylist('5ieJqeLJjjI8iJWaxeBLuK', [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ])
      .then(
        function(data) {
          done();
        },
        function(err) {
          console.log(err.error);
          done(err);
        }
      );
  });

  test('should add tracks to playlist using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(options.query).toBeFalsy();
      expect(JSON.parse(options.data)['uris']).toBeInstanceOf(Array);
      expect(JSON.parse(options.data)['uris']).toHaveLength(2);
      expect(options.headers.Authorization).toBe('Bearer long-access-token');
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.addTracksToPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ],
      null,
      function(err, data) {
        done();
      }
    );
  });

  test('should remove tracks from a playlist by position', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(method).toBe(superagent.del);
      expect(options.query).toBeFalsy();
      var body = JSON.parse(options.data);
      expect(body.positions[0]).toBe(0);
      expect(body['snapshot_id']).toBe(
        '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      );
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.headers['Authorization']).toBe('Bearer long-access-token');
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.removeTracksFromPlaylistByPosition(
      '5ieJqeLJjjI8iJWaxeBLuK',
      [0, 2],
      '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9',
      function(err, data) {
        if (err) {
          done(err);
        } else {
          done();
        }
      }
    );
  });
  
  test('should remove tracks from a playlist by uri', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(method).toBe(superagent.del);
      expect(options.query).toBeFalsy();

      var body = JSON.parse(options.data);
      expect(body.tracks[0]).toStrictEqual({ uri : 'spotify:track:491rM2JN8KvmV6p0oDDuJT', positions : [3]});
      expect(body['snapshot_id']).toBe(
        '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      );
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.headers['Authorization']).toBe('Bearer long-access-token');
      
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.removeTracksFromPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      [ { uri: 'spotify:track:491rM2JN8KvmV6p0oDDuJT', positions: [3] }],
      { 'snapshot_id' : '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9' },
      function(err, data) {
        done(err);
      }
    );
  });

  test('should replace tracks from a playlist', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(method).toBe(superagent.put);
      expect(options.query).toBeFalsy();

      var body = JSON.parse(options.data);
      expect(body.uris[0]).toStrictEqual('spotify:track:491rM2JN8KvmV6p0oDDuJT');
      expect(body.uris[1]).toStrictEqual('spotify:track:5erahPIwlq1PvuYRGtVIuG');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.headers['Authorization']).toBe('Bearer long-access-token');
      
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.replaceTracksInPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      ['spotify:track:491rM2JN8KvmV6p0oDDuJT', 'spotify:track:5erahPIwlq1PvuYRGtVIuG'],
      function(err, data) {
        done(err);
      }
    );
  });

  test('should reorder tracks from a playlist by position', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(options.query).toBeFalsy();
      expect(JSON.parse(options.data)['range_start']).toBe(5);
      expect(JSON.parse(options.data)['range_length']).toBe(1);
      expect(JSON.parse(options.data)['insert_before']).toBe(1512);
      expect(JSON.parse(options.data)['snapshot_id']).toBe(
        '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      );
      expect(options.headers.Authorization).toBe('Bearer long-access-token');
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    var options = {
      snapshot_id:
        '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9',
      range_length: 1
    };

    api.reorderTracksInPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      5,
      1512,
      options,
      function(err, data) {
        if (err) {
          done(err);
        } else {
          done();
        }
      }
    );
  });

  test('should add tracks to the users library', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(JSON.parse(options.data)).toEqual({
        ids: ['3VNWq8rTnQG6fM1eldSpZ0']
      });
      expect(uri).toBe('https://api.spotify.com/v1/me/tracks');
      expect(options.query).toBeFalsy();
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0']).then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should add tracks to the users library using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(JSON.parse(options.data)).toEqual({
        ids: ['3VNWq8rTnQG6fM1eldSpZ0']
      });
      expect(uri).toBe('https://api.spotify.com/v1/me/tracks');
      expect(options.query).toBeFalsy();
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      expect(options.headers['Content-Type']).toBe('application/json');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0'], function(err, data) {
      done();
    });
  });

  test('should get new releases', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/browse/new-releases');
      expect(options.query).toEqual({
        limit: 5,
        offset: 0,
        country: 'SE'
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          albums: {
            href:
              'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
            items: [{}, {}, {}, {}, {}]
          }
        }
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .getNewReleases({
        limit: 5,
        offset: 0,
        country: 'SE'
      })
      .then(
        function(data) {
          expect(data.body.albums.href).toBe(
            'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5'
          );
          expect(data.body.albums.items.length).toBe(5);
          done();
        },
        function(err) {
          done(err);
        }
      );
  });

  test('should get new releases', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/browse/new-releases');
      expect(options.query).toEqual({
        limit: 5,
        offset: 0,
        country: 'SE'
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          albums: {
            href:
              'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
            items: [{}, {}, {}, {}, {}]
          }
        },
        statusCode: 200
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getNewReleases(
      {
        limit: 5,
        offset: 0,
        country: 'SE'
      },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.albums.href).toBe(
          'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5'
        );
        expect(data.body.albums.items.length).toBe(5);
        expect(data.statusCode).toBe(200);
        done();
      }
    );
  });

  test('should get featured playlists', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/browse/featured-playlists');
      expect(options.query).toEqual({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          playlists: {
            href:
              'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
            items: [{}, {}, {}]
          }
        },
        statusCode: 200
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .getFeaturedPlaylists({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      })
      .then(
        function(data) {
          expect(data.body.playlists.href).toBe(
            'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3'
          );
          expect(data.body.playlists.items.length).toBe(3);
          expect(data.statusCode).toBe(200);
          done();
        },
        function(err) {
          console.log(err);
          done(err);
        }
      );
  });

  test('should get featured playlists using callback', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/browse/featured-playlists');
      expect(options.query).toEqual({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          playlists: {
            href:
              'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
            items: [{}, {}, {}]
          }
        },
        statusCode: 200
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getFeaturedPlaylists(
      {
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.playlists.href).toBe(
          'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3'
        );
        expect(data.body.playlists.items.length).toBe(3);
        expect(data.statusCode).toBe(200);
        done();
      }
    );
  });

  test('should get browse categories', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/browse/categories');
      expect(options.query).toEqual({
        limit: 2,
        offset: 4,
        country: 'SE',
        locale: 'sv_SE'
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          items: [
            { href: 'https://api.spotify.com/v1/browse/categories/party' },
            { href: 'https://api.spotify.com/v1/browse/categories/pop' }
          ]
        },
        statusCode: 200
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getCategories(
      {
        limit: 2,
        offset: 4,
        country: 'SE',
        locale: 'sv_SE'
      },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.items[0].href).toBe(
          'https://api.spotify.com/v1/browse/categories/party'
        );
        expect(data.body.items[1].href).toBe(
          'https://api.spotify.com/v1/browse/categories/pop'
        );
        expect(data.body.items.length).toBe(2);
        expect(data.statusCode).toBe(200);
        done();
      }
    );
  });

  test('should get a browse category', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/browse/categories/party');
      expect(options.query).toEqual({
        country: 'SE',
        locale: 'sv_SE'
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          href: 'https://api.spotify.com/v1/browse/categories/party',
          name: 'Party'
        },
        statusCode: 200
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getCategory(
      'party',
      {
        country: 'SE',
        locale: 'sv_SE'
      },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.href).toBe(
          'https://api.spotify.com/v1/browse/categories/party'
        );
        expect(data.body.name).toBe('Party');
        expect(data.statusCode).toBe(200);
        done();
      }
    );
  });

  test('should get a playlists for a browse category', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/browse/categories/party/playlists'
      );
      expect(options.query).toEqual({
        country: 'SE',
        limit: 2,
        offset: 1
      });
      expect(options.headers.Authorization).toBe('Bearer myAccessToken');
      callback(null, {
        body: {
          playlists: {
            items: [
              {
                href:
                  'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4k7EZPI3uKMz4aRRrLVfen'
              },
              {
                href:
                  'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4HZh0C9y80GzHDbHZyX770'
              }
            ]
          }
        },
        statusCode: 200
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getPlaylistsForCategory(
      'party',
      {
        country: 'SE',
        limit: 2,
        offset: 1
      },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.playlists.items[0].href).toBe(
          'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4k7EZPI3uKMz4aRRrLVfen'
        );
        expect(data.body.playlists.items[1].href).toBe(
          'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4HZh0C9y80GzHDbHZyX770'
        );
        expect(data.body.playlists.items.length).toBe(2);
        expect(data.statusCode).toBe(200);
        done();
      }
    );
  });

  test('should get the audio analysis for a track', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/audio-analysis/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.query).toBeFalsy();
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getAudioAnalysisForTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should get the audio features for a track', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/audio-features/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.query).toBeFalsy();
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          danceability: 20,
          energy: 0
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        expect(data.body.danceability).toBe(20);
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should get the audio features for a several tracks', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/audio-features');
      expect(options.query).toEqual({
        ids: '3Qm86XLflmIXVm1wcwkgDK,1lDWb6b6ieDQ2xT7ewTC3G'
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          audio_features: []
        }
      });
    });

    var api = new SpotifyWebApi();

    api
      .getAudioFeaturesForTracks([
        '3Qm86XLflmIXVm1wcwkgDK',
        '1lDWb6b6ieDQ2xT7ewTC3G'
      ])
      .then(
        function(data) {
          expect(data.body.audio_features).toBeTruthy();
          done();
        },
        function(err) {
          done(err);
        }
      );
  });

  test('should get recommendations', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/recommendations');
      expect(options.query).toEqual({
        min_energy: 0.4,
        market: 'ES',
        seed_artists: '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ',
        limit: 5,
        min_popularity: 50
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          tracks: [{}],
          seeds: [{}]
        }
      });
    });

    var api = new SpotifyWebApi();

    api
      .getRecommendations({
        min_energy: 0.4,
        market: 'ES',
        seed_artists: '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ',
        limit: 5,
        min_popularity: 50
      })
      .then(
        function(data) {
          expect(data.body.tracks).toBeTruthy();
          done();
        },
        function(err) {
          done(err);
        }
      );
  });

  test('should get recommendations using an array of seeds', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe('https://api.spotify.com/v1/recommendations');
      expect(options.query).toEqual({
        min_energy: 0.4,
        market: 'ES',
        seed_artists: '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ',
        limit: 5,
        min_popularity: 50
      });
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          tracks: [{}],
          seeds: [{}]
        }
      });
    });

    var api = new SpotifyWebApi();

    api
      .getRecommendations({
        min_energy: 0.4,
        market: 'ES',
        seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
        limit: 5,
        min_popularity: 50
      })
      .then(
        function(data) {
          expect(data.body.tracks).toBeTruthy();
          done();
        },
        function(err) {
          done(err);
        }
      );
  });

  test('should get available genre seeds', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds'
      );
      expect(options.query).toBeFalsy();
      expect(options.data).toBeFalsy();
      callback(null, {
        body: {
          genres: []
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getAvailableGenreSeeds().then(
      function(data) {
        expect(data.body.genres).toBeTruthy();
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /**
   * Shows
   */

  /* Get a Show */
  test('should get a show', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/shows/123'
      );
      expect(options.query.market).toBe('SE');

      callback(null, {
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.getShow('123', { market: 'SE' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Look up several shows */
  test('should get several shows', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/shows'
      );
      expect(options.query.market).toBe('SE');
      expect(options.query.ids).toBe('1,2,3');
      callback(null, {
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.getShows(['1', '2', '3'], { market: 'SE' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Check if one or more shows is already saved in the current Spotify user’s “Your Music” library. */
  test('should see that show is already saved by user', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/me/shows/contains'
      );
      expect(options.query.ids).toBe('1,2,3');
      callback(null, {
        body: [ true, false, false ],
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.containsMySavedShows(['1', '2', '3']).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Remove from user\'s saved shows. */
  test('should remove from user\'s saved shows', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.del);
      expect(uri).toBe(
        'https://api.spotify.com/v1/me/shows'
      );
      expect(JSON.parse(options.data)).toStrictEqual(["1","2","3"]);
      expect(options.query).toBeFalsy();
      expect(options.headers.Authorization).toEqual('Bearer longtoken');
      expect(options.headers['Content-Type']).toEqual('application/json');
      callback(null, {})
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('longtoken');

    api.removeFromMySavedShows(['1', '2', '3']).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

   /* Add to user\'s saved shows. */
   test('should remove from user\'s saved shows', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.put);
      expect(uri).toBe(
        'https://api.spotify.com/v1/me/shows'
      );
      expect(JSON.parse(options.data)).toStrictEqual(["1","2","3"]);
      expect(options.query).toBeFalsy();
      expect(options.headers.Authorization).toEqual('Bearer longtoken');
      expect(options.headers['Content-Type']).toEqual('application/json');
      callback(null, {})
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('longtoken');

    api.addToMySavedShows(['1', '2', '3']).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

   /* Get user\'s saved shows. */
   test('should remove from user\'s saved shows', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/me/shows'
      );
      expect(options.data).toBeFalsy();
      expect(options.query.limit).toBe(1);
      expect(options.query.offset).toBe(2);
      expect(options.query.market).toBe('DK');
      expect(options.headers.Authorization).toEqual('Bearer longtoken');
      expect(options.headers['Content-Type']).toBeFalsy();
      callback(null, {})
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('longtoken');

    api.getMySavedShows({ market: 'DK', limit: 1, offset: 2}).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });


  /* Get the episodes of an show. */
  test('should retrieve the episodes of a show', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/shows/123/episodes'
      );
      expect(options.query.market).toBe('SE');
      expect(options.query.limit).toBe(1);
      expect(options.query.offset).toBe(2);
      callback(null, {
        body: {},
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.getShowEpisodes('123', { 'market' : 'SE', 'limit' : 1, 'offset': 2}).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Search for a show. */
  test('should search for a show', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/search/'
      );
      expect(options.query.q).toBe('kvartal');
      expect(options.query.type).toBe('show');
      expect(options.query.market).toBe('SE');
      expect(options.query.limit).toBe(3);
      expect(options.query.offset).toBe(1);
      callback(null, {
        body: {},
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.searchShows('kvartal', { 'market' : 'SE', 'limit' : 3, 'offset': 1}).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Search for an episode. */
  test('should search for an episode', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/search/'
      );
      expect(options.query.q).toBe('hanif bali');
      expect(options.query.type).toBe('episode');
      expect(options.query.market).toBe('UK');
      expect(options.query.limit).toBe(10);
      expect(options.query.offset).toBe(11);
      callback(null, {
        body: {},
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.searchEpisodes('hanif bali', { 'market' : 'UK', 'limit' : 10, 'offset': 11}).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Look up an episode. */
  test('should look up an episode', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/episodes/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(options.query.market).toBe('NO');
      callback(null, {
        body: {},
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.getEpisode('3Qm86XLflmIXVm1wcwkgDK', { 'market' : 'NO' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

   /* Look up several episodes */
   test('should get several episodes', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.get);
      expect(uri).toBe(
        'https://api.spotify.com/v1/episodes'
      );
      expect(options.query.market).toBe('DK');
      expect(options.query.ids).toBe('3Qm86XLflmIXVm1wcwkgDK,66m86XLflmIXVm1wcwkg66');
      callback(null, {
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();

    api.getEpisodes(['3Qm86XLflmIXVm1wcwkgDK', '66m86XLflmIXVm1wcwkg66'], { market: 'DK' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /**
   * Authentication/Authorization
   */
  
  test('should ignore entire show_dialog param if it is not included', () => {
    var scopes = ['user-read-private', 'user-read-email'],
      redirectUri = 'https://example.com/callback',
      clientId = '5fe01282e44241328a84e7c5cc169165',
      state = 'some-state-of-my-choice';

    var api = new SpotifyWebApi({
      clientId: clientId,
      redirectUri: redirectUri
    });

    var authorizeURL = api.createAuthorizeURL(scopes, state);
    expect(authorizeURL).toBe(
      'https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice'
    );
  });

  test('should create authorization URL with code based authentication', () => {
    var scopes = ['user-read-private', 'user-read-email'],
      redirectUri = 'https://example.com/callback',
      clientId = '5fe01282e44241328a84e7c5cc169165',
      state = 'some-state-of-my-choice',
      showDialog = true;

    var api = new SpotifyWebApi({
      clientId: clientId,
      redirectUri: redirectUri
    });

    var authorizeURL = api.createAuthorizeURL(scopes, state, showDialog);
    expect(authorizeURL).toBe(
      'https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true'
    );
  });
  
  test('should create authorization URL with token based authentication', () => {
    var scopes = ['user-read-private', 'user-read-email'],
      redirectUri = 'https://example.com/callback',
      clientId = '5fe01282e44241328a84e7c5cc169165',
      state = 'some-state-of-my-choice',
      showDialog = true,
      responseType = 'token'

    var api = new SpotifyWebApi({
      clientId: clientId,
      redirectUri: redirectUri
    });

    var authorizeURL = api.createAuthorizeURL(scopes, state, showDialog, responseType);

    expect(authorizeURL).toBe(
      'https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=token&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true'
    );
  });
  
  /* Client credentials */
  test('should retrieve an access token using the client credentials flow', function(done) {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://accounts.spotify.com/api/token'
      );
      expect(options.data.grant_type).toBe('client_credentials');
      expect(options.headers).toStrictEqual({ 
        Authorization: "Basic c29tZUNsaWVudElkOnNvbWVDbGllbnRTZWNyZXQ=",
        'Content-Type' : 'application/x-www-form-urlencoded'
      });
      callback(null, {
        statusCode: 200
      })
    });

    var clientId = 'someClientId',
        clientSecret = 'someClientSecret';

    var api = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret
    });

    api.clientCredentialsGrant().then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve an access token using the authorization code flow', function(done) {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://accounts.spotify.com/api/token'
      );
      expect(options.data.grant_type).toBe('authorization_code');
      expect(options.data.redirect_uri).toBe('http://www.michaelthelin.se/test-callback');
      expect(options.data.code).toBe('mySuperLongCode');
      expect(options.data.client_id).toBe('someClientId');
      expect(options.data.client_secret).toBe('someClientSecret');
      expect(options.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      callback(null, {
        statusCode: 200
      })
    });

    var credentials = {
      clientId: 'someClientId',
      clientSecret: 'someClientSecret',
      redirectUri: 'http://www.michaelthelin.se/test-callback'
    };

    var api = new SpotifyWebApi(credentials);

    api.authorizationCodeGrant('mySuperLongCode').then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should refresh token', function(done) {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe(
        'https://accounts.spotify.com/api/token'
      );
      expect(options.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      expect(options.data.grant_type).toBe('refresh_token');
      expect(options.data.refresh_token).toBe('myRefreshToken');
      callback(null, {
        statusCode: 200
      })
    });

    var api = new SpotifyWebApi();
    api.setRefreshToken('myRefreshToken');

    api.refreshAccessToken().then(
      function(data) {
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should refresh an access token', done => {
    sinon.stub(HttpManager, '_makeRequest').callsFake(function(
      method,
      options,
      uri,
      callback
    ) {
      expect(method).toBe(superagent.post);
      expect(uri).toBe('https://accounts.spotify.com/api/token');
      expect(options.data).toEqual({
        grant_type: 'refresh_token',
        refresh_token: 'someLongRefreshToken'
      });
      expect(options.query).toBeFalsy();
      expect(options.headers).toEqual({
        Authorization: 'Basic c29tZUNsaWVudElkOnNvbWVDbGllbnRTZWNyZXQ=',
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      callback(null, {
        body: {
          access_token: 'NgCXRK...MzYjw',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'NgAagA...Um_SHo'
        },
        statusCode: 200
      });
    });

    var clientId = 'someClientId';
    var clientSecret = 'someClientSecret';
    var refreshToken = 'someLongRefreshToken';

    var api = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken
    });
    api.refreshAccessToken().then(function(data) {
      done();
    });
  });

  test('should set, get and reset credentials', function(done) {
    var api = new SpotifyWebApi();

    expect(api.getAccessToken()).toBeFalsy();
    expect(api.getRefreshToken()).toBeFalsy();
    expect(api.getRedirectURI()).toBeFalsy();
    expect(api.getClientId()).toBeFalsy();
    expect(api.getClientSecret()).toBeFalsy();

    api.setCredentials({
      accessToken : 'my-access-token',
      refreshToken : 'my-refresh-token',
      redirectUri : 'my-redirect-uri',
      clientSecret : 'my-client-secret',
      clientId : 'my-client-id'
    });

    expect(api.getAccessToken()).toBe('my-access-token');
    expect(api.getRefreshToken()).toBe('my-refresh-token');
    expect(api.getRedirectURI()).toBe('my-redirect-uri');
    expect(api.getClientSecret()).toBe('my-client-secret');
    expect(api.getClientId()).toBe('my-client-id');

    api.resetAccessToken();

    expect(api.getAccessToken()).toBeFalsy();
    expect(api.getRefreshToken()).toBe('my-refresh-token');

    api.resetRefreshToken();
    api.resetRedirectURI();

    expect(api.getRefreshToken()).toBeFalsy();
    expect(api.getRedirectURI()).toBeFalsy();

    api.setRedirectURI('my-redirect-uri');
    expect(api.getRedirectURI()).toBe('my-redirect-uri');

    api.resetClientId();
    expect(api.getClientId()).toBeFalsy();

    api.setClientId('woopwoop');
    expect(api.getClientId()).toBe('woopwoop');

    api.resetClientSecret();
    expect(api.getClientSecret()).toBeFalsy();

    api.setClientSecret('aNewClientSecret');
    expect(api.getClientSecret()).toBe('aNewClientSecret');

    api.resetCredentials();
    expect(api.getRedirectURI()).toBeFalsy();

    done();
  });

});
