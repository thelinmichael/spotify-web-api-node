## Change log

#### 5.0.2 (Jan 2021)

* Fix: Make `transferMyPlayback` not require the `options` object, since it should be optional. Thanks for the heads-up [@Simber1](https://github.com/Simber1)! 

#### 5.0.1 (Jan 2021)

* Fix error handling in the HTTP client. Thanks [@yamadapc](https://github.com/yamadapc)!
* This package can currently not be built on **Node 15 on Linux**, due to a dependency not being available yet. Issue can be followed on the [node-canvas](https://github.com/Automattic/node-canvas/issues/1688) issue tracker. In the mean time, Travis CI will run on earlier versions of Node.   

#### 5.0.0 (Oct 2020)

* **BREAKING CHANGES**. 
  * Arguments for some API methods have changed, causing incorrect behaviour using argument order from version 4.x. See the `README.md` for examples of how the methods can be used.
    * Create Playlist (`createPlaylist`) method no longer accepts a `userId` string as its first argument. 
    * Transfer A User's Playback (`transferMyPlayback`) method takes a `deviceIds` array as its first argument. 
    * Skip to Previous (`skipToPrevious`) method takes an `options` object as its first argument.
    * Skip to Next (`skipToNext`) method takes an `options` object as its first argument.
    * Set Repeat Mode on the Current User's Playback (`setRepeat`) method takes a `state` string as its first argument.
    * Set Shuffle Mode on the Current User's Playback (`setShuffle`) method takes a `state` string as its first argument.
    
    Cheers [@marinacrachi](https://github.com/marinacrachi) for the createPlaylist update.
  * Removed legacy support for not passing an `options` object while providing a callback method. This was only supported on a few of the older endpoints, and could lead to tricky bugs. The affected endpoints are `getTrack`, `getTracks`, `getAlbum`, `getAlbums`, and  `createPlaylist`. Again, check the `README.md` for examples on how these methods can be used if needed.
  * Removed `options` argument for retrieving an access token using the Client Credentials flow, `clientCredentialsGrant`.
  * API errors come in five different flavours.
    * WebapiRegularError - For errors returned by most API endpoints.
    * WebapiPlayerError - For errors returned by the Player API. These contain a bit more information. 
    * WebapiAuthenticationError - For errors related to authentication.
    * WebapiError - For errors that come from the Web API that didn't fit into one of the above.
    * TimeoutError - For network timeout errors.
    
    More importantly, errors now contain the response body, headers, and status code. One side-effect of this is that rate limited requests can be handled by checking the `Retry-After` header. Thanks for the PRs [@kauffecup](https://github.com/kauffecup), [@lantelyes](https://github.com/lantelyes), [@dkliemsch](https://github.com/dkliemsch), and [@erezny](https://github.com/erezny).
    
    Much appreciated [@konstantinjdobler](https://github.com/konstantinjdobler) for updates to the Player API errors.
* Added support for [Implicit Grant flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow) - Thanks [@gaganza](https://github.com/gaganza), [@reblws](https://github.com/reblws) and [@noahp78](https://github.com/noahp78)!
* Starts or Resumes the Current User's Playback (`play`) method now supports the `position_ms` option. Thanks [@alqubo](https://github.com/alqubo), [@koflin](https://github.com/koflin), [@DoctorFishy](https://github.com/DoctorFishy). Thanks [@carmilso](https://github.com/carmilso) for general improvements to the Player API methods.
* Binding for [Add an Item to the User's Playback Queue](https://developer.spotify.com/documentation/web-api/reference/player/add-to-queue/) endpoint added. Thanks [@thattomperson](https://github.com/thattomperson) and [@AriciducaZagaria](https://github.com/AriciducaZagaria)!
* Binding for all [Shows and Episodes endpoints](https://developer.spotify.com/console/shows/). Thanks a _lot_ [@andyruwruw](https://github.com/andyruwruw)! 
* Documentation updates to keep up to date with ES6, thanks [@dandv](https://github.com/dandv)! Other documentation improvements by [@terensu-desu](https://github.com/terensu-desu), and examples by [@dersimn](https://github.com/dersimn). Thanks!
* Bumped dependencies to resolve critical security issues. 
* Finally, hat off to [@dersimn](https://github.com/dersimn). Thanks for collecting all of the lingering PRs and merging them into a  working and up-to-date fork. You really stepped up. 

Likely more changes coming before release to npm, which will happen shortly. 

#### 4.0.0 (14 Sep 2018)

* Modified functions that operate on playlists to drop the user id parameter. This is a breaking change. [PR](https://github.com/thelinmichael/spotify-web-api-node/pull/243)
* Updated superagent to fix a security warning [PR](https://github.com/thelinmichael/spotify-web-api-node/pull/211)
* Fixed a bug by which an empty user was not handled properly in getUserPlaylists(). [PR](https://github.com/thelinmichael/spotify-web-api-node/pull/244)

#### 3.1.1 (29 Apr 2018)

* Modernized stack for a better developer experience. Integrated [prettier](https://github.com/thelinmichael/spotify-web-api-node/pull/205) and [jest](https://github.com/thelinmichael/spotify-web-api-node/pull/206). This simplifies the amount of dev dependencies.
* Improved calls to save and remove saved tracks by adding a key as specified in the Spotify docs (See [PR](https://github.com/thelinmichael/spotify-web-api-node/pull/207)). Thanks to [@yanniz0r](https://github.com/yanniz0r) and [@adcar](https://github.com/adcar) for bringing it up.

#### 3.1.0 (26 Apr 2018)

* Added support for seeking and setting volume. Thanks to [@isokar](https://github.com/isokar), [@jamesemwallis](https://github.com/jamesemwallis), [@ashthespy](https://github.com/ashthespy), and [@vanderlin](https://github.com/vanderlin) for your PRs.

#### 3.0.0 (8 Mar 2018)

* @DalerAsrorov added support for uploading a custom image to a playlist in [this PR](https://github.com/thelinmichael/spotify-web-api-node/pull/169).
* You can now pass a `device_id` when playing and pausing playback. @pfftdammitchris started [a PR to add device_id to the play() method](https://github.com/thelinmichael/spotify-web-api-node/pull/185). The changes served to another PR where we included the functionality. Thanks!
* Added documentation in the README for `getMyCurrentPlaybackState()`. Thanks @PanMan for [your PR](https://github.com/thelinmichael/spotify-web-api-node/pull/160)!
* @brodin realized we there was a lot of duplicated code and refactored it in a [great PR](https://github.com/thelinmichael/spotify-web-api-node/pull/123).

#### 2.5.0 (4 Sep 2017)

* Change README to reflect new authorization. Thanks [@arirawr](https://github.com/arirawr) for the [PR](https://github.com/thelinmichael/spotify-web-api-node/pull/146).
* Add support for 'show_dialog' parameter when creating authorization url. Thanks [@ajhaupt7](https://github.com/ajhaupt7) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/101).
* Add support for playback control (play, pause, prev, next), shuffle and repeat. Thanks [@JoseMCO](https://github.com/JoseMCO) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/150).
* Add support for currently playing. Thanks [@dustinblackman](https://github.com/dustinblackman) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/145).
* Fix to remove unnecessary deviceIds parameter from request to transfer playback. Thanks [@philnash](https://github.com/philnash) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/154).

#### 2.4.0 (2 May 2017)

* Change `addTracksToPlaylist` to pass the data in the body, preventing an issue with a long URL when passing many tracks. Thanks [@dolcalmi](https://github.com/dolcalmi) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/117)
* Add support for fetching [recently played tracks](https://developer.spotify.com/web-api/console/get-recently-played/). Thanks [@jeremyboles](https://github.com/jeremyboles) for [the PR](https://github.com/thelinmichael/spotify-web-api-node/pull/111).

#### 2.3.6 (15 October 2016)

* Add language bindings for the **[Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/)** endpoint.

#### 2.3.5 (20 July 2016)

* Use `encodeURIComponent` instead of `encodeURI` to encode the user's id. 'encodeURI' wasn't encoding characters like `/` or `#` that were generating an invalid endpoint url. Thanks [@jgranstrom](https://github.com/jgranstrom) for the PR.

#### 2.3.4 (18 July 2016)

* Fixed a bug in `clientCredentialsGrant()`.

#### 2.3.3 (18 July 2016)

* Migrated to the `superagent` request library to support Node.JS and browsers. Thanks [@SomeoneWeird](https://github.com/SomeoneWeird) for the PR to add it, and [@erezny](https://github.com/erezny) for reporting bugs.

#### 2.3.2 (10 July 2016)

* Add language bindings for **[Get a List of Current User's Playlists](https://developer.spotify.com/web-api/get-a-list-of-current-users-playlists/)**. Thanks [@JMPerez](https://github.com/JMPerez) and [@vinialbano](https://github.com/vinialbano).

#### 2.3.1 (3 July 2016)

* Fix for `getRecomendations` method causing client error response from the API when making the request. Thanks [@kyv](https://github.com/kyv) for reporting, and [@Boberober](https://github.com/Boberober) and [@JMPerez](https://github.com/JMPerez) for providing fixes.

#### 2.3.0 (2 April 2016)

* Add language bindings for **[Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/)**, **[Get a User's Top Artists and Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/)**, **[Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/)**, and **[Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/)**. Read more about the endpoints in the links above or in this [blog post](https://developer.spotify.com/news-stories/2016/03/29/api-improvements-update/).
* Add generic search method enabling searches for several types at once, e.g. search for both tracks and albums in a single request, instead of one request for track results and one request for album results.

#### 2.2.0 (23 November 2015)

* Add language bindings for **[Get User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/)** and other endpoints related to the user's saved albums.

#### 2.1.1 (23 November 2015)

* Username encoding bugfix.

#### 2.1.0 (16 July 2015)

* Add language binding for **[Get Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/)**

#### 2.0.2 (11 May 2015)

* Bugfix for retrieving an access token through the Client Credentials flow. (Thanks [Nate Wilkins](https://github.com/Nate-Wilkins)!)
* Add test coverage and Travis CI.

#### 2.0.1 (2 Mar 2015)

* Return WebApiError objects if error occurs during authentication.

#### 2.0.0 (27 Feb 2015)

* **Breaking change**: Response object changed. Add headers and status code to all responses to enable users to implement caching.

#### 1.3.13 (26 Feb 2015)

* Add language binding for **[Reorder tracks in a Playlist](https://developer.spotify.com/web-api/reorder-playlists-tracks/)**

#### 1.3.12 (22 Feb 2015)

* Add language binding for **[Remove tracks in a Playlist by Position](https://developer.spotify.com/web-api/remove-tracks-playlist/)**

#### 1.3.11

* Add **[Search for Playlists](https://developer.spotify.com/web-api/search-item/)** endpoint.

#### 1.3.10

* Add market parameter to endpoints supporting **[Track Relinking](https://developer.spotify.com/web-api/track-relinking-guide/)**.
* Improve SEO by adding keywords to the package.json file. ;-)

#### 1.3.8

* Add **[Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/)**, **[Get a Category](https://developer.spotify.com/web-api/get-category/)**, and **[Get A Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/)** endpoints.

#### 1.3.7

* Add **[Check if Users are Following Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/)** endpoint.

#### 1.3.5

* Add missing options parameter in createPlaylist (issue #19). Thanks for raising this [allinallin](https://github.com/allinallin).

#### 1.3.4

* Add **[Follow Playlist](https://developer.spotify.com/web-api/follow-playlist/)** and **[Unfollow Playlist](https://developer.spotify.com/web-api/unfollow-playlist/)** endpoints.

#### 1.3.3

* [Fix](https://github.com/thelinmichael/spotify-web-api-node/pull/18) error format. Thanks [extrakt](https://github.com/extrakt).

#### 1.3.2

* Add ability to use callback methods instead of promise.

#### 1.2.2

* Bugfix. api.addTracksToPlaylist tracks parameter can be a string or an array. Thanks [ofagbemi](https://github.com/ofagbemi)!

#### 1.2.1

* Add **[Follow endpoints](https://developer.spotify.com/web-api/web-api-follow-endpoints/)**. Great work [JMPerez](https://github.com/JMPerez).

#### 1.1.0

* Add **[Browse endpoints](https://developer.spotify.com/web-api/browse-endpoints/)**. Thanks [fsahin](https://github.com/fsahin).

#### 1.0.2

* Specify module's git repository. Thanks [vincentorback](https://github.com/vincentorback).

#### 1.0.1

* Allow options to be set when retrieving a user's playlists. Thanks [EaterOfCode](https://github.com/EaterOfCode).

#### 1.0.0

* Add **[Replace tracks in a Playlist](https://developer.spotify.com/web-api/replace-playlists-tracks/)** endpoint
* Add **[Remove tracks in a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)** endpoint
* Return errors as Error objects instead of unparsed JSON. Thanks [niftylettuce](https://github.com/niftylettuce).

#### 0.0.11

* Add **[Change Playlist details](https://developer.spotify.com/web-api/change-playlist-details/)** endpoint (change published status and name). Gracias [JMPerez](https://github.com/JMPerez).

#### 0.0.10

* Add Your Music Endpoints (**[Add tracks](https://developer.spotify.com/web-api/save-tracks-user/)**, **[Remove tracks](https://developer.spotify.com/web-api/remove-tracks-user/)**, **[Contains tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/)**, **[Get tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/)**).
* Documentation updates (change scope name of playlist-modify to playlist-modify-public, and a fix to a parameter type). Thanks [JMPerez](https://github.com/JMPerez) and [matiassingers](https://github.com/matiassingers).

#### 0.0.9

* Add **[Related artists](https://developer.spotify.com/web-api/get-related-artists/)** endpoint
