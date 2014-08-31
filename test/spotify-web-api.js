var SpotifyWebApi = require('../src/spotify-web-api'),
    should = require('should')
    fs = require('fs');

'use strict';

describe('Spotify Web API', function() {
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
    var api = new SpotifyWebApi();
    api.getTrack('3Qm86XLflmIXVm1wcwkgDK')
      .then(function(data) {
        done();
      }, function(err) {
        done(err);
      });
  });

  it.skip("should fail for non existing track id", function(done) {
    var api = new SpotifyWebApi();
    api.getTrack('idontexist')
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {
        'non existing id'.should.equal(err.message);
        done();
      });
  });

  it('should fail for empty track id', function(done) {
    var api = new SpotifyWebApi();
    api.getTrack()
      .then(function(data) {
        done(new Error('Should have failed'));
      }, function(err) {
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
        console.log(err);
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

  it("should get similar artists", function(done) {
    var api = new SpotifyWebApi();

    api.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy')
      .then(function(data) {
        should.exist(data.artists);
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
    'https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice'.should.equal(authorizeURL);
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

  /* Run this test with a valid access token with the user-library-modify scope */
  it.skip('should remove tracks in the users library', function(done) {
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

  /* Run this test with a valid access token with the user-library-modify scope */
  it.skip('should add tracks to the users library', function(done) {
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

  it('handles expired tokens', function(done) {
    var accessToken = "BQAGn9m9tRK96oUcc7962erAWydSShZ-geyZ1mcHSmDSfsoRKmhsz_g2ZZwBDlbRuKTUAb4RjGFFybDm0Kvv-7UNR608ff7nk0u9YU4nM6f9HeRhYXprgmZXQHhBKFfyxaVetvNnPMCBctf05vJcHbpiZBL3-WLQhScTrMExceyrfQ7g";
    var api = new SpotifyWebApi({
      accessToken : accessToken
    });

    api.addToMySavedTracks(['3VNWq8rTnQG6fM1eldSpZ0'])
    .then(function(data) {
      console.log(data);
      done(new Error('should have failed'));
    }, function(err) {
      err.message.should.equal('The access token expired');
      done();
    });

  })

});
