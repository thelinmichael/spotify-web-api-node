var restler = require('restler'),
    HttpManager = require('../src/http-manager'),
    sinon = require('sinon'),
    SpotifyWebApi = require('../src/spotify-web-api'),
    should = require('should');

'use strict';

describe('Spotify Web API', function() {

  beforeEach(function(done){
    done();
  });

  afterEach(function(done){
    if (typeof HttpManager._makeRequest.restore == 'function') {
      HttpManager._makeRequest.restore();
    }
    done();
  });

  this.timeout(5000);

  it('should set clientId, clientSecret and redirectUri', function() {
    var credentials = {
      clientId : 'someClientId',
      clientSecret : 'someClientSecret',
      redirectUri : 'myRedirectUri',
      accessToken :'mySuperNiceAccessToken',
      refreshToken :'iCanEvenSaveMyAccessToken'
    };

    var api = new SpotifyWebApi(credentials);

    api.getCredentials().clientId.should.equal(credentials.clientId);
    api.getCredentials().clientSecret.should.equal(credentials.clientSecret);
    api.getCredentials().redirectUri.should.equal(credentials.redirectUri);
    api.getCredentials().accessToken.should.equal(credentials.accessToken);
    api.getCredentials().refreshToken.should.equal(credentials.refreshToken);
  });

  it("should retrieve track metadata", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK');
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK')
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve track metadata using callback", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK');
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK', function(err, data) {
      should.not.exist(err);
      done(err);
    });
  });

  it("should fail for non existing track id", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      callback(new Error('non existing id'), null);
    });

    var api = new SpotifyWebApi();
    api.getTrack('idontexist')
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {
        'non existing id'.should.equal(err.message);
        done();
      });
  });


  it("should fail for non existing track id using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      callback(new Error('non existing id'), null);
    });

    var api = new SpotifyWebApi();
    api.getTrack('idontexist', function(err, data) {
      should.not.exist(data);
      should.exist(err);
      'non existing id'.should.equal(err.message);
      done();
    });
  });

  it('should fail for empty track id', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      callback(new Error(), null);
    });

    var api = new SpotifyWebApi();
    api.getTrack()
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {
        done();
      });
  });

  it("should retrieve metadata for several tracks", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/tracks');
      options.query.ids.should.equal('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G');
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTracks(['0eGsygTp906u18L0Oimnem', '1lDWb6b6ieDQ2xT7ewTC3G'])
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for several tracks using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/tracks');
      options.query.ids.should.equal('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G');
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTracks(['0eGsygTp906u18L0Oimnem', '1lDWb6b6ieDQ2xT7ewTC3G'], function(err, data) {
      should.not.exist(err);
      done();
    });
  });

  it("should retrieve metadata for an album", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj');
      should.not.exist(options.data);
      callback(null, {uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj'});
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj')
      .then(function(data) {
        ('spotify:album:0sNOF9WDwhWunNAHPD3Baj').should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for an album using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj');
      should.not.exist(options.data);
      callback(null, {uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj'});
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj', function(err, data) {
      should.not.exist(err);
      ('spotify:album:0sNOF9WDwhWunNAHPD3Baj').should.equal(data.uri);
      done();
    });
  });

  it("should retrieve metadata for several albums", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/albums');
      options.query.ids.should.equal('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4');
      should.not.exist(options.data);
      callback(null, {albums:[
        {uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'},
        {uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'}
      ]});
    });

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

  it("should retrieve metadata for several albums using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/albums');
      options.query.ids.should.equal('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4');
      should.not.exist(options.data);
      callback(null, {albums:[
        {uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'},
        {uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'}
      ]});
    });

    var api = new SpotifyWebApi();
    api.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4'], function(err, data) {
      should.not.exist(err);
      'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'.should.equal(data.albums[0].uri);
      'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'.should.equal(data.albums[1].uri);
      done();
    });
  });

  it("should retrive metadata for an artist", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV');
      should.not.exist(options.data);
      callback(null, {uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'});
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV')
      .then(function(data) {
        ('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrive metadata for an artist using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV');
      should.not.exist(options.data);
      callback(null, {uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'});
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV', function(err, data) {
      should.not.exist(err);
      ('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').should.equal(data.uri);
      done();
    });
  });

  it("should retrieve metadata for several artists", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists');
      options.query.ids.should.equal('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin');
      should.not.exist(options.data);
      callback(null, {artists:[
        {uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'},
        {uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'}
      ]});
    });

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

  it("should retrieve metadata for several artists using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists');
      options.query.ids.should.equal('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin');
      should.not.exist(options.data);
      callback(null, {artists:[
        {uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'},
        {uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'}
      ]});
    });

    var api = new SpotifyWebApi();
    api.getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin'], function(err, data) {
      should.not.exist(err);
      'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'.should.equal(data.artists[0].uri);
      'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'.should.equal(data.artists[1].uri);
      done();
    });
  });

  it("should search for an album using limit and offset", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'The Best of Keane',
        type: 'album'
      });
      should.not.exist(options.data);
      callback(null, {
        albums: {
          href: 'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit : 3, offset : 2 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'.should.equal(data.albums.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should search for an album using limit and offset using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'The Best of Keane',
        type: 'album'
      });
      should.not.exist(options.data);
      callback(null, {
        albums: {
          href: 'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit : 3, offset : 2 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'.should.equal(data.albums.href);
      done();
    });
  });

  it("should search for an artist using limit and offset", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 5,
        offset: 1,
        q: 'David Bowie',
        type: 'artist'
      });
      should.not.exist(options.data);
      callback(null, {
        artists: {
          href: 'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit : 5, offset : 1 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'.should.equal(data.artists.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should search for an artist using limit and offset using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 5,
        offset: 1,
        q: 'David Bowie',
        type: 'artist'
      });
      should.not.exist(options.data);
      callback(null, {
        artists: {
          href: 'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit : 5, offset : 1 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'.should.equal(data.artists.href);
      done();
    });
  });

  it("should search for a track using limit and offset", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track'
      });
      should.not.exist(options.data);
      callback(null, {
        tracks: {
          href: 'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit : 3, offset : 2 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'.should.equal(data.tracks.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should search for a track using limit and offset using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track'
      });
      should.not.exist(options.data);
      callback(null, {
        tracks: {
          href: 'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit : 3, offset : 2 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'.should.equal(data.tracks.href);
      done();
    });
  });

  it("should get artists albums", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums');
      options.query.should.eql({
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      });
      should.not.exist(options.data);
      callback(null, {
        href: 'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
      });
    });

    var api = new SpotifyWebApi();
    api.getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 })
      .then(function(data) {
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'.should.equal(data.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should get artists albums using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums');
      options.query.should.eql({
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      });
      should.not.exist(options.data);
      callback(null, {
        href: 'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
      });
    });

    var api = new SpotifyWebApi();
    api.getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'.should.equal(data.href);
      done();
    });
  });

  it("should get tracks from album", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks');
      options.query.should.eql({
        offset: 1,
        limit: 5
      });
      should.not.exist(options.data);
      callback(null, {
        href: 'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
      .then(function(data) {
        'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'.should.equal(data.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get tracks from album using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks');
      options.query.should.eql({
        offset: 1,
        limit: 5
      });
      should.not.exist(options.data);
      callback(null, {
        href: 'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'.should.equal(data.href);
      done();
    });
  });

  it("should get top tracks for artist", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks');
      options.query.should.eql({
        country: 'GB'
      });
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();

    api.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get top tracks for artist", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/top-tracks');
      options.query.should.eql({
        country: 'GB'
      });
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();

    api.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB', function(err, data) {
      should.not.exist(err);
      done();
    });
  });

  it("should get similar artists", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists');
      should.not.exist(options.data);
      callback(null, {
        artists:[{}]
      });
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy')
      .then(function(data) {
        should.exist(data.artists);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get similar artists using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists');
      should.not.exist(options.data);
      callback(null, {
        artists:[{}]
      });
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy', function(err, data) {
      should.exist(data.artists);
      done();
    });
  });

  it("should get a user", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/users/petteralexis');
      should.not.exist(options.data);
      callback(null, {
        uri: 'spotify:user:petteralexis'
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis')
      .then(function(data) {
        'spotify:user:petteralexis'.should.equal(data.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get a user using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/users/petteralexis');
      should.not.exist(options.data);
      callback(null, {
        uri: 'spotify:user:petteralexis'
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis', function(err, data) {
      'spotify:user:petteralexis'.should.equal(data.uri);
      done();
    });

  });

  it.skip("should get the authenticated user's information", function(done) {
    var api = new SpotifyWebApi({
      accessToken : 'someAccessToken'
    });

    api.getMe()
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

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/me');
      if (!options.headers || !options.headers.Authorization) {
        callback(new Error(), null);
      }
    });

    var api = new SpotifyWebApi();

    api.getMe()
      .then(function(data) {
        done(new Error('Should have failed!'));
      }, function(err) {
        done();
      });
  });

  it('should fail if no token is provided for a request that requires an access token using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/me');
      if (!options.headers || !options.headers.Authorization) {
        callback(new Error(), null);
      }
    });

    var api = new SpotifyWebApi();

    api.getMe(function(err) {
      should.exist(err);
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

    api.getPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK')
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

  it('should create a private playlist using callback', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists');
      JSON.parse(options.data).should.eql({ name : 'My Cool Playlist', 'public' : false })
      callback(null, { name : 'My Cool Playlist', 'public' : false });
      should.not.exist(options.query);
    });

    var api = new SpotifyWebApi();

    api.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : false }, function(err, data) {
      done();
    });
  });

  it('should create a playlist using callback without options', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists');
      JSON.parse(options.data).should.eql({ name : 'My Cool Playlist' })
      callback(null, { name : 'My Cool Playlist' });
      should.not.exist(options.query);
    });

    var api = new SpotifyWebApi();

    api.createPlaylist('thelinmichael', 'My Cool Playlist', function(err, data) {
      done();
    });
  });

  it.skip('should change playlist details', function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.changePlaylistDetails('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', {
      name: 'This is a new name for my Cool Playlist, and will become private',
      'public' : false
    }).then(function(data) {
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

  it.skip('should add tracks to playlist with specified index', function(done) {
    var api = new SpotifyWebApi();
    api.setAccessToken('<insert valid access token>');

    api.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"],
      {
        position : 10
      })
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

    var api = new SpotifyWebApi({
      clientId : clientId,
      clientSecret : clientSecret
    });

    api.clientCredentialsGrant()
      .then(function(data) {
        'Bearer'.should.equal(data['token_type']);
        (3600).should.equal(data['expires_in']);
        should.exist(data['access_token']);
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip("should retrieve an access token with scopes", function(done) {
    var clientId = 'fcecfc79122e4cd299473677a17cbd4d',
        clientSecret = 'f6338737c9bb4bc9a71924cb2940adss';

    var api = new SpotifyWebApi({
      clientId : clientId,
      clientSecret : clientSecret
    });

    var scopes = ['playlist-read'];

    api.clientCredentialsGrant({
      'scope' : scopes
    })
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
    var credentials = {
      clientId : 'someClientId',
      clientSecret : 'someClientSecret',
      redirectUri : 'http://www.michaelthelin.se/test-callback'
    };

    var api = new SpotifyWebApi(credentials);

    api.authorizationCodeGrant('mySuperLongCode')
      .then(function(data) {
        'Bearer'.should.equal(data['token_type']);
        (3600).should.equal(data['expires_in']);
        should.exist(data['access_token']);
        should.exist(data['refresh_token']);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it.skip('should refresh an access token', function(done) {
    var clientId = 'someClientId';
    var clientSecret = 'someClientSecret';
    var refreshToken = 'someLongRefreshToken';

    var api = new SpotifyWebApi({
      clientId : clientId,
      clientSecret : clientSecret,
      refreshToken : refreshToken
    });
    api.refreshAccessToken()
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it('should create authorization URL', function() {
    var scopes = ['user-read-private', 'user-read-email'],
        redirectUri = 'https://example.com/callback',
        clientId = '5fe01282e44241328a84e7c5cc169165',
        state = 'some-state-of-my-choice';

    var api = new SpotifyWebApi({
        clientId : clientId,
        redirectUri : redirectUri
    });

    var authorizeURL = api.createAuthorizeURL(scopes, state);
    'https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice'.should.equal(authorizeURL);
  });

  it('should set, get and reset credentials successfully', function() {
    var api = new SpotifyWebApi({
      clientId : 'myClientId'
    });

    api.getClientId().should.equal('myClientId');
    api.resetClientId();
    should.not.exist(api.getClientId());

    api.setClientId('woopwoop');
    api.getClientId().should.equal('woopwoop');
  });

  it.skip('should get tracks in a playlist', function(done) {
    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });
    api.getPlaylistTracks('thelinmichael', '3ktAYNcRHpazJ9qecm3ptn')
      .then(function(data) {
        'https://api.spotify.com/v1/users/thelinmichael/playlists/3ktAYNcRHpazJ9qecm3ptn/tracks'.should.equal(data.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it.skip('should get tracks in a playlist with fields option', function(done) {
    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });
    api.getPlaylistTracks('thelinmichael', '3ktAYNcRHpazJ9qecm3ptn', { 'fields' : 'items' })
      .then(function(data) {
        should.exist(data.items);
        should.not.exist(data.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  /* Run this test with a valid access token with the user-library-read scope */
  it.skip('should get tracks in the users library', function(done) {
    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });
    api.getMySavedTracks({
      limit : 2,
      offset: 1
    })
    .then(function(data) {
      data.href.should.equal("https://api.spotify.com/v1/me/tracks?offset=1&limit=2");
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  /* Run this test with a valid access token with the user-library-read scope */
  it.skip('should determine if a track is in the users library', function(done) {

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });
    api.containsMySavedTracks(["5ybJm6GczjQOgTqmJ0BomP"])
    .then(function(data) {
      Object.prototype.toString.call(data).should.equal('[object Array]');
      data.length.should.equal(1);
      data[0].should.equal(false);
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should remove tracks in the users library', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.del);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.removeFromMySavedTracks(["3VNWq8rTnQG6fM1eldSpZ0"])
    .then(function(data) {
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });

  });

  it('should follow a playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      JSON.parse(options.data).should.eql({ public: false });
      should.not.exist(options.query);
      uri.should.equal('https://api.spotify.com/v1/users/jmperezperez/playlists/7p9EIC2KW0NNkTEOnTUZJl/followers');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.followPlaylist('jmperezperez', '7p9EIC2KW0NNkTEOnTUZJl', { 'public' : false })
    .then(function(data) {
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should unfollow a playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.del);
      should.not.exist(options.data);
      should.not.exist(options.query);
      uri.should.equal('https://api.spotify.com/v1/users/jmperezperez/playlists/7p9EIC2KW0NNkTEOnTUZJl/followers');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.unfollowPlaylist('jmperezperez', '7p9EIC2KW0NNkTEOnTUZJl')
    .then(function(data) {
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should follow several users', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.followUsers(['thelinmichael', 'wizzler'])
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should follow several users using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.followUsers(['thelinmichael', 'wizzler'], function(err, data) {
      should.not.exist(err);
      done();
    });

  });

  it('should follow several artists', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.followArtists(['137W8MRPWKqSmrBGDBFSop'])
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should follow several artists using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.followArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      done();
    });

  });

  it('should unfollow several users', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.del);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.unfollowUsers(['thelinmichael', 'wizzler'])
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should unfollow several users using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.del);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.unfollowUsers(['thelinmichael', 'wizzler'], function(err, data) {
      done();
    });

  });

  it('should unfollow several artists', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.del);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.unfollowArtists(['137W8MRPWKqSmrBGDBFSop'])
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should unfollow several artists using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.del);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.unfollowArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      done();
    });

  });

  it('should check whether the current user follows several other users', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback(null, [true, false]);
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingUsers(['thelinmichael', 'wizzler'])
      .then(function(data) {
        data.should.be.an.instanceOf(Array).and.have.lengthOf(2);
        data[0].should.eql(true);
        data[1].should.eql(false);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should check whether the current user follows several other users using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback(null, [true, false]);
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingUsers(['thelinmichael', 'wizzler'], function(err, data) {
      should.not.exist(err);
      data.should.be.an.instanceOf(Array).and.have.lengthOf(2);
      data[0].should.eql(true);
      data[1].should.eql(false);
      done();
    });
  });

  it('should check whether the current user follows several artists', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback(null, [false]);
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingArtists(['137W8MRPWKqSmrBGDBFSop'])
      .then(function(data) {
        data.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        data[0].should.eql(false);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should check whether the current user follows several artists using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback(null, [false]);
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      should.not.exist(err);
      data.should.be.an.instanceOf(Array).and.have.lengthOf(1);
      data[0].should.eql(false);
      done();
    });

  });

  it('should check whether users follows a playlist', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/users/spotify_germany/playlists/2nKFnGNFvHX9hG5Kv7Bm3G/followers/contains');
      options.query.should.eql({
        ids: 'thelinmichael,ella'
      });
      should.not.exist(options.data);
      callback(null, [true, false]);
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.areFollowingPlaylist('spotify_germany', '2nKFnGNFvHX9hG5Kv7Bm3G', ['thelinmichael', 'ella'])
      .then(function(data) {
        data.should.be.an.instanceOf(Array).and.have.lengthOf(2);
        data[0].should.eql(true);
        data[1].should.eql(false);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should add tracks to playlist', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      var trackUris = options.query.uris.split(",");
      trackUris.should.be.an.instanceOf(Array).and.have.lengthOf(2);
      should.not.exist(options.data);
      options.headers.Authorization.should.equal('Bearer long-access-token');
      callback();
    });

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

  it('should add tracks to playlist using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      var trackUris = options.query.uris.split(",");
      trackUris.should.be.an.instanceOf(Array).and.have.lengthOf(2);
      should.not.exist(options.data);
      options.headers.Authorization.should.equal('Bearer long-access-token');
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"], null, function(err, data) {
      done();
    });
  });

  it('should add tracks to the users library', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(["3VNWq8rTnQG6fM1eldSpZ0"])
    .then(function(data) {
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should add tracks to the users library using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.put);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(["3VNWq8rTnQG6fM1eldSpZ0"], function(err, data) {
      done();
    });
  });

  it('handles expired tokens', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {

      method.should.equal(restler.put);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g');

      // simulate token expired
      callback(new Error('The access token expired'), null);
    });

    var accessToken = "BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g";
    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0'])
    .then(function(data) {
      done(new Error('should have failed'));
    }, function(err) {
      err.message.should.equal('The access token expired');
      done();
    });
  })

  it('handles expired tokens using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {

      method.should.equal(restler.put);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g');

      // simulate token expired
      callback(new Error('The access token expired'), null);
    });

    var accessToken = "BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g";
    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0'], function(err, data) {
      err.message.should.equal('The access token expired');
      done();
    });
  });

  it('should get new releases', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/new-releases');
      options.query.should.eql({
        limit: 5,
        offset: 0,
        country: 'SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, { albums: {
          href: 'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
          items: [{},{},{},{},{}]
        }
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getNewReleases({
      limit : 5,
      offset: 0,
      country: 'SE'
    })
    .then(function(data) {
      data.albums.href.should.equal('https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5')
      data.albums.items.length.should.equal(5);
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should get new releases', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/new-releases');
      options.query.should.eql({
        limit: 5,
        offset: 0,
        country: 'SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, { albums: {
          href: 'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
          items: [{},{},{},{},{}]
        }
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getNewReleases({
      limit : 5,
      offset: 0,
      country: 'SE'
    }, function(err, data) {
      should.not.exist(err);
      data.albums.href.should.equal('https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5')
      data.albums.items.length.should.equal(5);
      done();
    });
  });

  it('should get featured playlists', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/featured-playlists');
      options.query.should.eql({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, { playlists: {
          href: 'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
          items: [{},{},{}]
        }
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getFeaturedPlaylists({
      limit : 3,
      offset: 1,
      country: 'SE',
      locale: 'sv_SE',
      timestamp:'2014-10-23T09:00:00'
    })
    .then(function(data) {
      data.playlists.href.should.equal('https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3')
      data.playlists.items.length.should.equal(3);
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should get featured playlists using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/featured-playlists');
      options.query.should.eql({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, { playlists: {
          href: 'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
          items: [{},{},{}]
        }
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getFeaturedPlaylists({
      limit : 3,
      offset: 1,
      country: 'SE',
      locale: 'sv_SE',
      timestamp:'2014-10-23T09:00:00'
    }, function(err, data) {
      should.not.exist(err);
      data.playlists.href.should.equal('https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3')
      data.playlists.items.length.should.equal(3);
      done();
    });
  });

  it('should get browse categories', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/categories');
      options.query.should.eql({
        limit : 2,
        offset : 4,
        country : 'SE',
        locale : 'sv_SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, { items : [{ href : "https://api.spotify.com/v1/browse/categories/party" }, { href : "https://api.spotify.com/v1/browse/categories/pop" }] });

    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getCategories({
      limit : 2,
      offset: 4,
      country: 'SE',
      locale: 'sv_SE'
    }, function(err, data) {
      should.not.exist(err);
      data.items[0].href.should.equal('https://api.spotify.com/v1/browse/categories/party');
      data.items[1].href.should.equal('https://api.spotify.com/v1/browse/categories/pop');
      data.items.length.should.equal(2);
      done();
    });

  });

  it('should get a browse category', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/categories/party');
      options.query.should.eql({
        country : 'SE',
        locale : 'sv_SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, {
        href : 'https://api.spotify.com/v1/browse/categories/party',
        name : 'Party'
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getCategory('party', {
      country: 'SE',
      locale: 'sv_SE'
    }, function(err, data) {
      should.not.exist(err);
      data.href.should.equal('https://api.spotify.com/v1/browse/categories/party');
      data.name.should.equal('Party');
      done();
    });
  });

  it('should get a playlists for a browse category', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://api.spotify.com/v1/browse/categories/party/playlists');
      options.query.should.eql({
        country : 'SE',
        limit : 2,
        offset : 1
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, {
        playlists : {
          items : [ {
            href : 'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4k7EZPI3uKMz4aRRrLVfen'
          },
          {
            href : 'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4HZh0C9y80GzHDbHZyX770'
          }
        ]}
      });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getPlaylistsForCategory('party', {
      country: 'SE',
      limit : 2,
      offset : 1
    }, function(err, data) {
      should.not.exist(err);
      data.playlists.items[0].href.should.equal('https://api.spotify.com/v1/users/spotifybrazilian/playlists/4k7EZPI3uKMz4aRRrLVfen');
      data.playlists.items[1].href.should.equal('https://api.spotify.com/v1/users/spotifybrazilian/playlists/4HZh0C9y80GzHDbHZyX770');
      data.playlists.items.length.should.equal(2);
      done();
    });
  });

});
