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

  // Get all Tracks
  const tracks = await swat.getAllPlaylistTracks(playlist.id);

  // Filter Local Tracks and save their Position
  const localTracks = {};
  tracks.forEach((track, position) => {
    if (track.is_local) {
      localTracks[position] = track;
    }
  });

  // Remove all occourences of the specified Track URIs
  for (let [position, track] of Object.entries(localTracks)) {
    console.log('Removing', position, track.track.uri);
    await spotifyApi.removeTracksFromPlaylistByPosition(playlist.id, [parseInt(position)], playlist.snapshot_id);
  }

})().catch(e => {
  console.error(e);
});
