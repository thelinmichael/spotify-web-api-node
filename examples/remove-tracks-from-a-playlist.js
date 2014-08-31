var SpotifyWebApi = require("../");

/**
 * This example demonstrates removing tracks from a specified position in a playlist.
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
var authorizationCode = '<your authorization code with playlist-modify-public scope>';

/**
 * Set the credentials given on Spotify's My Applications page.
 * https://developer.spotify.com/my-applications
 */
var spotifyApi = new SpotifyWebApi({
  clientId : '<insert client id>',
  clientSecret : '<insert client secret>',
  redirectUri : '<insert redirect URI>'
});

var playlistId;

// First retrieve an access token
spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {

    console.log(data);
    // Save the access token so that it's used in future requests
    spotifyApi.setAccessToken(data['access_token']);

    // Create a playlist 
    return spotifyApi.createPlaylist('thelinmichael', 'My New Awesome Playlist');
  }).then(function(data) {
    console.log('Ok. Playlist created!');
    playlistId = data['id'];

    // Add tracks to the playlist
    return spotifyApi.addTracksToPlaylist('thelinmichael', playlistId, ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", 
      "spotify:track:6tcfwoGcDjxnSc6etAkDRR", 
      "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"]);

  }).then(function(data) {
    console.log('Ok. Tracks added!');


    // Woops! Made a duplicate. Remove one of the duplicates from the playlist
    return spotifyApi.removeTracksFromPlaylist('thelinmichael', playlistId, 
      [{
          'uri' : 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'positions' : [0]
      }])

  }).catch(function(err) {
    console.log(err);
    console.log('Something went wrong!');
  });
