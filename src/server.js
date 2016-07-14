var SpotifyWebApi = require('./spotify-web-api');
var ServerMethods = require('./server-methods');
SpotifyWebApi._addMethods(ServerMethods);
module.exports = SpotifyWebApi;
