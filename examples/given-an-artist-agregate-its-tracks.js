const SpotifyWebApi = require('../');

/**
 * This example retrieves the aggregated tracks for an artist by orchestrating calls to several API endpoints
 * https://developer.spotify.com/documentation/web-api/reference/#/
 */

/**
 * Since it's not necessary to get an access token connected to a specific user, this example
 * uses the Client Credentials flow. This flow uses only the client ID and the client secret.
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
 */

var clientId = 'your-client-id',
  clientSecret = 'your-client-secret';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }
).catch(err => console.log('Something went wrong when retrieving an access token', err))

function getArtistId(artistName){
  return spotifyApi.searchArtists(artistName)
  .then(resp => resp.body.artists.items[0].id)
  .catch(err => console.log(err))
}

function getAlbumIds(artistId) {
  return spotifyApi.getArtistAlbums(artistId, { limit: 2, offset: 0 })
    .then(data => data.body)
    .then(body => body.items)
    .then(items => items.map(element => element.id))
    .catch(err => console.log(err))
}

function getTracksFromAlbum(albumId) {
  return spotifyApi.getAlbumTracks(albumId)
};

async function getTracksFromArtist(artistName) {
  let artistId = await getArtistId(artistName)
  let albumIds = await getAlbumIds(artistId)
  // we wrap album ids into promises to fetch associated tracks from the API
  let trackPromises = albumIds.map(id => getTracksFromAlbum(id))
  // We resolve the promises with a fork...join approach
  return Promise.all(trackPromises)
}

const artistOfInterest = "Elvis"

// main
getTracksFromArtist(artistOfInterest)
  .then(resp => resp
    .map(e => e.body)
    .reduce((acc, x) => acc.concat(x.items), []) //Should work with a flatMap starting node11
    .map(e => e.name))
  .then(tracks => console.log(tracks))
  .catch(err => console.log(err))