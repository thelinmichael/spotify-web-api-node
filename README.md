Spotify Web API Node
==================

This is a Node.js wrapper for the [Spotify Web API](https://developer.spotify.com/spotify-web-api/). It includes helper functions to do:

- Album, artist, track, user, playlist lookup
- Album lookup for specific artist
- Top tracks for specific artist
- Album, artist and track search
- User's playlists
- Create a playlist
- Add tracks to a playlist (specific position in playlist still to be added)
- Authenticated (current) user lookup

Some methods require authentication, which can be done using these flows:

- [Client credentials flow](http://tools.ietf.org/html/rfc6749#section-4.4) (Application-only authentication)
- [Authorization code grant](http://tools.ietf.org/html/rfc6749#section-4.1) (Signed by user)

Even though authentication isn't always necessary, it always gives benefits such as an increased rate limit.

There's no caching implemented. [restler](https://github.com/danwrong/restler) is used to make HTTP requests, and [promise](https://github.com/then/promise) is used for [Promises/A+](http://promises-aplus.github.io/promises-spec/).

## Installation
This wrapper isn't currently on npm, so it needs to be cloned and linked to.

    $ git clone https://github.com/thelinmichael/spotify-web-api-node.git
    $ cd <your project directory>
    $ npm link <spotify-web-api-node directory>

## Usage

First, instantiate the wrapper.
```javascript
var spotifyApi = new SpotifyWebApi();
```

If you've got an access token and want to use it for all calls, simply use the api object's set method.
```javascript
spotifyApi.setAccessToken('<your_access_token>');
```

```javascript
// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data);
  }, function(err) {
    console.error(err);
  });
```

The functions that fetch data from the API also support an optional JSON object with a set of options, such as limit and offset which can be used to modify  pagination results. These options are sent as query parameters:

```javascript
// Passing a callback - get Elvis' albums in range [20...29]
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {limit: 10, offset: 20})
  .then(function(data) {
    console.log('Album information', data);
  }, function(err) {
    console.error(err);
  });
```

### Authorization

Supplying an access token in a request is not always required (see the [Endpoint reference](https://developer.spotify.com/spotify-web-api/endpoint-reference/) for details), but it will give your application benefits through an increased rate limit. This wrapper supports two authorization flows; The Authorization Code flow (signed by a user), and the Client Credentials flow (application authentication - the user isn't involved). See Spotify's [Authorization guide](https://developer.spotify.com/spotify-web-api/authorization-guide/) or for details.

The first thing you need to do is to [create an application](https://developer.spotify.com/my-applications/). A step-by-step tutorial is offered by Spotify in this [tutorial](https://developer.spotify.com/spotify-web-api/tutorial/).

### More examples

```javascript
// Get multiple albums
spotifyApi.getAlbums(['5U4W9E5WsYb2jUQWePT8Xm', '3KyVcddATClQKIdtaap4bV'])
  .then(function(data) {
    console.log('Albums information', data);
  }, function(err) {
    console.error(err);
  });

// Get an artist
spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
  .then(function(data) {
    console.log('Artist information', data);
  }, function(err) {
    console.error(err);
  });

// Get multiple artists
spotifyApi.getArtists(['2hazSY4Ef3aB9ATXW7F5w3', '6J6yx1t3nwIDyPXk5xa7O8'])
  .then(function(data) {
    console.log('Artists information', data);
  }, function(err) {
    console.error(err);
  });

// Get albums by a certain artist
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data);
  }, function(err) {
    console.error(err);
  });

// Search tracks whose name, album or artist contains 'Love'
spotifyApi.searchTracks('Love')
  .then(function(data) {
    console.log('Search by "Love"', data);
  }, function(err) {
    console.error(err);
  });

// Search artists whose name contains 'Love'
spotifyApi.searchArtists('Love')
  .then(function(data) {
    console.log('Search artists by "Love"', data);
  }, function(err) {
    console.error(err);
  });

// Search tracks whose artist's name contains 'Love'
spotifyApi.searchTracks('artist:Love')
  .then(function(data) {
    console.log('Search tracks by "Love" in the artist name', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get a user
spotifyApi.getUser('petteralexis')
  .then(function(data) {
    console.log('Some information about this user', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get the authenticated user
spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get a playlist
spotifyApi.getUserPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK')
  .then(function(data) {
    console.log('Some information about this playlist', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get a user's playlists
spotifyApi.getUserPlaylists('thelinmichael')
  .then(function(data) {
    console.log('Retrieved playlists', data);
  },function(err) {
    console.log('Something went wrong!', err);
  });

// Add tracks to a playlist
spotifyApi.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : true })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Create a playlist
spotifyApi.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

```

### Nesting calls
```javascript
// track detail information for album tracks
spotifyApi.getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
  .then(function(data) {
    return data.tracks.map(function(t) { return t.id; });
  })
  .then(function(trackIds) {
    return spotifyApi.getTracks(trackIds);
  })
  .then(function(tracksInfo) {
    console.log(tracksInfo);
  })
  .catch(function(error) {
    console.error(error);
  });

  // album detail for the first 10 Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {limit: 10})
  .then(function(data) {
    return data.albums.map(function(a) { return a.id; });
  })
  .then(function(albums) {
    return spotifyApi.getAlbums(albums);
  }).then(function(data) {
    console.log(data);
  });
```

