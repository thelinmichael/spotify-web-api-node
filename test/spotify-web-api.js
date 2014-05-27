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

});