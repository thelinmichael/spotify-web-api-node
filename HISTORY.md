## Change log

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