const SpotifyWebApi = require('../../../../');
const SpotifyWebApiTools = require('../../spotify-web-api-tools.js');

const spotifyApi = new SpotifyWebApi();
const swat = new SpotifyWebApiTools(spotifyApi);

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const playlist = (await spotifyApi.getUserPlaylists()).body.items[0];
  console.log(
    `Getting playlist ${playlist.name} with ${playlist.tracks.total} tracks.`
  );

  const tracks = await swat.getAllPlaylistTracks(playlist.id);

  console.log(`Got ${tracks.length} in total:`);
  console.log(tracks.map(t => `${t.track.artists[0].name} - ${t.track.name}`));
})().catch(e => {
  console.error(e);
});
