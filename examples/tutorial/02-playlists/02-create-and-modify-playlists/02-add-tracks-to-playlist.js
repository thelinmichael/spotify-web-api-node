/*

    Run with:

        export SPOTIFY_ACCESS_TOKEN="<Token content here>"
        node example/folder/file.js <Playlist Name>

    Playlist Name defaults to 'Test' if not provided.

*/
const SpotifyWebApi = require('../../../../');
const SpotifyWebApiTools = require('../../spotify-web-api-tools.js');

const spotifyApi = new SpotifyWebApi();
const swat = new SpotifyWebApiTools(spotifyApi);

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

const playlistName = process.argv.slice(2)[0] || 'Test';

(async () => {
  const playlist = await swat.findUserPlaylistByName(playlistName);
  console.log(`Using Playlist '${playlist.name}' with id '${playlist.id}'`);

  await spotifyApi.addTracksToPlaylist(
    playlist.id,
    [
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
      'spotify:track:1301WleyT98MSxVHPZCA6M'
    ],
    {
      position: 10
    }
  );
})().catch(e => {
  console.error(e);
});
