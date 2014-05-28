var SpotifyWebApi = require('../src/spotify-web-api'),
    should = require('should'),
    sinon = require('sinon'),
    fs = require('fs');

'use strict';

function loadFixture(fixtureName) {
  var fixture = fs.readFileSync(__dirname + "/fixtures/" + fixtureName + ".json", 'utf8');
  return JSON.parse(fixture);
};

describe('Spotify Web API', function() {
  this.timeout(5000);

  this.fixtures = {
    track: loadFixture('track'),
    tracks: loadFixture('tracks'),
    album: loadFixture('album'),
    albums: loadFixture('albums'),
    artist: loadFixture('artist'),
    artists: loadFixture('artists'),
    'search-album': loadFixture('search-album'),
    'search-artist': loadFixture('search-artist'),
    'search-track-page1': loadFixture('search-track-page1')
  };

  var that = this;
  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("should retrieve track metadata", function(done) {
    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK')
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should fail for non existing track id", function(done) {
    var api = new SpotifyWebApi();
    api.getTrack('idontexist')
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {
        'non existing id'.should.equal(err.error.description);
        done();
      });
  });

  it('should fail for empty track id', function(done) {
    var api = new SpotifyWebApi();
    api.getTrack()
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {;
        done();
      });
  });

  it("should retrieve metadata for several tracks", function(done) {
    var api = new SpotifyWebApi();
    api.getTracks(['0eGsygTp906u18L0Oimnem', '1lDWb6b6ieDQ2xT7ewTC3G'])
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for an album", function(done) {
    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj')
      .then(function(data) {
        ('spotify:album:0sNOF9WDwhWunNAHPD3Baj').should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for several albums", function(done) {
    var api = new SpotifyWebApi();
    api.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4'])
      .then(function(data) {
        'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'.should.equal(data.albums[0].uri);
        'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'.should.equal(data.albums[1].uri);
        done();
      }, function(err) {
        done(err);
      });
  });


  it("should retrive metadata for an artist", function(done) {
    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV')
      .then(function(data) {
        ('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for several artists", function(done) {
    var api = new SpotifyWebApi();
    api.getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin'])
      .then(function(data) {
        'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'.should.equal(data.artists[0].uri);
        'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'.should.equal(data.artists[1].uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should search for an album using limit and offset", function(done) {
    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit : 3, offset : 2 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'.should.equal(data.albums.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should search for an artist using limit and offset", function(done) {
    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit : 5, offset : 1 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'.should.equal(data.artists.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should search for a track using limit and offset", function(done) {
    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit : 3, offset : 2 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'.should.equal(data.tracks.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get artists albums", function(done) {
    var api = new SpotifyWebApi();
    api.getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 })
      .then(function(data) {
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album'.should.equal(data.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get tracks from album", function(done) {
    var api = new SpotifyWebApi();
    api.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
      .then(function(data) {
        'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'.should.equal(data.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get top tracks for artist", function(done) {
    var api = new SpotifyWebApi();
    api.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get a user", function(done) {
    var api = new SpotifyWebApi();
    api.getUser('petteralexis')
      .then(function(data) {
        'spotify:user:petteralexis'.should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip("should get the authenticated user's information", function(done) {
    var api = new SpotifyWebApi();
    api.getMe({ accessToken : 'someAccessToken' })
      .then(function(data) {
        'spotify:user:thelinmichael'.should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip("should get the authenticated user's information with accesstoken set on the api object", function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('someAccessToken');

    api.getMe()
      .then(function(data) {
        'spotify:user:thelinmichael'.should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it('should fail if no token is provided for a request that requires an access token', function(done) {
    var api = new SpotifyWebApi();

    api.getMe()
      .then(function(data) {
        done(new Error('Should have failed!'));
      }, function(err) {
        done();
      });
  });

  it.skip('should get a users playlists', function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryLongAccessToken');

    api.getUserPlaylists('thelinmichael')
      .then(function(data) {
        done();
      },function(err) {
        done(err);
      });
  });

  it.skip('should get a playlist', function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryVeryLongAccessToken');

    api.getUserPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK')
      .then(function(data) {
        'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'.should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip('should create a playlist', function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : true })
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err.error);
        done(err);
      });
  });

  it.skip('should add tracks to playlist', function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err.error);
        done(err);
      });
  });

  it.skip("should retrieve an access token using the client credentials flow", function(done) {
    var clientId = 'someClientId',
        clientSecret = 'someClientSecret';

    var api = new SpotifyWebApi();
    api.clientCredentialsGrant(clientId, clientSecret)
      .then(function(data) {
        console.log(data);
        'Bearer'.should.equal(data['token_type']);
        (3600).should.equal(data['expires_in']);
        should.exist(data['access_token']);
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip("should retrieve an access token using the authorization code flow", function(done) {
    var clientId = 'someClientId',
        clientSecret = 'someClientSecret',
        code = "someReallyLongCode",
        redirectUri = "http://such.host.wow/much-callback";

    var api = new SpotifyWebApi();
    api.authorizationCodeGrant(clientId, clientSecret, code, redirectUri)
      .then(function(data) {
        'Bearer'.should.equal(data['token_type']);
        (3600).should.equal(data['expires_in']);
        should.exist(data['access_token']);
        should.exist(data['refresh_token']);
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip('should refresh an access token', function(done) {
    var clientId = 'someClientId';
    var clientSecret = 'someClientSecret';
    var refreshToken = 'someLongRefreshToken';

    var api = new SpotifyWebApi();
    api.refreshAccessToken(clientId, clientSecret, refreshToken)
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

});