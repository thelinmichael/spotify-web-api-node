var SpotifyWebApi = require("../");

/*
 * This example shows how to get artists related to another artists. The endpoint is documented here:
 * https://developer.spotify.com/web-api/get-related-artists/

 * Please note that this endpoint does not require authentication. However, using an access token
 * when making requests will give your application a higher rate limit.
 */

var spotifyApi = new SpotifyWebApi();


var artistId = '0qeei9KQnptjwb8MgkqEoy';

spotifyApi.getArtistRelatedArtists(artistId)
  .then(function(data) {

    if (data.body.artists.length) {
      // Print the number of similar artists
      console.log('I got ' + data.body.artists.length + ' similar artists!');

      console.log('The most similar one is ' + data.body.artists[0].name);
    } else {
      console.log('I didn\'t find any similar artists.. Sorry.');
    }

  }, function(err) {
    console.log('Something went wrong..', err.message);
  });