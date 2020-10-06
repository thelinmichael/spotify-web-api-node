class SpotifyWebApiTools {
  constructor(webApi) {
    this.webApi = webApi;
  }

  /**
   * Process the paging object of Spotify's response with a generator function.
   * @param {Promise} initialPromise An initial promise to use, for e.g. `spotifyApi.getUserPlaylists()`
   * @param {Array} pagingObjectSelector A selector where to find the [paging object](https://developer.spotify.com/documentation/web-api/reference/object-model/#paging-object) within the response. For playlists it is usually `body`, when searching for tracks it is usually `body.tracks`.
   * @returns {Generator} Returns a Generator that contains one page of Spotify's paging object. Obtain the next page iteratively.
   */
  async *processNextGenerator(initialPromise, pagingObjectSelector) {
    let page = getNestedObject(await initialPromise, pagingObjectSelector);
    yield page.items;

    let next = page.next;
    while (next) {
      page = getNestedObject(await this.webApi.getGeneric(next), pagingObjectSelector);
      yield page.items;

      next = page.next;
    }
  }

  /**
   * Recursively process paging object of Spotify's response up to at least `count` items.
   * @param {Promise} initialPromise Initial promise to use, for e.g. `spotifyApi.getUserPlaylists()`
   * @param {Array} pagingObjectSelector A selector where to find the [paging object](https://developer.spotify.com/documentation/web-api/reference/object-model/#paging-object) within the response. For playlists it is usually `body`, when searching for tracks it is usually `body.tracks`.
   * @param {number} count Abort recursion if at least `count` results were found. Usually returns 1 page more. Set to `0` to process all `next` objects.
   * @returns {Promise} Promise with an array, in which all gathered data was merged.
   */
  async getAtLeast(initialPromise, pagingObjectSelector, count) {
    const tmp = [];
    for await (let snippet of this.processNextGenerator(
      initialPromise,
      pagingObjectSelector
    )) {
      tmp.push(...snippet);
      if (count && tmp.length > count) return tmp;
    }
    return tmp;
  }

  /**
   * Recursively process paging object of Spotify's response, unitl reaching the end.
   * @param {Promise} initialPromise Initial promise to use, for e.g. `spotifyApi.getUserPlaylists()`
   * @param {Array} pagingObjectSelector A selector where to find the [paging object](https://developer.spotify.com/documentation/web-api/reference/object-model/#paging-object) within the response. For playlists it is usually `body`, when searching for tracks it is usually `body.tracks`.
   * @returns {Promise} Promise with an array, in which all gathered data was merged.
   */
  async getAll(initialPromise, pagingObjectSelector) {
    return this.getAtLeast(initialPromise, pagingObjectSelector, 0);
  }

  /**
   * Get all user's playlists.
   * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
   * the permissions will be used.
   * @param {Object} [options] The options supplied to this request.
   * @example const playlistArray = await getAllUserPlaylists('thelinmichael')
   * @returns {Promise} A promise that if successful, resolves to an object containing
   *          a list of all playlists. If rejected, it contains an error object.
   */
  async getAllUserPlaylists(userId, options) {
    return await this.getAll(this.webApi.getUserPlaylists(userId, options), ['body']);
  }

  /**
   * Get all tracks in a playlist.
   * @param {string} playlistId The playlist's ID.
   * @param {Object} [options] Optional options, such as fields.
   * @example const trackArray = await getAllPlaylistTracks('3ktAYNcRHpazJ9qecm3ptn')
   * @returns {Promise} A promise that if successful, resolves to an object that containing
   * all tracks in the playlist. If rejected, it contains an error object.
   */
  async getAllPlaylistTracks(playlistId, options) {
    return await this.getAll(
      this.webApi.getPlaylistTracks(playlistId, options),
      ['body']
    );
  }

  /**
   * Find User's Playlist by Name.
   * @param {string} playlistName
   * @returns {Promise} A promise that if successful, resolves to one PlaylistObject. If rejected, it contains an error object.
   */
  async findUserPlaylistByName(playlistName) {
    if (!playlistName) {
      throw new Error('Invalid Playlist Name provided: '+playlistName);
    }

    // Get all of User's Playlists
    const playlistArray = await this.getAllUserPlaylists();

    // Find Playlist by Name
    const playlistByName = playlistArray.filter(p => p.name == playlistName);
    if (playlistByName.length > 1) {
      throw new Error(
        'Could not find unique Playlist with Name: ' + playlistName
      );
    }
    if (playlistByName.length === 0) {
      throw new Error('Could not Playlist with Name: ' + playlistName);
    }

    return playlistByName[0];
  }
}

function getNestedObject(nestedObj, pathArr) {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

module.exports = SpotifyWebApiTools;