var superagent = require('superagent'),
    HttpManager = require('../src/http-manager'),
    sinon = require('sinon'),
    SpotifyWebApi = require('../src/server'),
    WebApiError = require('../src/webapi-error'),
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
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK');
      should.not.exist(options.data);
      callback(null, { body : { "uri" : "spotify:track:3Qm86XLflmIXVm1wcwkgDK" }, headers : { "cache-control" : "public, max-age=7200" }, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK')
      .then(function(data) {
        data.body.uri.should.equal('spotify:track:3Qm86XLflmIXVm1wcwkgDK');
        (data.statusCode).should.equal(200);
        (data.headers['cache-control']).should.equal('public, max-age=7200');
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve error when retrieving track metadata", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK');
      should.not.exist(options.data);
      callback(new WebApiError("Do NOT do that again!", 400));
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK')
      .then(function(data) {
        done(new Error("Test failed!"));
      }, function(err) {
        (err.statusCode).should.equal(400);
        err.message.should.equal("Do NOT do that again!");
        done();
      });
    });

  it("should get track for Swedish market", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/tracks/3Qm86XLflmIXVm1wcwkgDK');
      options.query.market.should.equal('SE');
      should.not.exist(options.data);
      callback();
    });

    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK', { market : 'SE' })
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve track metadata using callback", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
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
      method.should.equal(superagent.get);
      callback(new WebApiError('non existing id', 400));
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
      method.should.equal(superagent.get);
      callback(new WebApiError('non existing id', 400), null);
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
      method.should.equal(superagent.get);
      callback(new WebApiError('Fail', 400), null);
    });

    var api = new SpotifyWebApi();
    api.getTrack()
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {
        should.exist(err);
        done();
      });
  });

  it("should retrieve metadata for several tracks", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
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
      method.should.equal(superagent.get);
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
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj');
      should.not.exist(options.data);
      callback(null, { body : { uri : 'spotify:album:0sNOF9WDwhWunNAHPD3Baj'}, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj')
      .then(function(data) {
        ('spotify:album:0sNOF9WDwhWunNAHPD3Baj').should.equal(data.body.uri);
        (200).should.equal(data.statusCode);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for an album for a market ", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj');
      should.not.exist(options.data);
      options.query.market.should.equal('SE');
      callback(null, { body : { uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj' }, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj', { market : 'SE' })
      .then(function(data) {
        ('spotify:album:0sNOF9WDwhWunNAHPD3Baj').should.equal(data.body.uri);
        (200).should.equal(data.statusCode);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for an album using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj');
      should.not.exist(options.data);
      callback(null, { body : { uri: 'spotify:album:0sNOF9WDwhWunNAHPD3Baj' }, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getAlbum('0sNOF9WDwhWunNAHPD3Baj', function(err, data) {
      should.not.exist(err);
      ('spotify:album:0sNOF9WDwhWunNAHPD3Baj').should.equal(data.body.uri);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it("should retrieve metadata for several albums", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums');
      options.query.ids.should.equal('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4');
      should.not.exist(options.data);
      callback(null, { body : { albums: [
        {uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'},
        {uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'}
      ]}, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4'])
      .then(function(data) {
        'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'.should.equal(data.body.albums[0].uri);
        'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'.should.equal(data.body.albums[1].uri);
        (200).should.equal(data.statusCode);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for several albums using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums');
      options.query.ids.should.equal('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4');
      should.not.exist(options.data);
      callback(null, { body : { albums:[
        {uri: 'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'},
        {uri: 'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'}
      ]}, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ', '6JWc4iAiJ9FjyK0B59ABb4'], function(err, data) {
      should.not.exist(err);
      'spotify:album:41MnTivkwTO3UUJ8DrqEJJ'.should.equal(data.body.albums[0].uri);
      'spotify:album:6JWc4iAiJ9FjyK0B59ABb4'.should.equal(data.body.albums[1].uri);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it("should retrive metadata for an artist", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV');
      should.not.exist(options.data);
      callback(null, {body: {uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'}});
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV')
      .then(function(data) {
        ('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').should.equal(data.body.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for an artist using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0LcJLqbBmaGUft1e9Mm8HV');
      should.not.exist(options.data);
      callback(null, {body: {uri: 'spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'}});
    });

    var api = new SpotifyWebApi();
    api.getArtist('0LcJLqbBmaGUft1e9Mm8HV', function(err, data) {
      should.not.exist(err);
      ('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').should.equal(data.body.uri);
      done();
    });
  });

  it("should retrieve metadata for several artists", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists');
      options.query.ids.should.equal('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin');
      should.not.exist(options.data);
      callback(null, { body: { artists:[
        {uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'},
        {uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'}
      ]}, statusCode: 200 });
    });

    var api = new SpotifyWebApi();
    api.getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin'])
      .then(function(data) {
        'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'.should.equal(data.body.artists[0].uri);
        'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'.should.equal(data.body.artists[1].uri);
        (200).should.equal(data.statusCode);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should retrieve metadata for several artists using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists');
      options.query.ids.should.equal('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin');
      should.not.exist(options.data);
      callback(null, { body : { artists:[
        { uri: 'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy' },
        { uri: 'spotify:artist:3dBVyJ7JuOMt4GE9607Qin' }
      ]}, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.getArtists(['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin'], function(err, data) {
      should.not.exist(err);
      'spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy'.should.equal(data.body.artists[0].uri);
      'spotify:artist:3dBVyJ7JuOMt4GE9607Qin'.should.equal(data.body.artists[1].uri);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it("should search for an album using limit and offset", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'The Best of Keane',
        type: 'album'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          albums: {
            href: 'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'
          }
        },
        headers : {
          'test' : 'value'
        },
        statusCode : 200
      });
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit : 3, offset : 2 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'.should.equal(data.body.albums.href);
        (200).should.equal(data.statusCode);
        'value'.should.equal(data.headers.test);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should search for an album using limit and offset using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'The Best of Keane',
        type: 'album'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          albums: {
            href: 'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchAlbums('The Best of Keane', { limit : 3, offset : 2 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=The+Best+of+Keane&offset=2&limit=3&type=album'.should.equal(data.body.albums.href);
      done();
    });
  });

  it("should search for playlists", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 1,
        offset: 0,
        q: 'workout',
        type: 'playlist'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          playlists: {
            href: 'https://api.spotify.com/v1/search?query=workout&offset=0&limit=1&type=playlist'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchPlaylists('workout', { limit : 1, offset : 0 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=workout&offset=0&limit=1&type=playlist'.should.equal(data.body.playlists.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should search for an artist using limit and offset", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 5,
        offset: 1,
        q: 'David Bowie',
        type: 'artist'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          artists: {
            href: 'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit : 5, offset : 1 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'.should.equal(data.body.artists.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should search for an artist using limit and offset using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 5,
        offset: 1,
        q: 'David Bowie',
        type: 'artist'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          artists: {
            href: 'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchArtists('David Bowie', { limit : 5, offset : 1 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=David+Bowie&offset=1&limit=5&type=artist'.should.equal(data.body.artists.href);
      done();
    });
  });

  it("should search for a track using limit and offset", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          tracks: {
            href: 'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit : 3, offset : 2 })
      .then(function(data) {
        'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'.should.equal(data.body.tracks.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should search for a track using limit and offset using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          tracks: {
            href: 'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.searchTracks('Mr. Brightside', { limit : 3, offset : 2 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track'.should.equal(data.body.tracks.href);
      done();
    });
  });

  it("should search for several types using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/search/');
      options.query.should.eql({
        limit: 3,
        offset: 2,
        q: 'Mr. Brightside',
        type: 'track,album'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          tracks: {
            href: 'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track,album'
          }
        }
      });
    });

    var api = new SpotifyWebApi();
    api.search('Mr. Brightside', ['track', 'album'], { limit : 3, offset : 2 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/search?query=Mr.+Brightside&offset=2&limit=3&type=track,album'.should.equal(data.body.tracks.href);
      done();
    });
  });

  it("should get artists albums", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums');
      options.query.should.eql({
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          href: 'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 })
      .then(function(data) {
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'.should.equal(data.body.href);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });
  });

  it("should get artists albums using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums');
      options.query.should.eql({
        album_type: 'album',
        country: 'GB',
        limit: 2,
        offset: 5
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          href: 'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy', { album_type : 'album', country : 'GB', limit : 2, offset : 5 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy/albums?offset=5&limit=2&album_type=album&market=GB'.should.equal(data.body.href);
      done();
    });
  });

  it("should get tracks from album", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks');
      options.query.should.eql({
        offset: 1,
        limit: 5
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          href: 'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
      .then(function(data) {
        'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'.should.equal(data.body.href);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get tracks from album using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks');
      options.query.should.eql({
        offset: 1,
        limit: 5
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          href: 'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 }, function(err, data) {
      should.not.exist(err);
      'https://api.spotify.com/v1/albums/41MnTivkwTO3UUJ8DrqEJJ/tracks?offset=1&limit=5'.should.equal(data.body.href);
      done();
    });
  });

  it("should get top tracks for artist", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
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
      method.should.equal(superagent.get);
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
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists');
      should.not.exist(options.data);
      callback(null, {
        body : {
          artists:[ {} ]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy')
      .then(function(data) {
        should.exist(data.body.artists);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get similar artists using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/artists/0qeei9KQnptjwb8MgkqEoy/related-artists');
      should.not.exist(options.data);
      callback(null, {
        body : {
          artists:[{}]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy', function(err, data) {
      should.exist(data.body.artists);
      done();
    });
  });

  it("should get a user", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/users/petteralexis');
      should.not.exist(options.data);
      callback(null,
      {
        body : {
          uri: 'spotify:user:petteralexis'
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis')
      .then(function(data) {
        'spotify:user:petteralexis'.should.equal(data.body.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get a user with a '#' character and encode it properly", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/users/%23matze23');
      should.not.exist(options.data);
      callback(null,
      {
        body : {
          uri: 'spotify:user:%23matze23'
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('#matze23')
      .then(function(data) {
        'spotify:user:%23matze23'.should.equal(data.body.uri);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get a user using callback", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/users/petteralexis');
      should.not.exist(options.data);
      callback(null, {
        body : {
          uri: 'spotify:user:petteralexis'
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getUser('petteralexis', function(err, data) {
      'spotify:user:petteralexis'.should.equal(data.body.uri);
      done();
    });

  });

  it("should get the authenticated user's information", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me');
      options.headers.should.eql({Authorization: 'Bearer someAccessToken'});
      callback(null, {
        body : {
          uri: 'spotify:user:thelinmichael'
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken : 'someAccessToken'
    });

    api.getMe()
      .then(function(data) {
        'spotify:user:thelinmichael'.should.equal(data.body.uri);
        done();
      });
  });

  it("should get the authenticated user's information with accesstoken set on the api object", function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me');
      options.headers.should.eql({Authorization: 'Bearer someAccessToken'});
      callback(null, {
        body : {
          uri: 'spotify:user:thelinmichael'
        }
      });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('someAccessToken');

    api.getMe()
      .then(function(data) {
        'spotify:user:thelinmichael'.should.equal(data.body.uri);
        done();
      });
  });

  it('should fail if no token is provided for a request that requires an access token', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me');
      if (!options.headers || !options.headers.Authorization) {
        callback(new WebApiError('No token', 401), null);
      }
    });

    var api = new SpotifyWebApi();

    api.getMe()
      .then(function(data) {
        done(new Error('Should have failed!'));
      }, function(err) {
        'No token'.should.equal(err.message);
        (401).should.equal(err.statusCode);
        done();
      });
  });

  it('should fail if no token is provided for a request that requires an access token using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me');
      if (!options.headers || !options.headers.Authorization) {
        callback(new WebApiError('No token', 401), null);
      }
    });

    var api = new SpotifyWebApi();

    api.getMe(function(err) {
      'No token'.should.equal(err.message);
      (401).should.equal(err.statusCode);
      should.exist(err);
      done();
    });
  });

  it('should get a users playlists', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists');
      should.not.exist(options.query);
      callback(null, { body : { items: [
        { uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK' },
        { uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK' }
        ]},
        statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryLongAccessToken');

    api.getUserPlaylists('thelinmichael')
      .then(function(data) {
        (2).should.equal(data.body.items.length);
        (200).should.equal(data.statusCode);
        done();
      });
  });

  it('should get the current users playlists', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/playlists');
      should.not.exist(options.query);
      callback(null, { body : { items: [
        { uri: 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK' },
        { uri: 'spotify:user:thelinmichael:playlist:3EsfV6XzCHU8SPNdbnFogK' }
        ]},
        statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryLongAccessToken');

    api.getUserPlaylists()
      .then(function(data) {
        (2).should.equal(data.body.items.length);
        (200).should.equal(data.statusCode);
        done();
      });
  });

  it('should get a playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK');
      should.not.exist(options.query);
      callback(null, { body : { uri : 'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'}, statusCode : 200 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('myVeryVeryLongAccessToken');

    api.getPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', {}, function(err, data) {
      'spotify:user:thelinmichael:playlist:5ieJqeLJjjI8iJWaxeBLuK'.should.equal(data.body.uri);
      (200).should.equal(data.statusCode);
      done();
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
      method.should.equal(superagent.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists');
      JSON.parse(options.data).should.eql({ name : 'My Cool Playlist', 'public' : false });
      should.not.exist(options.query);
      callback(null, { body : { name : 'My Cool Playlist', 'public' : false }, statusCode : 200 });
    });

    var api = new SpotifyWebApi();

    api.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : false }, function(err, data) {
      'My Cool Playlist'.should.equal(data.body.name);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it('should create a playlist using callback without options', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists');
      JSON.parse(options.data).should.eql({ name : 'My Cool Playlist' })
      callback(null, { body: { name : 'My Cool Playlist' } });
      should.not.exist(options.query);
    });

    var api = new SpotifyWebApi();

    api.createPlaylist('thelinmichael', 'My Cool Playlist', function(err, data) {
      done();
    });
  });

  it('should change playlist details', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK');
      JSON.parse(options.data).should.eql({
        name : 'This is a new name for my Cool Playlist, and will become private',
        'public' : false
      })
      callback(null, { statusCode : 200 });
      should.not.exist(options.query);
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.changePlaylistDetails('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', {
      name: 'This is a new name for my Cool Playlist, and will become private',
      'public' : false
    }).then(function(data) {
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it('should add tracks to playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      options.query.should.eql({uris: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M'});
      callback(null, { body: { snapshot_id: 'aSnapshotId'}, statusCode : 201 });
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'])
      .then(function(data) {
        (201).should.equal(data.statusCode);
        done();
      });
  });

  it('should add tracks to playlist with specified index', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      options.query.should.eql({
        uris: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M',
        position: 10
      });
      callback(null, { body: { snapshot_id: 'aSnapshotId'}, statusCode : 201 });
    });


    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"],
      {
        position : 10
      })
      .then(function(data) {
        done();
      });
  });

  it("should get user's top artists", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/top/artists');
      options.query.should.eql({
        limit : 5
      });
      options.headers.should.eql({Authorization: 'Bearer someAccessToken'});
      callback(null, {
        body : {
          items: [ ]
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken : 'someAccessToken'
    });

    api.getMyTopArtists({ limit : 5})
      .then(function(data) {
        should.exist(data.body.items);
        done();
      });
  });

  it("should get user's top tracks", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/top/tracks');
      options.query.should.eql({
        limit : 5
      });
      options.headers.should.eql({Authorization: 'Bearer someAccessToken'});
      callback(null, {
        body : {
          items: [ ]
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken : 'someAccessToken'
    });

    api.getMyTopTracks({ limit : 5})
      .then(function(data) {
        should.exist(data.body.items);
        done();
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

  it('should refresh an access token', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      uri.should.equal('https://accounts.spotify.com/api/token');
      options.data.should.eql({ grant_type : 'refresh_token', refresh_token : 'someLongRefreshToken' });
      should.not.exist(options.query);
      options.headers.should.eql({Authorization: 'Basic c29tZUNsaWVudElkOnNvbWVDbGllbnRTZWNyZXQ='});
      callback(null, { body :
        {
           "access_token": "NgCXRK...MzYjw",
           "token_type": "Bearer",
           "expires_in": 3600,
           "refresh_token": "NgAagA...Um_SHo"
        }, statusCode : 200 });
    });

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
      clientId : 'myClientId',
      clientSecret : 'myClientSecret'
    });

    api.getClientId().should.equal('myClientId');
    api.getClientSecret().should.equal('myClientSecret');

    api.resetClientId();
    should.not.exist(api.getClientId());

    api.setClientId('woopwoop');
    api.getClientId().should.equal('woopwoop');

    api.resetClientSecret();
    should.not.exist(api.getClientSecret());

    api.setClientSecret('aNewClientSecret');
    api.getClientSecret().should.equal('aNewClientSecret');
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
      method.should.equal(superagent.del);
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

  it('should remove albums in the users library', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.del);
      JSON.parse(options.data).should.eql(["27cZdqrQiKt3IT00338dws"]);
      uri.should.equal('https://api.spotify.com/v1/me/albums');
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.removeFromMySavedAlbums(["27cZdqrQiKt3IT00338dws"])
    .then(function(data) {
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });

  });

  it('should add albums to the users library', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      JSON.parse(options.data).should.eql(["27cZdqrQiKt3IT00338dws"]);
      uri.should.equal('https://api.spotify.com/v1/me/albums');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedAlbums(["27cZdqrQiKt3IT00338dws"])
    .then(function(data) {
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should get albums in the users library', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/albums');
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      options.query.limit.should.equal(2);
      options.query.offset.should.equal(1);
      callback(null, { body: { href : 'https://api.spotify.com/v1/me/albums?offset=1&limit=2',
                               items : [  { 'added_at' : '2014-07-08T18:18:33Z', 'album' : { 'name' : 'Album!'} } ] } });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getMySavedAlbums({
      limit : 2,
      offset: 1
    })
    .then(function(data) {
      data.body.href.should.equal("https://api.spotify.com/v1/me/albums?offset=1&limit=2");
      data.body.items[0]['added_at'].should.equal('2014-07-08T18:18:33Z');
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should determine if an album is in the users library', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/albums/contains');
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      options.query.ids.should.equal("27cZdqrQiKt3IT00338dws");
      callback(null, { body: [ true ] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });
    api.containsMySavedAlbums(["27cZdqrQiKt3IT00338dws"])
    .then(function(data) {
      Object.prototype.toString.call(data.body).should.equal('[object Array]');
      data.body.length.should.equal(1);
      data.body[0].should.equal(true);
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });


  it('should follow a playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
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
      method.should.equal(superagent.del);
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
      method.should.equal(superagent.put);
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
      method.should.equal(superagent.put);
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
      method.should.equal(superagent.put);
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
      method.should.equal(superagent.put);
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
      method.should.equal(superagent.del);
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
      method.should.equal(superagent.del);
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
      method.should.equal(superagent.del);
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
      method.should.equal(superagent.del);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback(null, { statusCode : 200 });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.unfollowArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      (200).should.equal(data.statusCode);
      done();
    });

  });

  it('should check whether the current user follows several other users', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback(null, { body : [true, false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingUsers(['thelinmichael', 'wizzler'])
      .then(function(data) {
        data.body.should.be.an.instanceOf(Array).and.have.lengthOf(2);
        data.body[0].should.eql(true);
        data.body[1].should.eql(false);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should check whether the current user follows several other users using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'user',
        ids: 'thelinmichael,wizzler'
      });
      should.not.exist(options.data);
      callback(null, { body : [true, false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingUsers(['thelinmichael', 'wizzler'], function(err, data) {
      should.not.exist(err);
      data.body.should.be.an.instanceOf(Array).and.have.lengthOf(2);
      data.body[0].should.eql(true);
      data.body[1].should.eql(false);
      done();
    });
  });

  it('should check whether the current user follows several artists', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback(null, { body : [false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingArtists(['137W8MRPWKqSmrBGDBFSop'])
      .then(function(data) {
        data.body.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        data.body[0].should.eql(false);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should check whether the current user follows several artists using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/following/contains');
      options.query.should.eql({
        type: 'artist',
        ids: '137W8MRPWKqSmrBGDBFSop'
      });
      should.not.exist(options.data);
      callback(null, { body : [false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.isFollowingArtists(['137W8MRPWKqSmrBGDBFSop'], function(err, data) {
      should.not.exist(err);
      data.body.should.be.an.instanceOf(Array).and.have.lengthOf(1);
      data.body[0].should.eql(false);
      done();
    });

  });

  it('should get a user\'s followed artists using callback', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        after: '6tbXwhqy3WAFqanusCLvEU',
        limit: 3
      });
      should.not.exist(options.data);
      callback(null, { body : { 'artists' : { 'items' : [] } } });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getFollowedArtists({ after : '6tbXwhqy3WAFqanusCLvEU', limit : 3 })
      .then(function(data) {
        should.exist(data.body.artists);
        done();
      }, function(err) {
        done(err);
      });
  });

  it('should get a user\'s followed artists using callback', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/following');
      options.query.should.eql({
        type: 'artist',
        after: '6tbXwhqy3WAFqanusCLvEU',
        limit: 3
      });
      should.not.exist(options.data);
      callback(null, { body : { 'artists' : { 'items' : [] } } });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.getFollowedArtists({ after : '6tbXwhqy3WAFqanusCLvEU', limit : 3 }, function(err, data) {
      should.not.exist(err);
      should.exist(data.body.artists);
      done();
    });
  });

  it('should check whether users follows a playlist', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/users/spotify_germany/playlists/2nKFnGNFvHX9hG5Kv7Bm3G/followers/contains');
      options.query.should.eql({
        ids: 'thelinmichael,ella'
      });
      should.not.exist(options.data);
      callback(null, { body : [true, false] });
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.areFollowingPlaylist('spotify_germany', '2nKFnGNFvHX9hG5Kv7Bm3G', ['thelinmichael', 'ella'])
      .then(function(data) {
        data.body.should.be.an.instanceOf(Array).and.have.lengthOf(2);
        data.body[0].should.eql(true);
        data.body[1].should.eql(false);
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should add tracks to playlist', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
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
      method.should.equal(superagent.post);
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

  it("should remove tracks from a playlist by position", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.del);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      should.not.exist(options.query);
      JSON.parse(options.data).positions[0].should.equal(0);
      JSON.parse(options.data).positions[1].should.equal(2);
      JSON.parse(options.data)["snapshot_id"].should.equal("0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9");
      options.headers.Authorization.should.equal('Bearer long-access-token');
      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.removeTracksFromPlaylistByPosition('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', [0, 2], "0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9", function(err, data) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });

  });

  it("should reorder tracks from a playlist by position", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      should.not.exist(options.query);
      JSON.parse(options.data)["range_start"].should.equal(5);
      JSON.parse(options.data)["range_length"].should.equal(1);
      JSON.parse(options.data)["insert_before"].should.equal(1512);
      JSON.parse(options.data)["snapshot_id"].should.equal("0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9");
      options.headers.Authorization.should.equal('Bearer long-access-token');

      callback();
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    var options = {
      'snapshot_id': '0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9',
      'range_length' : 1
    };

    api.reorderTracksInPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', 5, 1512, options, function(err, data) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });

  });

  it('should add tracks to the users library', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
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
      method.should.equal(superagent.put);
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

      method.should.equal(superagent.put);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g');

      // simulate token expired
      callback(new WebApiError('The access token expired', 401), null);
    });

    var accessToken = "BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g";
    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0'])
    .then(function(data) {
      done(new Error('should have failed'));
    }, function(err) {
      'The access token expired'.should.equal(err.message);
      (401).should.equal(err.statusCode);
      done();
    });
  })

  it('handles expired tokens using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {

      method.should.equal(superagent.put);
      JSON.parse(options.data).should.eql(["3VNWq8rTnQG6fM1eldSpZ0"]);
      uri.should.equal('https://api.spotify.com/v1/me/tracks');
      should.not.exist(options.query);
      options.headers.Authorization.should.equal('Bearer BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g');

      // simulate token expired
      callback(new WebApiError('The access token expired', 401), null);
    });

    var accessToken = "BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g";
    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0'], function(err, data) {
      'The access token expired'.should.equal(err.message);
      (401).should.equal(err.statusCode);
      done();
    });
  });

  it('should get new releases', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/new-releases');
      options.query.should.eql({
        limit: 5,
        offset: 0,
        country: 'SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, {
        body : {
          albums: {
            href: 'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
            items: [{},{},{},{},{}]
          }
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
      data.body.albums.href.should.equal('https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5')
      data.body.albums.items.length.should.equal(5);
      done();
    }, function(err) {
      done(err);
    });
  });

  it('should get new releases', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/new-releases');
      options.query.should.eql({
        limit: 5,
        offset: 0,
        country: 'SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null,
        {
          body : {
            albums: {
              href: 'https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5',
              items: [{},{},{},{},{}]
           }
         },
         statusCode : 200
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
      data.body.albums.href.should.equal('https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=5')
      data.body.albums.items.length.should.equal(5);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it('should get featured playlists', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/featured-playlists');
      options.query.should.eql({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null,
        {
          body : {
            playlists: {
              href: 'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
              items: [{},{},{}]
            }
          },
          statusCode : 200
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
      data.body.playlists.href.should.equal('https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3')
      data.body.playlists.items.length.should.equal(3);
      (200).should.equal(data.statusCode);
      done();
    }, function(err) {
      console.log(err);
      done(err);
    });
  });

  it('should get featured playlists using callback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/featured-playlists');
      options.query.should.eql({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null,
        {
          body : {
            playlists: {
              href: 'https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3',
              items: [{},{},{}]
            }
          },
          statusCode : 200
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
      data.body.playlists.href.should.equal('https://api.spotify.com/v1/browse/featured-playlists?country=SE&locale=sv_SE&timestamp=2014-10-23T09:00:00&offset=1&limit=3')
      data.body.playlists.items.length.should.equal(3);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it('should get browse categories', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/categories');
      options.query.should.eql({
        limit : 2,
        offset : 4,
        country : 'SE',
        locale : 'sv_SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null,
        {
          body : {
            items : [{ href : "https://api.spotify.com/v1/browse/categories/party" }, { href : "https://api.spotify.com/v1/browse/categories/pop" }]
          },
          statusCode : 200
        }
      );
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
      data.body.items[0].href.should.equal('https://api.spotify.com/v1/browse/categories/party');
      data.body.items[1].href.should.equal('https://api.spotify.com/v1/browse/categories/pop');
      data.body.items.length.should.equal(2);
      (200).should.equal(data.statusCode);
      done();
    });

  });

  it('should get a browse category', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/categories/party');
      options.query.should.eql({
        country : 'SE',
        locale : 'sv_SE'
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, {
        body : {
          href : 'https://api.spotify.com/v1/browse/categories/party',
          name : 'Party'
        },
        statusCode : 200
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
      data.body.href.should.equal('https://api.spotify.com/v1/browse/categories/party');
      data.body.name.should.equal('Party');
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it('should get a playlists for a browse category', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/browse/categories/party/playlists');
      options.query.should.eql({
        country : 'SE',
        limit : 2,
        offset : 1
      });
      options.headers.Authorization.should.equal('Bearer myAccessToken');
      callback(null, {
        body : {
          playlists : {
            items : [ {
              href : 'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4k7EZPI3uKMz4aRRrLVfen'
            },
            {
              href : 'https://api.spotify.com/v1/users/spotifybrazilian/playlists/4HZh0C9y80GzHDbHZyX770'
            }
          ]}
        },
        statusCode : 200
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
      data.body.playlists.items[0].href.should.equal('https://api.spotify.com/v1/users/spotifybrazilian/playlists/4k7EZPI3uKMz4aRRrLVfen');
      data.body.playlists.items[1].href.should.equal('https://api.spotify.com/v1/users/spotifybrazilian/playlists/4HZh0C9y80GzHDbHZyX770');
      data.body.playlists.items.length.should.equal(2);
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it("should get the audio features for a track", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/audio-features/3Qm86XLflmIXVm1wcwkgDK');
      should.not.exist(options.query);
      should.not.exist(options.data);
      callback(null, {
        body : {
          danceability : 0,
          energy : 0
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK')
      .then(function(data) {
        should.exist(data.body.danceability);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get the audio features for a several tracks", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/audio-features');
      options.query.should.eql({
        ids : '3Qm86XLflmIXVm1wcwkgDK,1lDWb6b6ieDQ2xT7ewTC3G'
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          audio_features : [ ]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getAudioFeaturesForTracks(['3Qm86XLflmIXVm1wcwkgDK', '1lDWb6b6ieDQ2xT7ewTC3G'])
      .then(function(data) {
        should.exist(data.body.audio_features);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get recommendations", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/recommendations');
      options.query.should.eql({
        min_energy : 0.4,
        market : 'ES',
        seed_artists : '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ',
        limit : 5,
        min_popularity : 50
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          tracks:[ {} ],
          seeds:[ {} ]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getRecommendations({
        min_energy : 0.4,
        market : 'ES',
        seed_artists : '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ',
        limit : 5,
        min_popularity : 50
      })
      .then(function(data) {
        should.exist(data.body.tracks);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get recommendations using an array of seeds", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/recommendations');
      options.query.should.eql({
        min_energy : 0.4,
        market : 'ES',
        seed_artists : '6mfK6Q2tzLMEchAr0e9Uzu,4DYFVNKZ1uixa6SQTvzQwJ',
        limit : 5,
        min_popularity : 50
      });
      should.not.exist(options.data);
      callback(null, {
        body : {
          tracks:[ {} ],
          seeds:[ {} ]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getRecommendations({
        min_energy : 0.4,
        market : 'ES',
        seed_artists : ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
        limit : 5,
        min_popularity : 50
      })
      .then(function(data) {
        should.exist(data.body.tracks);
        done();
      }, function(err) {
        done(err);
      });
  });

  it("should get available genre seeds", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/recommendations/available-genre-seeds');
      should.not.exist(options.query);
      should.not.exist(options.data);
      callback(null, {
        body : {
          genres :[ ]
        }
      });
    });

    var api = new SpotifyWebApi();

    api.getAvailableGenreSeeds()
      .then(function(data) {
        should.exist(data.body.genres);
        done();
      }, function(err) {
        done(err);
      });
  });
});
