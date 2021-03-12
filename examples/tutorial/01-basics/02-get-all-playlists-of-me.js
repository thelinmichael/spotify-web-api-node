const SpotifyWebApi = require('../../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  // Get first batch of playlists
  const playlist = await spotifyApi.getUserPlaylists();
  const allItems = [...playlist.body.items];

  // Get further paging objects
  let next = playlist.body.next;
  while(next) {
    const nextItems = await spotifyApi.getGeneric(next);
    next = nextItems.body.next;

    allItems.push(...nextItems.body.items);
  }

  // Display data
  let playlistNames = allItems.map(p => p.name);
  console.log(playlistNames);

})().catch(e => {
  console.error(e);
});
