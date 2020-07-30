const SpotifyWebApi = require('../');

/**
 * This example demonstrates adding tracks to a specified position in a playlist.
 *
 * Since authorization is required, this example retrieves an access token using the Authorization Code Grant flow,
 * documented here: https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 *
 * Codes are given for a set of scopes. For this example, the scopes are playlist-modify-public.
 * Scopes are documented here:
 * https://developer.spotify.com/documentation/general/guides/scopes/
 */

/* Obtain the `authorizationCode` below as described in the Authorization section of the README.
 */
const authorizationCode = '<insert authorization code>';

/**
 * Get the credentials from Spotify's Dashboard page.
 * https://developer.spotify.com/dashboard/applications
 */
const spotifyApi = new SpotifyWebApi({
  clientId: '<insert client id>',
  clientSecret: '<insert client secret>',
  redirectUri: '<insert redirect URI>'
});

// First retrieve an access token
spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.addTracksToPlaylist(
      '5ieJqeLJjjI8iJWaxeBLuK',
      [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ],
      {
        position: 10
      }
    );
  })
  .then(function(data) {
    console.log('Added tracks to the playlist!');
  })
  .catch(function(err) {
    console.log('Something went wrong:', err.message);
  });
