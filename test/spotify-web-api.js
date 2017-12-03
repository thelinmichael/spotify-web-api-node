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

  it('should upload playlist cover image', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK');
      JSON.parse(options.data).should.eql('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')
      callback(null, { statusCode : 200 });
      should.not.exist(options.query);
    });

    var api = new SpotifyWebApi();
    api.setAccessToken('long-access-token');

    api.changePlaylistDetails('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', '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')
    .then(function(data) {
      (200).should.equal(data.statusCode);
      done();
    });
  });

  it('should add tracks to playlist', function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      uri.should.equal('https://api.spotify.com/v1/users/thelinmichael/playlists/5ieJqeLJjjI8iJWaxeBLuK/tracks');
      should.not.exist(options.query);
      JSON.parse(options.data)["uris"].should.be.an.instanceOf(Array).and.have.lengthOf(2);
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
      JSON.parse(options.data)["uris"].should.be.an.instanceOf(Array).and.have.lengthOf(2);
      options.query.should.eql({
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

  it("should get user's recently played tracks:", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/player/recently-played');
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

    api.getMyRecentlyPlayedTracks({ limit : 5})
      .then(function(data) {
        should.exist(data.body.items);
        done();
      });
  });

  it("should get user's devices:", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/player/devices');
      options.headers.should.eql({Authorization: 'Bearer someAccessToken'});
      callback(null, {
        body : {
          devices: [ ]
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken : 'someAccessToken'
    });

    api.getMyDevices()
      .then(function(data) {
        should.exist(data.body.devices);
        done();
      });
  });

  it("should get user's current playback status:", function(done) {
    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.get);
      uri.should.equal('https://api.spotify.com/v1/me/player');
      options.query.should.eql({
        market : "GB"
      });
      options.headers.should.eql({Authorization: 'Bearer someAccessToken'});
      callback(null, {
        body : {
          device: { }
        }
      });
    });

    var api = new SpotifyWebApi({
      accessToken : 'someAccessToken'
    });

    api.getMyCurrentPlaybackState({ market : "GB"})
      .then(function(data) {
        should.exist(data.body.device);
        done();
      });
  });

  it('should transfer the user\'s playback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/me/player');
      JSON.parse(options.data).should.eql({
        'device_ids': ['deviceId'],
        'play': true
      });
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.transferMyPlayback({
      deviceIds: ['deviceId'],
      play: true
    })
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should resume the user\'s playback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/me/player/play');
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.play()
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should pause the user\'s playback', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/me/player/pause');
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.pause()
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should skip the user\'s playback to next track', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      uri.should.equal('https://api.spotify.com/v1/me/player/next');
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.skipToNext()
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should skip the user\'s playback to previous track', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.post);
      uri.should.equal('https://api.spotify.com/v1/me/player/previous');
      should.not.exist(options.query);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.skipToPrevious()
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should set the user\'s playback repeat mode', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/me/player/repeat');
      should.exist(options.query);
      should.not.exist(options.body);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.setRepeat({state: 'off'})
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
        done(err);
      });

  });

  it('should set the user\'s playback shuffle mode', function(done) {

    sinon.stub(HttpManager, '_makeRequest', function(method, options, uri, callback) {
      method.should.equal(superagent.put);
      uri.should.equal('https://api.spotify.com/v1/me/player/shuffle');
      should.exist(options.query);
      should.not.exist(options.body);
      callback();
    });

    var accessToken = 'myAccessToken';

    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.setShuffle({state: 'false'})
      .then(function(data) {
        done();
      }, function(err) {
        console.log(err);
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
        state = 'some-state-of-my-choice',
        showDialog = true;

    var api = new SpotifyWebApi({
        clientId : clientId,
        redirectUri : redirectUri
    });

    var authorizeURL = api.createAuthorizeURL(scopes, state, showDialog);
    'https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true'.should.equal(authorizeURL);
  });

  it('should ignore entire show_dialog param if it is not included', function() {
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
      should.not.exist(options.query);
      JSON.parse(options.data)["uris"].should.be.an.instanceOf(Array).and.have.lengthOf(2);
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
      should.not.exist(options.query);
      JSON.parse(options.data)["uris"].should.be.an.instanceOf(Array).and.have.lengthOf(2);
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
