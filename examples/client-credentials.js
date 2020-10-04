const { util } = require('prettier');
var SpotifyWebApi = require('../');

/**
 * This example uses the Client Credentials authorization flow. 
 */

/**
 * Get the credentials from Spotify's Dashboard page.
 * https://developer.spotify.com/dashboard/applications
 */
const spotifyApi = new SpotifyWebApi({
  clientId: '<Client ID>',
  clientSecret: '<Client Secret>'
});

// Retrieve an access token using your credentials
spotifyApi.clientCredentialsGrant().
    then(function(result) {
        console.log('It worked! Your access token is: ' + result.body.access_token); 
    }).catch(function(err) {
        console.log('If this is printed, it probably means that you used invalid ' +
        'clientId and clientSecret values. Please check!');
        console.log('Hint: ');
        console.log(err);
    });
