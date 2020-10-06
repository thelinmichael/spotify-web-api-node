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

  const tracks = await swat.getAllPlaylistTracks(playlist.id);
  const localTracks = tracks.filter(t => t.is_local);

  console.log('This is a list of local files in your playlist:');
  for (track of localTracks) {
    console.log(track.track.uri);
  }

})().catch(e => {
  console.error(e);
});
