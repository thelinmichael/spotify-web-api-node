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
}

function getNestedObject(nestedObj, pathArr) {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

module.exports = SpotifyWebApiTools;