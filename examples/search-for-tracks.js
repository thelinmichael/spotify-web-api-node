const SpotifyWebApi = require('../');

/*
 * This example shows how to search for a track. The endpoint is documented here:
 * https://developer.spotify.com/documentation/web-api/reference/search/

 * Since authorization is now required, this example retrieves an access token using the Authorization Code Grant flow,
 * documented here: https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 *
 * Obtain the `authorizationCode` below as described in the Authorization section of the README.
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

(async () => {
  try {
    // Set the access token
    const authData = await spotifyApi.authorizationCodeGrant(authorizationCode);
    console.log('Retrieved access token', authData.body["access_token"]);

    // Use the access token to retrieve information about the user connected to it
    spotifyApi.setAccessToken(authData.body["access_token"]);
    const searchData = await spotifyApi.searchTracks("Love");

    // Print some information about the results
    console.log('I got ' + searchData.body.tracks.total + ' results!');

    // Go through the first page of results
    let firstPage = searchData.body.tracks.items;
    console.log('The tracks in the first page are (popularity in parentheses):');

    /*
     * 0: All of Me (97)
     * 1: My Love (91)
     * 2: I Love This Life (78)
     * ...
     */
    firstPage.forEach((track, index) => {
      console.log(index + ': ' + track.name + ' (' + track.popularity + ')');
    });
  } catch (err) {
    console.log('Something went wrong:', err.message);
  }
})();
