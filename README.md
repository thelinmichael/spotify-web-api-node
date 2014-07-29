Spotify Web API Node
==================

This is a Node.js wrapper/client for the [Spotify Web API](https://developer.spotify.com/web-api/). It includes helper functions to do the following:

- Get albums, artists, tracks, users and playlists
- Get albums for a specific artist
- Get an artist's top tracks
- Get artists similar to a given artist
- Search albums, artists and tracks
- Get a user's playlists (currently non-collaborative)
- Create playlists
- Add tracks to a playlist
- Change playlist details
- Add, remove, and get tracks that are in the signed in user's Your Music library
- Check if a track is in the signed in user's Your Music library

Some methods require authentication, which can be done using these flows:

- [Client credentials flow](http://tools.ietf.org/html/rfc6749#section-4.4) (Application-only authentication)
- [Authorization code grant](http://tools.ietf.org/html/rfc6749#section-4.1) (Signed by user)

Even though authentication isn't always necessary, it always gives benefits such as an increased rate limit.

##### Dependencies

This project depends on [restler](https://github.com/danwrong/restler) to make HTTP requests, and [promise](https://github.com/then/promise) as its [Promises/A+](http://promises-aplus.github.io/promises-spec/) implementation.

## Installation

    $ npm install spotify-web-api-node --save

## Usage

First, instantiate the wrapper.
```javascript
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret : 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri : 'http://www.example.com/callback'
});
```

If you've got an access token and want to use it for all calls, simply use the api object's set method. Handling credentials is described in detail in the Authorization section.
```javascript
spotifyApi.setAccessToken('<your_access_token>');
```

Lastly, use the wrapper's helper methods to make the request to Spotify's Web API. The wrapper uses promises, so you need to provide a success callback as well as an error callback.
```javascript
// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data);
  }, function(err) {
    console.error(err);
  });
```

The functions that fetch data from the API also support an optional JSON object with a set of options. For example, limit and offset can be used in functions that returns paginated results, such as search and retrieving an artist's albums.

```javascript
// Passing a callback - get Elvis' albums in range [20...29]
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {limit: 10, offset: 20})
  .then(function(data) {
    console.log('Album information', data);
  }, function(err) {
    console.error(err);
  });
```

### More examples

Below are examples for all helper functions. Longer examples can be found in the [examples folder](examples/).

```javascript
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();

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

// Get tracks in an album
spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get an artist's top tracks
spotifyApi.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
  .then(function(data) {
    console.log(data);
    }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get artists related to an artist
spotifyApi.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy')
  .then(function(data) {
    console.log(data);
  }, function(err) {
    done(err);
  });

/*
 * User methods
 */

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

/*
 * Playlist methods
 */

// Get a playlist
spotifyApi.getPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK')
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

// Create a playlist
spotifyApi.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : true })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Add tracks to a playlist
spotifyApi.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Add tracks to a specific position in a playlist
spotifyApi.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"],
  {
    position : 5
  })
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Change playlist details
spotifyApi.changePlaylistDetails('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', 
  {
    name: 'This is a new name for my Cool Playlist, and will become private',
    'public' : false
  }).then(function(data) {
     console.log('Playlist is now private!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/*
 * Your Music library methods
 */

// Get tracks in the signed in user's Your Music library
spotifyApi.getMySavedTracks({
    limit : 2,
    offset: 1 
  })
  .then(function(data) {
    console.log('Done!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });


// Check if tracks are in the signed in user's Your Music library
spotifyApi.containsMySavedTracks(["5ybJm6GczjQOgTqmJ0BomP"])
  .then(function(data) {

    // An array is returned, where the first element corresponds to the first track ID in the query
    var trackIsInYourMusic = data[0];

    if (trackIsInYourMusic) {
      console.log('Track was found in the user\'s Your Music library');
    } else {
      console.log('Track was not found.');
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Remove tracks from the signed in user's Your Music library
spotifyApi.removeFromMySavedTracks(["3VNWq8rTnQG6fM1eldSpZ0"])
  .then(function(data) {
    console.log('Removed!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

// Add tracks to the signed in user's Your Music library
api.addToMySavedTracks(["3VNWq8rTnQG6fM1eldSpZ0"])
  .then(function(data) {
    console.log('Added track!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
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

### Authorization

Supplying an access token in a request is not always required by the API (see the [Endpoint reference](https://developer.spotify.com/spotify-web-api/endpoint-reference/) for details), but it will give your application benefits such as a higher rate limit. This wrapper supports two authorization flows; The Authorization Code flow (signed by a user), and the Client Credentials flow (application authentication - the user isn't involved). See Spotify's [Authorization guide](https://developer.spotify.com/spotify-web-api/authorization-guide/) for detailed information on these flows.

The first thing you need to do is to [create an application](https://developer.spotify.com/my-applications/). A step-by-step tutorial is offered by Spotify in this [tutorial](https://developer.spotify.com/spotify-web-api/tutorial/).

#### Authorization code flow

With the application created and its redirect URI set, the only thing necessary for the application to retrieve an **authorization code** is the user's permission. Which permissions you're able to ask for is documented in Spotify's [Using Scopes section](https://developer.spotify.com/spotify-web-api/using-scopes/).

In order to get permissions, you need to direct the user to our Accounts service. Generate the URL by using the wrapper's authorization URL method.

```javascript
var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'https://example.com/callback',
    clientId = '5fe01282e44241328a84e7c5cc169165',
    state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri : redirectUri,
  clientId : clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);
```

The example below uses a hardcoded authorization code, retrieved from the Accounts service as described above.

```javascript
var credentials = {
  clientId : 'someClientId',
  clientSecret : 'someClientSecret',
  redirectUri : 'http://www.michaelthelin.se/test-callback'
};

var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI
var code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data['expires_in']);
    console.log('The access token is ' + data['access_token']);
    console.log('The refresh token is ' + data['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data['access_token']);
    spotifyApi.setRefreshToken(data['refresh_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
```

Since the access token was set on the api object in the previous success callback, **it's going to be used in future calls**. As it was retrieved using the Authorization Code flow, it can also be refreshed unless it has expired.

```javascript
// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken()
  .then(function(data) {
    console.log('The access token has been refreshed!');
  }, function(err) {
    console.log('Could not refresh access token', err);
  });
```

#### Client Credential flow

The Client Credential flow doesn't require the user to give permissions, so it's suitable for requests where the application just needs to authenticate itself. This is the case with for example retrieving a playlist. However, note that the access token cannot be refreshed, and that it isn't connected to a specific user.

```javascript
var clientId = 'someClientId',
    clientSecret = 'someClientSecret';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data['expires_in']);
    console.log('The access token is ' + data['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data['access_token']);
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });
```

#### Setting credentials

Credentials are either set when constructing the API object or set after the object has been created using setters. They can be set all at once or one at a time.

Using setters, getters and resetters.
```javascript
// Use setters to set all credentials one by one
var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('myAccessToken');
spotifyApi.setRefreshToken('myRefreshToken');
spotifyApi.setRedirectURI('http://www.example.com/test-callback');
spotifyApi.setClientId('myOwnClientId');
spotifyApi.setClientSecret('someSuperSecretString');

// Set all credentials at the same time
spotifyApi.setCredentials({
  'accessToken' : 'myAccessToken',
  'refreshToken' : 'myRefreshToken',
  'redirectUri' : 'http://www.example.com/test-callback',
  'clientId ' : 'myClientId',
  'clientSecret' : 'myClientSecret'
});

// Get the credentials one by one
console.log('The access token is ' + spotifyApi.getAccessToken());
console.log('The refresh token is ' + spotifyApi.getRefreshToken());
console.log('The redirectURI is ' + spotifyApi.getRedirectURI());
console.log('The client ID is ' + spotifyApi.getClientId());
console.log('The client secret is ' + spotifyApi.getClientSecret());

// Get all credentials
console.log('The credentials are ' + spotifyApi.getCredentials());

// Reset the credentials
spotifyApi.resetAccessToken();
spotifyApi.resetRefreshToken();
spotifyApi.resetRedirectURI();
spotifyApi.resetClientId();
spotifyApi.resetClientSecret();
spotifyApi.resetCode();

// Reset all credentials at the same time
spotifyApi.resetCredentials();
```

Using the constructor.
```javascript
// Set necessary parts of the credentials on the constructor
var spotifyApi = new SpotifyWebApi({
  clientId : 'myClientId',
  clientSecret : 'myClientSecret'
});

// Get an access token and 'save' it using a setter
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token is ' + data['access_token']);
    spotifyApi.setAccessToken(data['access_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
```

```javascript
// Set the credentials when making the request
var spotifyApi = new SpotifyWebApi({
  accessToken : 'njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3'
});

// Do search using the access token
spotifyApi.searchTracks('artist:Love')
  .then(function(data) {
    console.log(data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
```

```javascript
// Set the credentials when making the request
var spotifyApi = new SpotifyWebApi({
  accessToken : 'njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3'
});

// Get tracks in a playlist
api.getPlaylistTracks('thelinmichael', '3ktAYNcRHpazJ9qecm3ptn', { 'fields' : 'items' })
  .then(function(data) {
    console.log('The playlist contains these tracks', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
```

## Change log

#### 0.0.11

- Add Change Playlist details endpoint (change published status and name). Gracias [JMPerez](https://github.com/JMPerez).

#### 0.0.10

- Add Your Music Endpoints (add tracks, remove tracks, contains tracks, get tracks).
- Documentation updates (change scope name of playlist-modify to playlist-modify-public, and a fix to a parameter type). Thanks [JMPerez](https://github.com/JMPerez) and [matiassingers](https://github.com/matiassingers).

#### 0.0.9

- Add [Related artists](https://developer.spotify.com/web-api/get-related-artists/) endpoint


## Future development

- Optional caching
- Increased test coverage
