const SpotifyWebApi = require('../../../');
const SpotifyWebApiTools = require('../spotify-web-api-tools.js');

const spotifyApi = new SpotifyWebApi();
const swat = new SpotifyWebApiTools(spotifyApi);

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  let playlistArray = [];
  for await (let snippet of swat.processNextGenerator(
    spotifyApi.getUserPlaylists(),
    ['body']
  )) {
    playlistArray.push(...snippet);
  }

  const playlistNames = playlistArray.map(p => p.name);
  console.log(playlistNames);
})().catch(e => {
  console.error(e);
});
