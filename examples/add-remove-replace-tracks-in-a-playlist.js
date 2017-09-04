var SpotifyWebApi = require('../');

/**
 * This example demonstrates adding tracks, removing tracks, and replacing tracks in a playlist. At this time of writing this
 * documentation, this is the available playlist track modification features in the Spotify Web API.
 *
 * Since authorization is required, this example retrieves an access token using the Authorization Code Grant flow,
 * documented here: https://developer.spotify.com/spotify-web-api/authorization-guide/#authorization_code_flow
 *
 * Codes are given for a set of scopes. For this example, the scopes are playlist-modify-public.
 * Scopes are documented here:
 * https://developer.spotify.com/spotify-web-api/using-scopes/
 */

/* This code is hardcoded. For a working implementation, the code needs to be retrieved from the user. See documentation about
 * the Authorization Code flow for more information.
 */
var authorizationCode =
  '<insert authorization code with playlist-modify-public scope>';

/**
 * Set the credentials given on Spotify's My Applications page.
 * https://developer.spotify.com/my-applications
 */
var spotifyApi = new SpotifyWebApi({
  clientId: '<insert client id>',
  clientSecret: '<insert client secret>',
  redirectUri: '<insert redirect URI>'
});

var playlistId;

// First retrieve an access token
spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    // Save the access token so that it's used in future requests
    spotifyApi.setAccessToken(data['access_token']);

    // Create a playlist
    return spotifyApi.createPlaylist(
      'thelinmichael',
      'My New Awesome Playlist'
    );
  })
  .then(function(data) {
    console.log('Ok. Playlist created!');
    playlistId = data.body['id'];

    // Add tracks to the playlist
    return spotifyApi.addTracksToPlaylist('thelinmichael', playlistId, [
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
      'spotify:track:6tcfwoGcDjxnSc6etAkDRR',
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh'
    ]);
  })
  .then(function(data) {
    console.log('Ok. Tracks added!');

    // Woops! Made a duplicate. Remove one of the duplicates from the playlist
    return spotifyApi.removeTracksFromPlaylist('thelinmichael', playlistId, [
      {
        uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        positions: [0]
      }
    ]);
  })
  .then(function(data) {
    console.log('Ok. Tracks removed!');

    // Actually, lets just replace all tracks in the playlist with something completely different
    return spotifyApi.replaceTracksInPlaylist('thelinmichael', playlistId, [
      'spotify:track:5Wd2bfQ7wc6GgSa32OmQU3',
      'spotify:track:4r8lRYnoOGdEi6YyI5OC1o',
      'spotify:track:4TZZvblv2yzLIBk2JwJ6Un',
      'spotify:track:2IA4WEsWAYpV9eKkwR2UYv',
      'spotify:track:6hDH3YWFdcUNQjubYztIsG'
    ]);
  })
  .then(function(data) {
    console.log('Ok. Tracks replaced!');
  })
  .catch(function(err) {
    console.log(err.message);
    console.log('Something went wrong!');
  });
