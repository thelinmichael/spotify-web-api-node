## Change log

#### 2.4.0 (2 May 2017)
- Change `addTracksToPlaylist` to pass the data in the body, preventing an issue with a long URL when passing many tracks. Thanks [@dolcalmi](https://github.com/dolcalmi) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/117)
- Add support for fetching [recently played tracks](https://developer.spotify.com/web-api/console/get-recently-played/). Thanks [@jeremyboles](https://github.com/jeremyboles) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/111).

#### 2.3.6 (15 October 2016)
- Add language bindings for the **[Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/)** endpoint.

#### 2.3.5 (20 July 2016)
- Use `encodeURIComponent` instead of `encodeURI` to encode the user's id. 'encodeURI' wasn't encoding characters like `/` or `#` that were generating an invalid endpoint url. Thanks [@jgranstrom](https://github.com/jgranstrom) for the PR.

#### 2.3.4 (18 July 2016)
- Fixed a bug in `clientCredentialsGrant()`.

#### 2.3.3 (18 July 2016)
- Migrated to the `superagent` request library to support Node.JS and browsers. Thanks [@SomeoneWeird](https://github.com/SomeoneWeird) for the PR to add it, and [@erezny](https://github.com/erezny) for reporting bugs.

#### 2.3.2 (10 July 2016)
- Add language bindings for **[Get a List of Current User's Playlists](https://developer.spotify.com/web-api/get-a-list-of-current-users-playlists/)**. Thanks [@JMPerez](https://github.com/JMPerez) and [@vinialbano](https://github.com/vinialbano).

#### 2.3.1 (3 July 2016)
- Fix for `getRecomendations` method causing client error response from the API when making the request. Thanks [@kyv](https://github.com/kyv) for reporting, and [@Boberober](https://github.com/Boberober) and [@JMPerez](https://github.com/JMPerez) for providing fixes.

#### 2.3.0 (2 April 2016)
- Add language bindings for **[Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/)**, **[Get a User's Top Artists and Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/)**, **[Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/)**, and **[Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/)**. Read more about the endpoints in the links above or in this [blog post](https://developer.spotify.com/news-stories/2016/03/29/api-improvements-update/).
- Add generic search method enabling searches for several types at once, e.g. search for both tracks and albums in a single request, instead of one request for track results and one request for album results.

#### 2.2.0 (23 November 2015)
- Add language bindings for **[Get User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/)** and other endpoints related to the user's saved albums.

#### 2.1.1 (23 November 2015)
- Username encoding bugfix.

#### 2.1.0 (16 July 2015)
- Add language binding for **[Get Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/)**

#### 2.0.2 (11 May 2015)
- Bugfix for retrieving an access token through the Client Credentials flow. (Thanks [Nate Wilkins](https://github.com/Nate-Wilkins)!)
- Add test coverage and Travis CI.

#### 2.0.1 (2 Mar 2015)
- Return WebApiError objects if error occurs during authentication.

#### 2.0.0 (27 Feb 2015)
- **Breaking change**: Response object changed. Add headers and status code to all responses to enable users to implement caching.

#### 1.3.13 (26 Feb 2015)
- Add language binding for **[Reorder tracks in a Playlist](https://developer.spotify.com/web-api/reorder-playlists-tracks/)**

#### 1.3.12 (22 Feb 2015)
- Add language binding for **[Remove tracks in a Playlist by Position](https://developer.spotify.com/web-api/remove-tracks-playlist/)**

#### 1.3.11
- Add **[Search for Playlists](https://developer.spotify.com/web-api/search-item/)** endpoint.

#### 1.3.10
- Add market parameter to endpoints supporting **[Track Relinking](https://developer.spotify.com/web-api/track-relinking-guide/)**.
- Improve SEO by adding keywords to the package.json file. ;-)

#### 1.3.8
- Add **[Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/)**, **[Get a Category](https://developer.spotify.com/web-api/get-category/)**, and **[Get A Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/)** endpoints.

#### 1.3.7
- Add **[Check if Users are Following Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/)** endpoint.

#### 1.3.5
- Add missing options parameter in createPlaylist (issue #19). Thanks for raising this [allinallin](https://github.com/allinallin).

#### 1.3.4
- Add **[Follow Playlist](https://developer.spotify.com/web-api/follow-playlist/)** and **[Unfollow Playlist](https://developer.spotify.com/web-api/unfollow-playlist/)** endpoints.

#### 1.3.3
- [Fix](https://github.com/thelinmichael/spotify-web-api-node/pull/18) error format. Thanks [extrakt](https://github.com/extrakt).

#### 1.3.2
- Add ability to use callback methods instead of promise.

#### 1.2.2
- Bugfix. api.addTracksToPlaylist tracks parameter can be a string or an array. Thanks [ofagbemi](https://github.com/ofagbemi)!

#### 1.2.1
- Add **[Follow endpoints](https://developer.spotify.com/web-api/web-api-follow-endpoints/)**. Great work [JMPerez](https://github.com/JMPerez).

#### 1.1.0
- Add **[Browse endpoints](https://developer.spotify.com/web-api/browse-endpoints/)**. Thanks [fsahin](https://github.com/fsahin).

#### 1.0.2
- Specify module's git repository. Thanks [vincentorback](https://github.com/vincentorback).

#### 1.0.1
- Allow options to be set when retrieving a user's playlists. Thanks [EaterOfCode](https://github.com/EaterOfCode).

#### 1.0.0

- Add **[Replace tracks in a Playlist](https://developer.spotify.com/web-api/replace-playlists-tracks/)** endpoint
- Add **[Remove tracks in a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)** endpoint
- Return errors as Error objects instead of unparsed JSON. Thanks [niftylettuce](https://github.com/niftylettuce).

#### 0.0.11

- Add **[Change Playlist details](https://developer.spotify.com/web-api/change-playlist-details/)** endpoint (change published status and name). Gracias [JMPerez](https://github.com/JMPerez).

#### 0.0.10

- Add Your Music Endpoints (**[Add tracks](https://developer.spotify.com/web-api/save-tracks-user/)**, **[Remove tracks](https://developer.spotify.com/web-api/remove-tracks-user/)**, **[Contains tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/)**, **[Get tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/)**).
- Documentation updates (change scope name of playlist-modify to playlist-modify-public, and a fix to a parameter type). Thanks [JMPerez](https://github.com/JMPerez) and [matiassingers](https://github.com/matiassingers).

#### 0.0.9

- Add **[Related artists](https://developer.spotify.com/web-api/get-related-artists/)** endpoint
