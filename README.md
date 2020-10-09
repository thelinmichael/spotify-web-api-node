# Spotify Web API Node

[![Tests](https://travis-ci.org/thelinmichael/spotify-web-api-node.svg?branch=master)](https://travis-ci.org/thelinmichael/spotify-web-api-node)
[![Coverage Status](https://coveralls.io/repos/thelinmichael/spotify-web-api-node/badge.svg)](https://coveralls.io/r/thelinmichael/spotify-web-api-node)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/spotify-web-api-node.svg)](https://bundlephobia.com/result?p=spotify-web-api-node)

This is a universal wrapper/client for the [Spotify Web API](https://developer.spotify.com/web-api/) that runs on Node.JS and the browser, using [browserify](http://browserify.org/)/[webpack](https://webpack.github.io/)/[rollup](http://rollupjs.org/). A list of selected wrappers for different languages and environments is available at the Developer site's [Libraries page](https://developer.spotify.com/documentation/web-api/libraries/).

Project owners are [thelinmichael](https://github.com/thelinmichael) and [JMPerez](https://github.com/JMPerez), with help from [a lot of awesome contributors](https://github.com/thelinmichael/spotify-web-api-node/network/members).

## Version 5

> :warning: Since the last release (4.0.0, released over year ago) a lot of new functionality has been added by a lot of different contributors. **Thank you.** In order to implement some of the feature requests, some **breaking changes** had to be made. A list of them, along with a list of the new functionality, can be found in the [CHANGELOG](https://github.com/thelinmichael/spotify-web-api-node/blob/master/CHANGELOG.md). 

## Table of contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Development](#development)

## Features

The library includes helper functions to do the following:

#### Fetch music metadata

* Albums, artists, and tracks
* Audio features and analysis for tracks
* Albums for a specific artist
* Top tracks for a specific artist
* Artists similar to a specific artist

#### Profiles

* User's emails, product type, display name, birthdate, image

#### Search

* Albums, artists, tracks, and playlists

#### Playlist manipulation

* Get a user's playlists
* Create playlists
* Change playlist details
* Add tracks to a playlist
* Remove tracks from a playlist
* Replace tracks in a playlist
* Reorder tracks in a playlist

#### Your Music library

* Add, remove, and get tracks and albums that are in the signed in user's Your Music library
* Check if a track or album is in the signed in user's Your Music library 

#### Personalization

* Get a user’s top artists and tracks based on calculated affinity

#### Browse

* Get New Releases
* Get Featured Playlists
* Get a List of Categories
* Get a Category
* Get a Category's Playlists
* Get recommendations based on seeds
* Get available genre seeds

#### Player

* Get a User's Available Devices
* Get Information About The User's Current Playback State
* Get Current User's Recently Played Tracks
* Get the User's Currently Playing Track 
* Pause a User's Playback
* Seek To Position In Currently Playing Track
* Set Repeat Mode On User’s Playback
* Set Volume For User's Playback
* Skip User’s Playback To Next Track
* Skip User’s Playback To Previous Track 
* Start/Resume a User's Playback 
* Toggle Shuffle For User’s Playback
* Transfer a User's Playback

#### Follow

* Follow and unfollow users
* Follow and unfollow artists
* Check if the logged in user follows a user or artist
* Follow a playlist
* Unfollow a playlist
* Get followed artists
* Check if users are following a Playlist

#### Player

* Add an Item to the User's Playback Queue
* Get a user's available devices
* Get information about the user's current playback
* Get current user’s recently played tracks
* Transfer a user's playback
* Resume a user's playback
* Skip a user's playback to next track
* Skip a user's playback to previous track
* Set a user's shuffle mode
* Set a user's repeat mode
* Set volume
* Seek playback to a given position

#### Shows

* [Get a Show](https://developer.spotify.com/documentation/web-api/reference/shows/get-a-show/)

### Authentication

All methods require authentication, which can be done using these flows:

* [Client credentials flow](http://tools.ietf.org/html/rfc6749#section-4.4) (Application-only authentication)
* [Authorization code grant](http://tools.ietf.org/html/rfc6749#section-4.1) (Signed by user)
* [Implicit Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.2) (Client-side Authentication)

##### Dependencies

This project depends on [superagent](https://github.com/visionmedia/superagent) to make HTTP requests.

## Installation

    $ npm install spotify-web-api-node --save

## Usage

First, instantiate the wrapper.

```javascript
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri: 'http://www.example.com/callback'
});
```

If you've got an access token and want to use it for all calls, simply use the API object's set method. Handling credentials is described in detail in the Authorization section.

```javascript
spotifyApi.setAccessToken('<your_access_token>');
```

Lastly, use the wrapper's helper methods to make the request to Spotify's Web API. The wrapper uses promises, so you need to provide a success callback as well as an error callback.

```javascript
// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function(data) {
    console.log('Artist albums', data.body);
  },
  function(err) {
    console.error(err);
  }
);
```

If you dont wan't to use promises, you can provide a callback method instead.

```javascript
// Get Elvis' albums
spotifyApi.getArtistAlbums(
  '43ZHCT0cAZBISjO8DG9PnE',
  { limit: 10, offset: 20 },
  function(err, data) {
    if (err) {
      console.error('Something went wrong!');
    } else {
      console.log(data.body);
    }
  }
);
```

The functions that fetch data from the API also accept a JSON object with a set of options. For example, `limit` and `offset` can be used in functions that returns paginated results, such as search and retrieving an artist's albums.

Note that the **options** parameter is **required if you're using a callback method.**, even if it's empty.

```javascript
// Passing a callback - get Elvis' albums in range [20...29]
spotifyApi
  .getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', { limit: 10, offset: 20 })
  .then(
    function(data) {
      console.log('Album information', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
```

### Responses and errors

This exposes the response headers, status code and body. 

```json
{
  "body" : {

  },
  "headers" : {

  },
  "statusCode" :
}
```

Errors have same fields, as well as a human readable `message`. This is especially useful since 
Spotify's Web API returns different types of error objects depending on the endpoint being called.

#### Example of a response

Retrieving a track's metadata in `spotify-web-api-node` version 1.4.0 and later:

```json
{
  "body": {
    "name": "Golpe Maestro",
    "popularity": 42,
    "preview_url":
      "https://p.scdn.co/mp3-preview/4ac44a56e3a4b7b354c1273d7550bbad38c51f5d",
    "track_number": 1,
    "type": "track",
    "uri": "spotify:track:3Qm86XLflmIXVm1wcwkgDK"
  },
  "headers": {
    "date": "Fri, 27 Feb 2015 09:25:48 GMT",
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, max-age=7200"
  },
  "statusCode": 200
}
```

### More examples

Below are examples for all helper functions. Longer examples of some requests can be found in the [examples folder](examples/). 

```javascript
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();

/**
 * Get metadata of tracks, albums, artists, shows, and episodes
 */

// Get album
spotifyApi.getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
  .then(function(data) {
    console.log('Album information', data.body);
  }, function(err) {
    console.error(err);
  });

// Get multiple albums
spotifyApi.getAlbums(['5U4W9E5WsYb2jUQWePT8Xm', '3KyVcddATClQKIdtaap4bV'])
  .then(function(data) {
    console.log('Albums information', data.body);
  }, function(err) {
    console.error(err);
  });

// Get an artist
spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
  .then(function(data) {
    console.log('Artist information', data.body);
  }, function(err) {
    console.error(err);
  });

// Get multiple artists
spotifyApi.getArtists(['2hazSY4Ef3aB9ATXW7F5w3', '6J6yx1t3nwIDyPXk5xa7O8'])
  .then(function(data) {
    console.log('Artists information', data.body);
  }, function(err) {
    console.error(err);
  });

// Get albums by a certain artist
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });

// Search tracks whose name, album or artist contains 'Love'
spotifyApi.searchTracks('Love')
  .then(function(data) {
    console.log('Search by "Love"', data.body);
  }, function(err) {
    console.error(err);
  });

// Search artists whose name contains 'Love'
spotifyApi.searchArtists('Love')
  .then(function(data) {
    console.log('Search artists by "Love"', data.body);
  }, function(err) {
    console.error(err);
  });

// Search tracks whose artist's name contains 'Love'
spotifyApi.searchTracks('artist:Love')
  .then(function(data) {
    console.log('Search tracks by "Love" in the artist name', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
spotifyApi.searchTracks('track:Alright artist:Kendrick Lamar')
  .then(function(data) {
    console.log('Search tracks by "Alright" in the track name and "Kendrick Lamar" in the artist name', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });


// Search playlists whose name or description contains 'workout'
spotifyApi.searchPlaylists('workout')
  .then(function(data) {
    console.log('Found playlists are', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get tracks in an album
spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get an artist's top tracks
spotifyApi.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
  .then(function(data) {
    console.log(data.body);
    }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get artists related to an artist
spotifyApi.getArtistRelatedArtists('0qeei9KQnptjwb8MgkqEoy')
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    done(err);
  });

/* Get Audio Features for a Track */
spotifyApi.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK')
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    done(err);
  });

/* Get Audio Analysis for a Track */
spotifyApi.getAudioAnalysisForTrack('3Qm86XLflmIXVm1wcwkgDK')
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    done(err);
  });

/* Get Audio Features for several tracks */
spotifyApi.getAudioFeaturesForTracks(['4iV5W9uYEdYUVa79Axb7Rh', '3Qm86XLflmIXVm1wcwkgDK'])
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    done(err);
  });


/*
 * User methods
 */

// Get a user
spotifyApi.getUser('petteralexis')
  .then(function(data) {
    console.log('Some information about this user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get the authenticated user
spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/*
 * Playlist methods
 */

// Get a playlist
spotifyApi.getPlaylist('5ieJqeLJjjI8iJWaxeBLuK')
  .then(function(data) {
    console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get a user's playlists
spotifyApi.getUserPlaylists('thelinmichael')
  .then(function(data) {
    console.log('Retrieved playlists', data.body);
  },function(err) {
    console.log('Something went wrong!', err);
  });

// Create a private playlist
spotifyApi.createPlaylist('My playlist', { 'description': 'My description', 'public': true })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Add tracks to a playlist
spotifyApi.addTracksToPlaylist('5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Add tracks to a specific position in a playlist
spotifyApi.addTracksToPlaylist('5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"],
  {
    position : 5
  })
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Remove tracks from a playlist at a specific position
spotifyApi.removeTracksFromPlaylistByPosition('5ieJqeLJjjI8iJWaxeBLuK', [0, 2, 130], "0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9")
  .then(function(data) {
    console.log('Tracks removed from playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Remove all occurrence of a track
var tracks = [{ uri : "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" }];
var playlistId = '5ieJqeLJjjI8iJWaxeBLuK';
var options = { snapshot_id : "0wD+DKCUxiSR/WY8lF3fiCTb7Z8X4ifTUtqn8rO82O4Mvi5wsX8BsLj7IbIpLVM9" };
spotifyApi.removeTracksFromPlaylist(playlistId, tracks, options)
  .then(function(data) {
    console.log('Tracks removed from playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Reorder the first two tracks in a playlist to the place before the track at the 10th position
var options = { "range_length" : 2 };
spotifyApi.reorderTracksInPlaylist('5ieJqeLJjjI8iJWaxeBLuK', 0, 10, options)
  .then(function(data) {
    console.log('Tracks reordered in playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Change playlist details
spotifyApi.changePlaylistDetails('5ieJqeLJjjI8iJWaxeBLuK',
  {
    name: 'This is a new name for my Cool Playlist, and will become private',
    'public' : false
  }).then(function(data) {
     console.log('Playlist is now private!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Upload a custom playlist cover image
spotifyApi.uploadCustomPlaylistCoverImage('5ieJqeLJjjI8iJWaxeBLuK','longbase64uri')
  .then(function(data) {
     console.log('Playlsit cover image uploaded!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Follow a playlist (privately)
spotifyApi.followPlaylist('5ieJqeLJjjI8iJWaxeBLuK',
  {
    'public' : false
  }).then(function(data) {
     console.log('Playlist successfully followed privately!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Unfollow a playlist
spotifyApi.unfollowPlaylist('5ieJqeLJjjI8iJWaxeBLuK')
  .then(function(data) {
     console.log('Playlist successfully unfollowed!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Check if Users are following a Playlist
spotifyApi.areFollowingPlaylist('5ieJqeLJjjI8iJWaxeBLuK', ['thelinmichael', 'ella'])
 .then(function(data) {
    data.body.forEach(function(isFollowing) {
      console.log("User is following: " + isFollowing);
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/*
 * Following Users and Artists methods
 */

/* Get followed artists */
spotifyApi.getFollowedArtists({ limit : 1 })
  .then(function(data) {
      // 'This user is following 1051 artists!'
     console.log('This user is following ', data.body.artists.total, ' artists!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Follow a user */
spotifyApi.followUsers(['thelinmichael'])
  .then(function(data) {
     console.log(data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Follow an artist */
spotifyApi.followArtists(['2hazSY4Ef3aB9ATXW7F5w3', '6J6yx1t3nwIDyPXk5xa7O8'])
  .then(function(data) {
     console.log(data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Unfollow a user */
spotifyApi.unfollowUsers(['thelinmichael'])
  .then(function(data) {
     console.log(data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Unfollow an artist */
spotifyApi.unfollowArtists(['2hazSY4Ef3aB9ATXW7F5w3', '6J6yx1t3nwIDyPXk5xa7O8'])
  .then(function(data) {
     console.log(data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Check if a user is following a user */
let usersId = ['thelinmichael'];

spotifyApi.isFollowingUsers(usersId)
  .then(function(data) {
    let isFollowing = data.body;

    for (let index = 0; index < usersId.length; index++) {
      console.log(usersId[index] + ':' + isFollowing[index])
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Check if a user is following an artist */
let artistsId = ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'];

spotifyApi.isFollowingArtists(artistsId)
  .then(function(data) {
    let isFollowing = data.body;

    for (let index = 0; index < artistsId.length; index++) {
      console.log(artistsId[index] + ':' + isFollowing[index])
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/*
 * Your Music library methods
 */

/* Tracks */

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
    var trackIsInYourMusic = data.body[0];

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
spotifyApi.addToMySavedTracks(["3VNWq8rTnQG6fM1eldSpZ0"])
  .then(function(data) {
    console.log('Added track!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

/* Albums */

// Get albums in the signed in user's Your Music library
spotifyApi.getMySavedAlbums({
    limit : 1,
    offset: 0
  })
  .then(function(data) {
    // Output items
    console.log(data.body.items);
  }, function(err) {
    console.log('Something went wrong!', err);
  });


// Check if albums are in the signed in user's Your Music library
spotifyApi.containsMySavedAlbums(["1H8AHEB8VSE8irHViGOIrF"])
  .then(function(data) {

    // An array is returned, where the first element corresponds to the first album ID in the query
    var albumIsInYourMusic = data.body[0];

    if (albumIsInYourMusic) {
      console.log('Album was found in the user\'s Your Music library');
    } else {
      console.log('Album was not found.');
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Remove albums from the signed in user's Your Music library
spotifyApi.removeFromMySavedAlbums(["1H8AHEB8VSE8irHViGOIrF"])
  .then(function(data) {
    console.log('Removed!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

// Add albums to the signed in user's Your Music library
spotifyApi.addToMySavedAlbums(["1H8AHEB8VSE8irHViGOIrF"])
  .then(function(data) {
    console.log('Added album!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


/*
 * Browse methods
 */

  // Retrieve new releases
spotifyApi.getNewReleases({ limit : 5, offset: 0, country: 'SE' })
  .then(function(data) {
    console.log(data.body);
      done();
    }, function(err) {
       console.log("Something went wrong!", err);
    });
  });

//  Retrieve featured playlists
spotifyApi.getFeaturedPlaylists({ limit : 3, offset: 1, country: 'SE', locale: 'sv_SE', timestamp:'2014-10-23T09:00:00' })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log("Something went wrong!", err);
  });

// Get a List of Categories
spotifyApi.getCategories({
      limit : 5,
      offset: 0,
      country: 'SE',
      locale: 'sv_SE'
  })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log("Something went wrong!", err);
  });

// Get a Category (in Sweden)
spotifyApi.getCategory('party', {
      country: 'SE',
      locale: 'sv_SE'
  })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log("Something went wrong!", err);
  });

// Get Playlists for a Category (Party in Brazil)
spotifyApi.getPlaylistsForCategory('party', {
      country: 'BR',
      limit : 2,
      offset : 0
    })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log("Something went wrong!", err);
  });

// Get Recommendations Based on Seeds
spotifyApi.getRecommendations({
      min_energy: 0.4,
      seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
      min_popularity: 50
    })
  .then(function(data) {
    let recommendations = data.body;
    console.log(recommendations);
  }, function(err) {
    console.log("Something went wrong!", err);
  });

// Get available genre seeds
spotifyApi.getAvailableGenreSeeds()
  .then(function(data) {
    let genreSeeds = data.body;
    console.log(genreSeeds);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Player */

// Add an Item to the User's Playback Queue
// TBD

// Get a User's Available Devices
spotifyApi.getMyDevices()
  .then(function(data) {
    let availableDevices = data.body.devices;
    console.log(availableDevices);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get Information About The User's Current Playback State
spotifyApi.getMyCurrentPlaybackState()
  .then(function(data) {
    // Output items
    if (data.body && data.body.is_playing) {
      console.log("User is currently playing something!");
    } else {
      console.log("User is not playing anything, or doing so in private.");
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get Current User's Recently Played Tracks
spotifyApi.getMyRecentlyPlayedTracks({
  limit : 20
}).then(function(data) {
    // Output items
    console.log("Your 20 most recently played tracks are:");
    data.body.items.forEach(item => console.log(item.track));
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Get the User's Currently Playing Track 
spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {
    console.log('Now playing: ' + data.body.item.name);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Pause a User's Playback
spotifyApi.pause()
  .then(function() {
    console.log('Playback paused');
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Seek To Position In Currently Playing Track
spotifyApi.seek(positionMs)
  .then(function() {
    console.log('Seek to ' + positionMs);
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Set Repeat Mode On User’s Playback
spotifyApi.setRepeat('track')
  .then(function () {
    console.log('Repeat track.');
    }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Set Volume For User's Playback
spotifyApi.setVolume(50)
  .then(function () {
    console.log('Setting volume to 50.');
    }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Skip User’s Playback To Next Track
spotifyApi.skipToNext()
  .then(function() {
    console.log('Skip to next');
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Skip User’s Playback To Previous Track 
spotifyApi.skipToPrevious()
  .then(function() {
    console.log('Skip to previous');
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Start/Resume a User's Playback 
spotifyApi.play()
  .then(function() {
    console.log('Playback started');
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Toggle Shuffle For User’s Playback
spotifyApi.setShuffle(true)
  .then(function() {
    console.log('Shuffle is on.');
  }, function  (err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

// Transfer a User's Playback
spotifyApi.transferMyPlayback(deviceIds)
  .then(function() {
    console.log('Transfering playback to ' + deviceIds);
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });


/**
 * Personalization Endpoints
 */

/* Get a User’s Top Artists*/
spotifyApi.getMyTopArtists()
  .then(function(data) {
    let topArtists = data.body.items;
    console.log(topArtists);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/* Get a User’s Top Tracks*/
spotifyApi.getMyTopTracks()
  .then(function(data) {
    let topTracks = data.body.items;
    console.log(topTracks);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

```

### Chaining calls

```javascript
// track detail information for album tracks
spotifyApi
  .getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
  .then(function(data) {
    return data.body.tracks.map(function(t) {
      return t.id;
    });
  })
  .then(function(trackIds) {
    return spotifyApi.getTracks(trackIds);
  })
  .then(function(data) {
    console.log(data.body);
  })
  .catch(function(error) {
    console.error(error);
  });

// album detail for the first 10 Elvis' albums
spotifyApi
  .getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', { limit: 10 })
  .then(function(data) {
    return data.body.albums.map(function(a) {
      return a.id;
    });
  })
  .then(function(albums) {
    return spotifyApi.getAlbums(albums);
  })
  .then(function(data) {
    console.log(data.body);
  });
```

### Authorization
Supplying an access token is required for all requests to the Spotify API. This wrapper supports three authorization flows - The Authorization Code flow (signed by a user), the Client Credentials flow (application authentication - the user isn't involved), and the Implicit Grant Flow (For completely clientside applications). See Spotify's [Authorization guide](https://developer.spotify.com/spotify-web-api/authorization-guide/) for detailed information on these flows.

**Important: If you are writing a universal/isomorphic web app using this library, you will not be able to use  methods that send a client secret to the Spotify authorization service. Client secrets should be kept server-side and not exposed to client browsers. Never include your client secret in the public JS served to the browser.**

The first thing you need to do is to [create an application](https://developer.spotify.com/my-applications/). A step-by-step tutorial is offered by Spotify in this [tutorial](https://developer.spotify.com/spotify-web-api/tutorial/).

#### Authorization code flow

With the application created and its redirect URI set, the only thing necessary for the application to retrieve an **authorization code** is the user's permission. Which permissions you're able to ask for is documented in Spotify's [Using Scopes section](https://developer.spotify.com/spotify-web-api/using-scopes/).

In order to get permissions, you need to direct the user to [Spotify's Accounts service](https://accounts.spotify.com). Generate the URL by using the wrapper's authorization URL method.

```javascript
var scopes = ['user-read-private', 'user-read-email'],
  redirectUri = 'https://example.com/callback',
  clientId = '5fe01282e44241328a84e7c5cc169165',
  state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);
```

The example below uses a hardcoded authorization code, retrieved from the Accounts service as described above.

```javascript
var credentials = {
  clientId: 'someClientId',
  clientSecret: 'someClientSecret',
  redirectUri: 'http://www.michaelthelin.se/test-callback'
};

var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI
var code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code).then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);
```

Since the access token was set on the API object in the previous success callback, **it's going to be used in future calls**. As it was retrieved using the Authorization Code flow, it can also be refreshed.

```javascript
// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken().then(
  function(data) {
    console.log('The access token has been refreshed!');

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Could not refresh access token', err);
  }
);
```

#### Client Credential flow

The Client Credential flow doesn't require the user to give permissions, so it's suitable for requests where the application just needs to authenticate itself. This is the case with for example retrieving a playlist. However, note that the access token cannot be refreshed, and that it isn't connected to a specific user.

```javascript
var clientId = 'someClientId',
  clientSecret = 'someClientSecret';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
```

#### Implicit Grant flow

The Implicit Grant can be used to allow users to login to your completely client-side application. This method still requires a registered application, but won't expose your client secret.
This method of authentication won't return any refresh tokens, so you will need to fully reauthenticate the user everytime a token expires.

```javascript
var scopes = ['user-read-private', 'user-read-email'],
  redirectUri = 'https://example.com/callback',
  clientId = '5fe01282e44241328a84e7c5cc169165',
  state = 'some-state-of-my-choice',
  showDialog = true,
  responseType = 'token';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(
  scopes,
  state,
  showDialog,
  responseType
);

// https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=token&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true
console.log(authorizeURL);
```

When the client returns, it will have a token we can directly pass to the library:

```javascript
// The code that's returned as a hash fragment query string parameter to the redirect URI
var code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';
var credentials = {
  clientId: 'someClientId',
  clientSecret: 'someClientSecret',
  //Either here
  accessToken: code
};

var spotifyApi = new SpotifyWebApi(credentials);

//Or with a method
spotifyApi.setAccessToken(code);
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
  accessToken: 'myAccessToken',
  refreshToken: 'myRefreshToken',
  redirectUri: 'http://www.example.com/test-callback',
  'clientId ': 'myClientId',
  clientSecret: 'myClientSecret'
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
  clientId: 'myClientId',
  clientSecret: 'myClientSecret'
});

// Get an access token and 'save' it using a setter
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);
```

```javascript
// Set the credentials when making the request
var spotifyApi = new SpotifyWebApi({
  accessToken: 'njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3'
});

// Do search using the access token
spotifyApi.searchTracks('artist:Love').then(
  function(data) {
    console.log(data.body);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);
```

```javascript
// Set the credentials when making the request
var spotifyApi = new SpotifyWebApi({
  accessToken: 'njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3'
});

// Get tracks in a playlist
api
  .getPlaylistTracks('3ktAYNcRHpazJ9qecm3ptn', {
    offset: 1,
    limit: 5,
    fields: 'items'
  })
  .then(
    function(data) {
      console.log('The playlist contains these tracks', data.body);
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
```

## Development

See something you think can be improved? [Open an issue](https://github.com/thelinmichael/spotify-web-api-node/issues/new) or clone the project and send a pull request with your changes.

### Running tests

You can run the unit tests executing `npm test` and get a test coverage report running `npm test -- --coverage`.
