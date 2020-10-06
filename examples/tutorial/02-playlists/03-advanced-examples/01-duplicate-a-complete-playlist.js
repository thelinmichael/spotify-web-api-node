/*

    Run with:

        export SPOTIFY_ACCESS_TOKEN="<Token content here>"
        node example/folder/file.js <Playlist Name>

    Playlist Name defaults to 'Test' if not provided.

*/
const https = require('https');
const SpotifyWebApi = require('../../../../');
const SpotifyWebApiTools = require('../../spotify-web-api-tools.js');

const spotifyApi = new SpotifyWebApi();
const swat = new SpotifyWebApiTools(spotifyApi);

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

const playlistName = process.argv.slice(2)[0] || 'Test';

(async () => {
  // Find Playlist by Name
  const playlist = await swat.findUserPlaylistByName(playlistName);
  console.log(`Using Playlist '${playlist.name}' with id '${playlist.id}'`);

  // Get Tracks from old Playlist and filter local tracks
  const tracks = (await swat.getAllPlaylistTracks(playlist.id)).filter(t => !t.is_local);
  console.log(`Found ${tracks.length} tracks in Playlist`);

  // Get Cover Image
  const coverImageUrl = playlist.images[0].url;
  const coverImageBase64 = await getImageFromUrlAsBase64(coverImageUrl);

  // Create new Playlist
  const newPlaylist = await spotifyApi.createPlaylist(
    playlistName + ' (duplicate)',
    {
      public: false,
      description: playlist.description
    }
  );
  const newPlaylistId = newPlaylist.body.id;
  console.log(
    `Created Playlist '${newPlaylist.body.name}' with id '${newPlaylistId}'`
  );

  // Add Tracks to new Playlist (add max. 100 Tracks per Request according do API Spec)
  const trackUris = tracks.map(t => t.track.uri);
  const chunkLength = 100;
  for (let i = 0; i < trackUris.length; i += chunkLength) {
    const chunk = trackUris.slice(i, i + chunkLength);
    await spotifyApi.addTracksToPlaylist(newPlaylistId, chunk);
  }
  console.log('Added Tracks to new Playlist');

  // Upload Cover Image
  await spotifyApi.uploadCustomPlaylistCoverImage(
    newPlaylistId,
    coverImageBase64
  );
  console.log('Uploaded old Cover Image to new Playlist');
})().catch(e => {
  console.error(e);
});

function getImageFromUrlAsBase64(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        const contentType = res.headers['content-type'];
        if (contentType !== 'image/jpeg') {
          throw new Error('Wrong content-type: ' + contentType);
        }

        const data = [];
        res.on('data', chunk => {
          data.push(chunk);
        });
        res.on('end', () => {
          resolve(Buffer.concat(data).toString('base64'));
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
}
