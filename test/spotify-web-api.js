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

  it("should retrieve an access token using the client credentials flow", function(done) {
    var clientId = 'someClientId',
        clientSecret = 'someClientSecret';

    var api = new SpotifyWebApi();
    api.clientCredentialsGrant(clientId, clientSecret)
      .then(function(data) {
        'Bearer'.should.equal(data['token-type']);
        (3600).should.equal(data['expires-in']);
        should.exist(data['access-token']);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve an access token using the authorization code flow", function(done) {
    var clientId = 'someClientId',
        clientSecret = 'someClientSecret',
        code = "someReallyLongCode",
        redirectUri = "http://such.host.wow/much-callback";

    var api = new SpotifyWebApi();
    api.authorizationCodeGrant(clientId, clientSecret, code, redirectUri)
      .then(function(data) {
        'Bearer'.should.equal(data['token-type']);
        (3600).should.equal(data['expires-in']);
        should.exist(data['access-token']);
        should.exist(data['refresh-token']);
        done();
      }, function(err) {
        done(err);
      });
  });

});