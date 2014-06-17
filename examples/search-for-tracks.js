var SpotifyWebApi = require("../");

/*
 * This example shows how to search for a track. The endpoint is documented here:
 * https://developer.spotify.com/web-api/search-item/

 * Please note that this endpoint does not require authentication. However, using an access token
 * when making requests will give your application a higher rate limit.
 */

var spotifyApi = new SpotifyWebApi();

spotifyApi.searchTracks('Love')
  .then(function(data) {

    // Print some information about the results
    console.log('I got ' + data.tracks.total + ' results!');

    // Go through the first page of results
    var firstPage = data.tracks.items;
    console.log('The tracks in the first page are.. (popularity in parentheses)');

    /*
     * 0: All of Me (97)
     * 1: My Love (91)
     * 2: I Love This Life (78)
     * ...
     */
    firstPage.forEach(function(track, index) {
      console.log(index + ': ' + track.name + ' (' + track.popularity + ')');
    });

  }, function(err) {
    console.error(err);
  });