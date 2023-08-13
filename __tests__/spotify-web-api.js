'use strict';

var SpotifyWebApi = require('../src/server');

describe('Spotify Web API', () => {
  beforeEach(done => {
    fetch.resetMocks();
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
    fetch.mockResponse(async () => ({
      body: JSON.stringify({ uri: 'spotify:track:3Qm86XLflmIXVm1wcwkgDK' }),
      headers: { 'cache-control': 'public, max-age=7200' },
      status: 200
    }));

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        expect(data.body.uri).toBe('spotify:track:3Qm86XLflmIXVm1wcwkgDK');
        expect(data.statusCode).toBe(200);
        expect(data.headers.get('cache-control')).toBe('public, max-age=7200');
        done();
      },
      function(err) {
        done(new Error('Test failed!'));
      }
    );
  });

  test('should retrieve track metadata', done => {
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(req.method).toBe('GET');

      return {
        status: 200,
        body: JSON.stringify({ uri: 'spotify:track:3Qm86XLflmIXVm1wcwkgDK' }),
        headers: {
          'content-type': 'application/json'
        }
      };
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('error response should contain body, headers and status code', done => {
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(req.method).toBe('GET');

      return {
        status: 400,
        body: JSON.stringify({
          error: {
            message: 'Do NOT do that again!',
            status: 400
          }
        }),
        headers: {
          'content-type': 'application/json'
        }
      };
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK').then(
      function(data) {
        done(new Error('Test failed!'));
      },
      function(err) {
        expect(err.body.error.message).toBe('Do NOT do that again!');
        expect(err.body.error.status).toBe(400);
        expect(err.headers.get('Content-Type')).toBe('application/json');
        expect(err.statusCode).toBe(400);
        done();
      }
    );
  });

  test('should get track for Swedish market', done => {
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK?market=SE'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ uri: 'spotify:track:3Qm86XLflmIXVm1wcwkgDK' })
      };
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK', { market: 'SE' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve track metadata using callback', done => {
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ uri: 'spotify:track:3Qm86XLflmIXVm1wcwkgDK' })
      };
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK', {}, function(err, data) {
      expect(err).toBeFalsy();
      done(err);
    });
  });

  test('should retrieve metadata for several tracks', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/tracks');
      expect(url.searchParams.get('ids')).toBe(
        '0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([
          { uri: 'spotify:track:0eGsygTp906u18L0Oimnem' },
          { uri: 'spotify:track:1lDWb6b6ieDQ2xT7ewTC3G' }
        ])
      };
    });

    var api = new SpotifyWebApi();
    api.getTracks(['0eGsygTp906u18L0Oimnem', '1lDWb6b6ieDQ2xT7ewTC3G']).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve metadata for an album', done => {
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj'
        })
      };
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve metadata for an album for a market ', done => {
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj?market=SE'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj'
        })
      };
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj', {}, function(err, data) {
      done(err);
    });
  });

  test('should retrieve metadata for several albums', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/albums');
      expect(url.searchParams.get('ids')).toBe(
        '41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          albums: [
            { uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ' },
            { uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4' }
          ]
        })
      };
    });

    var api = new SpotifyWebApi();
    api.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4']).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should retrieve metadata for several albums using callback', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/albums');
      expect(url.searchParams.get('ids')).toBe(
        '41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          albums: [
            { uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ' },
            { uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4' }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV' })
      };
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
    fetch.mockResponse(async req => {
      expect(req.url).toBe(
        'https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV' })
      };
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV', function(err, data) {
      expect(err).toBeFalsy();
      done();
    });
  });

  test('should retrieve metadata for several artists', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/artists');
      expect(url.searchParams.get('ids')).toBe(
        '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          artists: [
            { uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy' },
            { uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin' }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/artists');
      expect(url.searchParams.get('ids')).toBe(
        '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'
      );
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          artists: [
            { uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy' },
            { uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin' }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('The Best of Keane');
      expect(url.searchParams.get('type')).toBe('album');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('2');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          albums: {
            href:
              'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
          }
        })
      };
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit: 3, offset: 2 }).then(
      function(data) {
        expect(data.body.albums.href).toBe(
          'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
        );
        expect(data.statusCode).toBe(200);
        expect(data.headers.get('test')).toBe('value');
        done();
      },
      function(err) {
        console.log(err);
        done(err);
      }
    );
  });

  test('should search for an album using limit and offset using callback', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('The Best of Keane');
      expect(url.searchParams.get('type')).toBe('album');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('2');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          albums: {
            href:
              'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
          }
        })
      };
    });

    var api = new SpotifyWebApi();
    api.searchAlbums(
      'The Best of Keane',
      { limit: 3, offset: 2 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.albums.href).toBe(
          'https://api.spotify.com/v1/search?q=The+Best+of+Keane&offset=2&limit=3&type=album'
        );
        done();
      }
    );
  });

  test('should search for playlists', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('workout');
      expect(url.searchParams.get('type')).toBe('playlist');
      expect(url.searchParams.get('limit')).toBe('1');
      expect(url.searchParams.get('offset')).toBe('0');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          playlists: {
            href:
              'https://api.spotify.com/v1/search?q=workout&offset=0&limit=1&type=playlist'
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('David Bowie');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          artists: {
            href:
              'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('David Bowie');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          artists: {
            href:
              'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
          }
        })
      };
    });

    var api = new SpotifyWebApi();
    api.searchArtists(
      'David Bowie',
      { limit: 5, offset: 1 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.artists.href).toBe(
          'https://api.spotify.com/v1/search?q=David+Bowie&offset=1&limit=5&type=artist'
        );
        done();
      }
    );
  });

  test('should search for a track using limit and offset', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('Mr. Brightside');
      expect(url.searchParams.get('type')).toBe('track');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('2');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          tracks: {
            href:
              'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('Mr. Brightside');
      expect(url.searchParams.get('type')).toBe('track');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('2');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          tracks: {
            href:
              'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
          }
        })
      };
    });

    var api = new SpotifyWebApi();
    api.searchTracks(
      'Mr. Brightside',
      { limit: 3, offset: 2 },
      function(err, data) {
        expect(err).toBeFalsy();
        expect(data.body.tracks.href).toBe(
          'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track'
        );
        done();
      }
    );
  });

  test('should search for several types using callback', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('Mr. Brightside');
      expect(url.searchParams.get('type')).toBe('track,album');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('2');
      expect(req.method).toBe('GET');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json',
          test: 'value'
        },
        body: JSON.stringify({
          tracks: {
            href:
              'https://api.spotify.com/v1/search?q=Mr.+Brightside&offset=2&limit=3&type=track,album'
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums');
      expect(url.searchParams.get('album_type')).toBe('album');
      expect(url.searchParams.get('country')).toBe('GB');
      expect(url.searchParams.get('limit')).toBe('2');
      expect(url.searchParams.get('offset')).toBe('5');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href:
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums');
      expect(url.searchParams.get('album_type')).toBe('album');
      expect(url.searchParams.get('country')).toBe('GB');
      expect(url.searchParams.get('limit')).toBe('2');
      expect(url.searchParams.get('offset')).toBe('5');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href:
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks');
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href:
            'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks');
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href:
            'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe(
        '/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks'
      );
      expect(url.searchParams.get('country')).toBe('GB');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href:
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks?country=GB'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe(
        '/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks'
      );
      expect(url.searchParams.get('country')).toBe('GB');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href:
            'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks?country=GB'
        })
      };
    });

    var api = new SpotifyWebApi();

    api.getArtistTopTracks(
      '0oSGxfWSnnOXhD2fKuz2Gy',
      'GB',
      function(err, data) {
        expect(err).toBeFalsy();
        done();
      }
    );
  });

  test('should get similar artists', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists'
      );
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          artists: [{}]
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists'
      );
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          artists: [{}]
        })
      };
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy', function(err, data) {
      expect(data.body.artists).toBeTruthy();
      done();
    });
  });

  test('should get a user', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://api.spotify.com/v1/users/petteralexis');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:user:petteralexis'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://api.spotify.com/v1/users/%23matze23');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:user:%23matze23'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://api.spotify.com/v1/users/petteralexis');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:user:petteralexis'
        })
      };
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis', function(err, data) {
      expect('spotify:user:petteralexis').toBe(data.body.uri);
      done();
    });
  });

  test("should get the authenticated user's information", done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://api.spotify.com/v1/me');
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:user:thelinmichael'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://api.spotify.com/v1/me');
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:user:thelinmichael'
        })
      };
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('someAccessToken');

    api.getMe().then(function(data) {
      expect('spotify:user:thelinmichael').toBe(data.body.uri);
      done();
    });
  });

  test('should get a users playlists', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/users/thelinmichael/playlists'
      );
      expect(req.headers.get('authorization')).toBe(
        'Bearer myVeryLongAccessToken'
      );
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'
            },
            {
              uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK'
            }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://api.spotify.com/v1/me/playlists');
      expect(req.headers.get('authorization')).toBe(
        'Bearer myVeryLongAccessToken'
      );
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'
            },
            {
              uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK'
            }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/playlists');
      expect(url.searchParams.get('limit')).toBe('27');
      expect(url.searchParams.get('offset')).toBe('7');
      expect(req.headers.get('authorization')).toBe(
        'Bearer myVeryLongAccessToken'
      );
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'
            },
            {
              uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK'
            }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK'
      );
      expect(req.headers.get('authorization')).toBe(
        'Bearer myVeryVeryLongAccessToken'
      );
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          uri: 'spotify:playlist:5ieJqeLJjjI8iJWaxeBLuK'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://api.spotify.com/v1/me/playlists');
      expect(req.headers.get('authorization')).toBe('Bearer long-access-token');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body).name).toBe('My Cool Playlist');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: 'My Cool Playlist'
        })
      };
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.createPlaylist('My Cool Playlist').then(
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://api.spotify.com/v1/me/playlists');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        name: 'My Cool Playlist',
        description: "It's really cool",
        public: false
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: 'My Cool Playlist',
          description: "It's really cool",
          public: false
        })
      };
    });

    var api = new SpotifyWebApi();

    api.createPlaylist(
      'My Cool Playlist',
      { description: "It's really cool", public: false },
      function(err, data) {
        done(err);
      }
    );
  });

  test('should change playlist details', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK'
      );
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        name:
          'This is a new name for my Cool Playlist, and will become private',
        public: false
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name:
            'This is a new name for my Cool Playlist, and will become private',
          public: false
        })
      };
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api
      .changePlaylistDetails('5ieJqeLJjjI8iJWaxeBLuK', {
        name:
          'This is a new name for my Cool Playlist, and will become private',
        public: false
      })
      .then(function(data) {
        expect(data.statusCode).toBe(200);
        done();
      });
  });

  test('should add tracks to playlist', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        uris: [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M'
        ]
      });

      return {
        status: 201,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'aSnapshotId'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('POST');
      expect(url.pathname).toBe('/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        uris: [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M'
        ]
      });
      expect(url.searchParams.get('position')).toEqual('10');

      return {
        status: 201,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'aSnapshotId'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/playlists/3iV5W9uYEdYUVa79Axb7Rh/tracks');
      expect(url.searchParams.get('limit')).toEqual('5');
      expect(url.searchParams.get('offset')).toEqual('1');
      expect(url.searchParams.get('market')).toEqual('SE');
      expect(url.searchParams.get('additional_types')).toEqual('episode');
      expect(url.searchParams.get('fields')).toEqual('total');
      expect(req.body).toBeFalsy();

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
    });

    var api = new SpotifyWebApi();

    api
      .getPlaylistTracks('3iV5W9uYEdYUVa79Axb7Rh', {
        limit: 5,
        offset: 1,
        market: 'SE',
        additional_types: 'episode',
        fields: 'total'
      })
      .then(function(data) {
        done();
      });
  });

  /* Upload a Custom Playlist Cover Image */
  test('should upload custom playlist cover image', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/playlists/3iV5W9uYEdYUVa79Axb7Rh/images');
      expect(req.headers.get('content-type')).toBe('image/jpeg');
      expect(String(req.body)).toContain('longbase64uri');

      return {
        status: 202,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
    });

    var api = new SpotifyWebApi();

    api
      .uploadCustomPlaylistCoverImage('3iV5W9uYEdYUVa79Axb7Rh', 'longbase64uri')
      .then(function(data) {
        done();
      });
  });

  test("should get user's top artists", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/top/artists');
      expect(url.searchParams.get('limit')).toEqual('5');
      expect(req.body).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: []
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/top/tracks');
      expect(url.searchParams.get('limit')).toEqual('5');
      expect(req.body).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: []
        })
      };
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyTopTracks({ limit: 5 }).then(function(data) {
      expect(data.body.items).toBeTruthy();
      done();
    });
  });

  test("should get user's currently playing track", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/player/currently-playing');
      expect(url.searchParams.get('market')).toEqual('NO');
      expect(req.body).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyCurrentPlayingTrack({ market: 'NO' }).then(function(data, err) {
      done(err);
    });
  });

  test("should get user's recently played tracks:", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/player/recently-played');
      expect(url.searchParams.get('limit')).toEqual('5');
      expect(req.body).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: []
        })
      };
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyRecentlyPlayedTracks({ limit: 5 }).then(function(data) {
      expect(data.body.items).toBeTruthy();
      done();
    });
  });

  test("should add songs to the user's queue", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('POST');
      expect(url.pathname).toBe('/v1/me/player/queue');
      expect(url.searchParams.get('uri')).toEqual(
        'spotify:track:2jpDioAB9tlYXMdXDK3BGl'
      );
      expect(req.body).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 204
      };
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api
      .addToQueue('spotify:track:2jpDioAB9tlYXMdXDK3BGl')
      .then((data, err) => done(err));
  });

  test("should get user's devices", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/player/devices');
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          devices: []
        })
      };
    });

    var api = new SpotifyWebApi({
      accessToken: 'someAccessToken'
    });

    api.getMyDevices().then(function(data) {
      expect(data.body.devices).toBeTruthy();
      done();
    });
  });

  test("should get user's current playback status", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/player');
      expect(url.searchParams.get('market')).toEqual('GB');
      expect(req.headers.get('authorization')).toBe('Bearer someAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          device: {}
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/player');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        device_ids: ['my-device-id'],
        play: true
      });

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/player');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        device_ids: ['my-device-id']
      });

      return {
        status: 204
      };
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.transferMyPlayback(['my-device-id']).then(
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/player/play');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/play');
      expect(url.searchParams.get('device_id')).toBe('my_device_id');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        context_uri: 'my_context',
        offset: {
          position: 5
        }
      });

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/player/pause');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/pause');
      expect(url.searchParams.get('device_id')).toBe('my_device_id');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://api.spotify.com/v1/me/player/next');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test("should skip the user's playback to previous track", done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://api.spotify.com/v1/me/player/previous');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/repeat');
      expect(url.searchParams.get('state')).toBe('off');
      expect(url.searchParams.get('device_id')).toBe('some-device-id');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test("should set the user's playback repeat mode without given device", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/repeat');
      expect(url.searchParams.get('state')).toBe('context');
      expect(url.searchParams.get('device_id')).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/shuffle');
      expect(url.searchParams.get('state')).toBe('true');
      expect(url.searchParams.get('device_id')).toBe('my-device');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.setShuffle(true, { device_id: 'my-device' }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test("should set the user's playback shuffle mode without device id", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/shuffle');
      expect(url.searchParams.get('state')).toBe('false');
      expect(url.searchParams.get('device_id')).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test("should set the user's playback volume without device id", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/volume');
      expect(url.searchParams.get('volume_percent')).toBe('75');
      expect(url.searchParams.get('device_id')).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test("should set the user's playback volume", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/volume');
      expect(url.searchParams.get('volume_percent')).toBe('80');
      expect(url.searchParams.get('device_id')).toBe('my_device_id');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test('should seek', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/seek');
      expect(url.searchParams.get('position_ms')).toBe('2000');
      expect(url.searchParams.get('device_id')).toBeFalsy();
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test('should seek on a certain device', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/player/seek');
      expect(url.searchParams.get('position_ms')).toBe('2000');
      expect(url.searchParams.get('device_id')).toBe('my_device_id');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test('should remove tracks in the users library', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe('https://api.spotify.com/v1/me/tracks');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(JSON.parse(req.body)).toEqual({
        ids: ['3VNWq8rTnQG6fM1eldSpZ0']
      });

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  /* Get My Saved Tracks */
  test("should get tracks in the user' library", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/tracks');
      expect(url.searchParams.get('limit')).toBe('1');
      expect(url.searchParams.get('offset')).toBe('3');
      expect(url.searchParams.get('market')).toBe('SE');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: []
        })
      };
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.getMySavedTracks({ market: 'SE', limit: 1, offset: 3 }).then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  /* Check if Track is in User's Saved Tracks */
  test("should check if track is in user's library", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/tracks/contains');
      expect(url.searchParams.get('ids')).toBe(
        '27cZdqrQiKt3IT00338dws,37cZdqrQiKt3IT00338dzs'
      );
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([false, true])
      };
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .containsMySavedTracks([
        '27cZdqrQiKt3IT00338dws',
        '37cZdqrQiKt3IT00338dzs'
      ])
      .then(
        function(data) {
          done();
        },
        function(err) {
          done(err);
        }
      );
  });

  test('should remove albums in the users library', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe('https://api.spotify.com/v1/me/albums');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(JSON.parse(req.body)).toEqual(['27cZdqrQiKt3IT00338dws']);

      return {
        status: 204
      };
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
        done(err);
      }
    );
  });

  test('should add albums to the users library', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/albums');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual([
        '4iV5W9uYEdYUVa79Axb7Rh',
        '1301WleyT98MSxVHPZCA6M'
      ]);

      return {
        status: 200
      };
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api
      .addToMySavedAlbums(['4iV5W9uYEdYUVa79Axb7Rh', '1301WleyT98MSxVHPZCA6M'])
      .then(
        function(data) {
          done();
        },
        function(err) {
          done(err);
        }
      );
  });

  test('should get albums in the users library', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/albums');
      expect(url.searchParams.get('limit')).toBe('2');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href: 'https://api.spotify.com/v1/me/albums?offset=1&limit=2',
          items: [
            { added_at: '2014-07-08T18:18:33Z', album: { name: 'Album!' } }
          ]
        })
      };
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
          done(err);
        }
      );
  });

  test('should determine if an album is in the users library', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/albums/contains');
      expect(url.searchParams.get('ids')).toBe('27cZdqrQiKt3IT00338dws');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([true])
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/7p9EIC2KW0NNkTEOnTUZJl/followers'
      );
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        public: false
      });

      return {
        status: 200
      };
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
          done(err);
        }
      );
  });

  test('should unfollow a playlist', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/7p9EIC2KW0NNkTEOnTUZJl/followers'
      );
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
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
        done(err);
      }
    );
  });

  test('should follow several users', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('user');
      expect(url.searchParams.get('ids')).toBe('thelinmichael,wizzler');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200
      };
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
        done(err);
      }
    );
  });

  test('should follow several users using callback', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('user');
      expect(url.searchParams.get('ids')).toBe('thelinmichael,wizzler');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('ids')).toBe('137W8MRPWKqSmrBGDBFSop');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('PUT');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('ids')).toBe('137W8MRPWKqSmrBGDBFSop');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('DELETE');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('user');
      expect(url.searchParams.get('ids')).toBe('thelinmichael,wizzler');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
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
        done(err);
      }
    );
  });

  test('should unfollow several users using callback', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('DELETE');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('user');
      expect(url.searchParams.get('ids')).toBe('thelinmichael,wizzler');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken: accessToken
    });

    api.unfollowUsers(['thelinmichael', 'wizzler'], function(err, data) {
      done(err);
    });
  });

  test('should unfollow several artists', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('DELETE');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('ids')).toBe('137W8MRPWKqSmrBGDBFSop');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
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
        done(err);
      }
    );
  });

  test('should unfollow several artists using callback', done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('DELETE');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('ids')).toBe('137W8MRPWKqSmrBGDBFSop');
      expect(req.body).toBeFalsy();

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/following/contains');
      expect(url.searchParams.get('type')).toBe('user');
      expect(url.searchParams.get('ids')).toBe('thelinmichael,wizzler');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([true, false])
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/following/contains');
      expect(url.searchParams.get('type')).toBe('user');
      expect(url.searchParams.get('ids')).toBe('thelinmichael,wizzler');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([true, false])
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/following/contains');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('ids')).toBe('137W8MRPWKqSmrBGDBFSop');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([false])
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/following/contains');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('ids')).toBe('137W8MRPWKqSmrBGDBFSop');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([false])
      };
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

  test("should get a user's followed artists", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('after')).toBe('6tbXwhqy3WAFqanusCLvEU');
      expect(url.searchParams.get('limit')).toBe('3');

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artists: { items: [] } })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/following');
      expect(url.searchParams.get('type')).toBe('artist');
      expect(url.searchParams.get('after')).toBe('6tbXwhqy3WAFqanusCLvEU');
      expect(url.searchParams.get('limit')).toBe('3');

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artists: { items: [] } })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe(
        '/v1/users/spotify_germany/playlists/2nKFnGNFvHX9hG5Kv7Bm3G/followers/contains'
      );
      expect(url.searchParams.get('ids')).toBe('thelinmichael,ella');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([true, false])
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('Authorization')).toBe('Bearer long-access-token');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      const body = JSON.parse(req.body);
      expect(body).toEqual({
        uris: [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M'
        ]
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'abc'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('Authorization')).toBe('Bearer long-access-token');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      const body = JSON.parse(req.body);
      expect(body).toEqual({
        uris: [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M'
        ]
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'abc'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('Authorization')).toBe('Bearer long-access-token');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      const body = JSON.parse(req.body);

      expect(body).toEqual({
        positions: [0, 2],
        snapshot_id:
          '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'abc'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('Authorization')).toBe('Bearer long-access-token');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      const body = JSON.parse(req.body);

      expect(body).toEqual({
        tracks: [
          {
            uri: 'spotify:track:491rM2JN8KvmV6p0oDDuJT',
            positions: [3]
          }
        ],
        snapshot_id:
          '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'abc'
        })
      };
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.removeTracksFromPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      [{ uri: 'spotify:track:491rM2JN8KvmV6p0oDDuJT', positions: [3] }],
      {
        snapshot_id:
          '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      },
      function(err, data) {
        done(err);
      }
    );
  });

  test('should replace tracks from a playlist', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('Content-Type')).toBe('application/json');
      expect(req.headers.get('Authorization')).toBe('Bearer long-access-token');
      const body = JSON.parse(req.body);

      expect(body).toEqual({
        uris: [
          'spotify:track:491rM2JN8KvmV6p0oDDuJT',
          'spotify:track:5erahPIwlq1PvuYRGtVIuG'
        ]
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'abc'
        })
      };
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.replaceTracksInPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      [
        'spotify:track:491rM2JN8KvmV6p0oDDuJT',
        'spotify:track:5erahPIwlq1PvuYRGtVIuG'
      ],
      function(err, data) {
        done(err);
      }
    );
  });

  test('should reorder tracks from a playlist by position', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks'
      );
      expect(req.headers.get('authorization')).toBe('Bearer long-access-token');
      expect(req.headers.get('content-type')).toBe('application/json');
      const body = JSON.parse(req.body);
      expect(body).toEqual({
        range_start: 5,
        range_length: 1,
        insert_before: 1512,
        snapshot_id:
          '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9'
      });

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          snapshot_id: 'abc'
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/tracks');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        ids: ['3VNWq8rTnQG6fM1eldSpZ0']
      });

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/tracks');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');
      expect(req.headers.get('content-type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        ids: ['3VNWq8rTnQG6fM1eldSpZ0']
      });

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/browse/new-releases');
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('offset')).toBe('0');
      expect(url.searchParams.get('country')).toBe('SE');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          albums: {
            href:
              'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
            items: [{}, {}, {}, {}, {}]
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/browse/featured-playlists');
      expect(url.searchParams.get('country')).toBe('SE');
      expect(url.searchParams.get('locale')).toBe('sv_SE');
      expect(url.searchParams.get('timestamp')).toBe('2014-10-23T09:00:00');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          playlists: {
            href:
              'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
            items: [{}, {}, {}]
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/browse/featured-playlists');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(url.searchParams.get('country')).toBe('SE');
      expect(url.searchParams.get('locale')).toBe('sv_SE');
      expect(url.searchParams.get('timestamp')).toBe('2014-10-23T09:00:00');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          playlists: {
            href:
              'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
            items: [{}, {}, {}]
          }
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/browse/categories');
      expect(url.searchParams.get('limit')).toBe('2');
      expect(url.searchParams.get('offset')).toBe('4');
      expect(url.searchParams.get('country')).toBe('SE');
      expect(url.searchParams.get('locale')).toBe('sv_SE');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            { href: 'https://api.spotify.com/v1/browse/categories/party' },
            { href: 'https://api.spotify.com/v1/browse/categories/pop' }
          ]
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/browse/categories/party');
      expect(url.searchParams.get('country')).toBe('SE');
      expect(url.searchParams.get('locale')).toBe('sv_SE');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          href: 'https://api.spotify.com/v1/browse/categories/party',
          name: 'Party'
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/browse/categories/party/playlists');
      expect(url.searchParams.get('country')).toBe('SE');
      expect(url.searchParams.get('limit')).toBe('2');
      expect(url.searchParams.get('offset')).toBe('1');
      expect(req.headers.get('authorization')).toBe('Bearer myAccessToken');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
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
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/audio-analysis/3Qm86XLflmIXVm1wcwkgDK'
      );

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/audio-features/3Qm86XLflmIXVm1wcwkgDK'
      );

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          danceability: 20,
          energy: 0
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/audio-features');
      expect(url.searchParams.get('ids')).toBe(
        '3Qm86XLflmIXVm1wcwkgDK,1lDWb6b6ieDQ2xT7ewTC3G'
      );

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          audio_features: []
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/recommendations');
      expect(url.searchParams.get('min_energy')).toBe('0.4');
      expect(url.searchParams.get('market')).toBe('ES');
      expect(url.searchParams.get('seed_artists')).toBe(
        '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ'
      );
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('min_popularity')).toBe('50');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          tracks: [{}],
          seeds: [{}]
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/recommendations');
      expect(url.searchParams.get('min_energy')).toBe('0.4');
      expect(url.searchParams.get('market')).toBe('ES');
      expect(url.searchParams.get('seed_artists')).toBe(
        '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ'
      );
      expect(url.searchParams.get('limit')).toBe('5');
      expect(url.searchParams.get('min_popularity')).toBe('50');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          tracks: [{}],
          seeds: [{}]
        })
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds'
      );

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          genres: []
        })
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/shows/123');
      expect(url.searchParams.get('market')).toBe('SE');

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/shows');
      expect(url.searchParams.get('ids')).toBe('1,2,3');
      expect(url.searchParams.get('market')).toBe('SE');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([true, false, false])
      };
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/shows/contains');
      expect(url.searchParams.get('ids')).toBe('1,2,3');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([true, false, false])
      };
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
  test("should remove from user's saved shows", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('DELETE');
      expect(url.pathname).toBe('/v1/me/shows');
      expect(url.searchParams.get('ids')).toBe('1,2,3');
      expect(req.headers.get('Authorization')).toEqual('Bearer longtoken');
      expect(req.headers.get('Content-Type')).toEqual('application/json');

      return {
        status: 200
      };
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

  /* Add to user's saved shows. */
  test("should add to user's saved shows", done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('PUT');
      expect(req.url).toBe('https://api.spotify.com/v1/me/shows');
      expect(JSON.parse(req.body)).toEqual(['1', '2', '3']);
      expect(req.headers.get('Authorization')).toEqual('Bearer longtoken');
      expect(req.headers.get('Content-Type')).toEqual('application/json');

      return {
        status: 200
      };
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

  /* Get user's saved shows. */
  test("should remove from user's saved shows", done => {
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/me/shows');
      expect(url.searchParams.get('market')).toBe('DK');
      expect(url.searchParams.get('limit')).toBe('1');
      expect(url.searchParams.get('offset')).toBe('2');
      expect(req.headers.get('Authorization')).toEqual('Bearer longtoken');
      expect(req.headers.get('Content-Type')).toBeFalsy();

      return {
        status: 200
      };
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('longtoken');

    api.getMySavedShows({ market: 'DK', limit: 1, offset: 2 }).then(
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/shows/123/episodes');
      expect(url.searchParams.get('market')).toBe('SE');
      expect(url.searchParams.get('limit')).toBe('1');
      expect(url.searchParams.get('offset')).toBe('2');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
    });

    var api = new SpotifyWebApi();

    api.getShowEpisodes('123', { market: 'SE', limit: 1, offset: 2 }).then(
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('kvartal');
      expect(url.searchParams.get('type')).toBe('show');
      expect(url.searchParams.get('market')).toBe('SE');
      expect(url.searchParams.get('limit')).toBe('3');
      expect(url.searchParams.get('offset')).toBe('1');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
    });

    var api = new SpotifyWebApi();

    api.searchShows('kvartal', { market: 'SE', limit: 3, offset: 1 }).then(
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/search/');
      expect(url.searchParams.get('q')).toBe('hanif bali');
      expect(url.searchParams.get('type')).toBe('episode');
      expect(url.searchParams.get('market')).toBe('UK');
      expect(url.searchParams.get('limit')).toBe('10');
      expect(url.searchParams.get('offset')).toBe('11');

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({})
      };
    });

    var api = new SpotifyWebApi();

    api
      .searchEpisodes('hanif bali', { market: 'UK', limit: 10, offset: 11 })
      .then(
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('GET');
      expect(req.url).toBe(
        'https://api.spotify.com/v1/episodes/3Qm86XLflmIXVm1wcwkgDK?market=NO'
      );

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: '3Qm86XLflmIXVm1wcwkgDK'
        })
      };
    });

    var api = new SpotifyWebApi();

    api.getEpisode('3Qm86XLflmIXVm1wcwkgDK', { market: 'NO' }).then(
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
    fetch.mockResponse(async req => {
      const url = new URL(req.url);
      expect(req.method).toBe('GET');
      expect(url.pathname).toBe('/v1/episodes');
      expect(url.searchParams.get('market')).toBe('DK');
      expect(url.searchParams.get('ids')).toBe(
        '3Qm86XLflmIXVm1wcwkgDK,66m86XLflmIXVm1wcwkg66'
      );

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          episodes: [
            { uri: '3Qm86XLflmIXVm1wcwkgDK' },
            { uri: '66m86XLflmIXVm1wcwkg66' }
          ]
        })
      };
    });

    var api = new SpotifyWebApi();

    api
      .getEpisodes(['3Qm86XLflmIXVm1wcwkgDK', '66m86XLflmIXVm1wcwkg66'], {
        market: 'DK'
      })
      .then(
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
      responseType = 'token';

    var api = new SpotifyWebApi({
      clientId: clientId,
      redirectUri: redirectUri
    });

    var authorizeURL = api.createAuthorizeURL(
      scopes,
      state,
      showDialog,
      responseType
    );

    expect(authorizeURL).toBe(
      'https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=token&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true'
    );
  });

  /* Client credentials */
  test('should retrieve an access token using the client credentials flow', function(done) {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://accounts.spotify.com/api/token');
      expect(req.headers.get('authorization')).toBe(
        'Basic c29tZUNsaWVudElkOnNvbWVDbGllbnRTZWNyZXQ='
      );
      expect(req.headers.get('content-type')).toBe(
        'application/x-www-form-urlencoded'
      );
      expect(req.body.toString()).toBe('grant_type=client_credentials');

      return {
        status: 200
      };
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
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://accounts.spotify.com/api/token');
      expect(req.headers.get('content-type')).toBe(
        'application/x-www-form-urlencoded'
      );
      expect(new URLSearchParams(String(req.body)).toString()).toBe(
        new URLSearchParams({
          grant_type: 'authorization_code',
          redirect_uri: 'http://www.michaelthelin.se/test-callback',
          code: 'mySuperLongCode',
          client_id: 'someClientId',
          client_secret: 'someClientSecret'
        }).toString()
      );

      return {
        status: 200
      };
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
        done(err);
      }
    );
  });

  test('should refresh token', function(done) {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://accounts.spotify.com/api/token');
      expect(req.headers.get('Content-Type')).toBe(
        'application/x-www-form-urlencoded'
      );
      expect(String(req.body)).toEqual(
        'grant_type=refresh_token&refresh_token=myRefreshToken'
      );

      return {
        status: 200
      };
    });

    var api = new SpotifyWebApi();
    api.setRefreshToken('myRefreshToken');

    api.refreshAccessToken().then(
      function(data) {
        done();
      },
      function(err) {
        done(err);
      }
    );
  });

  test('should refresh an access token', done => {
    fetch.mockResponse(async req => {
      expect(req.method).toBe('POST');
      expect(req.url).toBe('https://accounts.spotify.com/api/token');
      expect(req.headers.get('Content-Type')).toBe(
        'application/x-www-form-urlencoded'
      );
      expect(req.headers.get('authorization')).toBe(
        'Basic c29tZUNsaWVudElkOnNvbWVDbGllbnRTZWNyZXQ='
      );
      expect(String(req.body)).toEqual(
        'grant_type=refresh_token&refresh_token=someLongRefreshToken'
      );

      return {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          access_token: 'NgCXRK...MzYjw',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'NgAagA...Um_SHo'
        })
      };
    });

    var clientId = 'someClientId';
    var clientSecret = 'someClientSecret';
    var refreshToken = 'someLongRefreshToken';

    var api = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken
    });
    api.refreshAccessToken().then(function(data, err) {
      done(err);
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
      accessToken: 'my-access-token',
      refreshToken: 'my-refresh-token',
      redirectUri: 'my-redirect-uri',
      clientSecret: 'my-client-secret',
      clientId: 'my-client-id'
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
