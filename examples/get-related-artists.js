var SpotifyWebApi = require('../');

/*
 * This example shows how to get artists related to another artists. The endpoint is documented here:
 * https://developer.spotify.com/web-api/get-related-artists/

 * Please note that authorization is now required and so this example retrieves an access token using the Authorization Code Flow,
 * documented here: https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 */

var authorizationCode =
  'AQAgjS78s64u1axMCBCRA0cViW_ZDDU0pbgENJ_-WpZr3cEO7V5O-JELcEPU6pGLPp08SfO3dnHmu6XJikKqrU8LX9W6J11NyoaetrXtZFW-Y58UGeV69tuyybcNUS2u6eyup1EgzbTEx4LqrP_eCHsc9xHJ0JUzEhi7xcqzQG70roE4WKM_YrlDZO-e7GDRMqunS9RMoSwF_ov-gOMpvy9OMb7O58nZoc3LSEdEwoZPCLU4N4TTJ-IF6YsQRhQkEOJK';

/* Set the credentials given on Spotify's My Applications page.
 * https://developer.spotify.com/my-applications
 */
var spotifyApi = new SpotifyWebApi({
  clientId: '<insert client id>',
  clientSecret: '<insert client secret>',
  redirectUri: '<insert redirect URI>'
});

var artistId = '0qeei9KQnptjwb8MgkqEoy';

spotifyApi
.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    console.log('Retrieved access token', data.body['access_token']);

    // Set the access token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to retrieve information about the user connected to it
    return spotifyApi.getArtistRelatedArtists(artistId);
  })
  .then(function(data) {
    if (data.body.artists.length) {
      // Print the number of similar artists
      console.log('I got ' + data.body.artists.length + ' similar artists!');

      console.log('The most similar one is ' + data.body.artists[0].name);
    } else {
      console.log("I didn't find any similar artists.. Sorry.");
    }
  },
  function(err) {
    console.log('Something went wrong:', err.message);
  }
);
