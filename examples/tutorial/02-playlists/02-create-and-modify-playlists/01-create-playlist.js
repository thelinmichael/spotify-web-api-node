/*

    Run with:

        export SPOTIFY_ACCESS_TOKEN="<Token content here>"
        node example/folder/file.js <Playlist Name>

    Playlist Name defaults to 'Test' if not provided.

*/
const SpotifyWebApi = require('../../../../');

const spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

const playlistName = process.argv.slice(2)[0] || 'Test';

(async () => {
  const playlist = await spotifyApi.createPlaylist(playlistName, {
    public: false
  });

  console.log(
    `Created Playlist '${playlistName}' with id '${playlist.body.id}'`
  );
  console.log(playlist);

})().catch(e => {
  console.error(e);
});
