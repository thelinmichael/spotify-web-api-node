export = SpotifyWebApi;

declare class SpotifyWebApi {
    constructor(credentials?: SpotifyWebApiCredentials);

    // Authentication and authorization methods
    authorizationCodeGrant(code: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    clientCredentialsGrant(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    createAuthorizeURL(scopes: any, state: any, showDialog: any): string;
    getAccessToken(): string;
    getClientId(): string;
    getClientSecret(): string;
    getCredentials(): SpotifyWebApiCredentials;
    getRedirectURI(): string;
    getRefreshToken(): string;
    setAccessToken(accessToken: string): void;
    setClientId(clientId: string): void;
    setClientSecret(clientSecret: string): void;
    setCredentials(credentials: SpotifyWebApiCredentials): void;
    setRedirectURI(redirectUri: string): void;
    setRefreshToken(refreshToken: string): void;
    resetAccessToken(): void;
    resetClientId(): void;
    resetClientSecret(): void;
    resetCredentials(): void;
    resetRedirectURI(): void;
    resetRefreshToken(): void;
    refreshAccessToken(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Metadata methods
    getAudioAnalysisForTrack(trackId: SpotifyTrackId, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getAudioFeaturesForTrack(trackId: SpotifyTrackId, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getAudioFeaturesForTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getAvailableGenreSeeds(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getCategories(options?: any, callback?: SpotifyCallback<SpotifyCategory>): Promise<SpotifyResponse<SpotifyCategory>> | undefined;
    getCategory(categoryId: SpotifyCategoryId, options?: any, callback?: SpotifyCallback<SpotifyCategory[]>): Promise<SpotifyResponse<SpotifyCategory[]>> | undefined;
    getNewReleases(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getRecommendations(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // My methods
    getMe(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyUser>> | undefined;
    getMyCurrentPlaybackState(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyCurrentPlayingTrack(options?: any, callback?: SpotifyCallback<SpotifyTrack>): Promise<SpotifyResponse<SpotifyTrack>> | undefined;
    getMyDevices(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyRecentlyPlayedTracks(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    getMySavedAlbums(options?: any, callback?: SpotifyCallback<SpotifyAlbum[]>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    getMySavedTracks(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    getMyTopArtists(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    getMyTopTracks(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;

    // User methods
    getUser(userId: SpotifyUserId, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getUserPlaylists(userId: SpotifyUserId, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Following methods
    getFollowedArtists(options?: any, callback?: SpotifyCallback<SpotifyArtist[]>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    isFollowingArtists(artistIds: SpotifyArtistId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    followArtists(artists: SpotifyArtistId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    unfollowArtists(artistIds: SpotifyArtistId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    isFollowingUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    followUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    unfollowUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    followPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    areFollowingPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, followerIds: SpotifyUserId[], callback?: SpotifyCallback<any>): Promise<boolean> | undefined;
    unfollowPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Saved tracks and albums
    addToMySavedAlbums(albumIds: SpotifyAlbumId[], callback?: SpotifyCallback<boolean>): Promise<boolean> | undefined;
    addToMySavedTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<boolean>): Promise<boolean> | undefined;
    removeFromMySavedAlbums(albumIds: SpotifyAlbumId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    removeFromMySavedTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    containsMySavedAlbums(albumIds: SpotifyAlbumId[], callback?: SpotifyCallback<boolean>): Promise<boolean> | undefined;
    containsMySavedTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<boolean>): Promise<boolean> | undefined;


    // Track methods
    getTrack(trackId: SpotifyTrackId, options?: any, callback?: SpotifyCallback<SpotifyTrack>): Promise<SpotifyResponse<SpotifyTrack>> | undefined;
    getTracks(trackIds: SpotifyTrackId[], options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;

    // Album methods
    getAlbum(albumId: SpotifyAlbumId, options?: any, callback?: SpotifyCallback<SpotifyAlbum>): Promise<SpotifyResponse<SpotifyAlbum>> | undefined;
    getAlbums(albumIds: SpotifyAlbumId[], options?: any, callback?: SpotifyCallback<SpotifyAlbum[]>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    getAlbumTracks(albumId: SpotifyAlbumId, options?: any, callback?: SpotifyCallback<SpotifyAlbum[]>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;

    // Artist methods
    getArtist(artistId: SpotifyArtistId, callback?: SpotifyCallback<SpotifyArtist>): Promise<SpotifyResponse<SpotifyArtist>> | undefined;
    getArtists(artists: SpotifyArtistId[], callback?: SpotifyCallback<SpotifyArtist[]>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    getArtistAlbums(artistId: SpotifyArtistId, options?: any, callback?: SpotifyCallback<SpotifyAlbum[]>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    getArtistRelatedArtists(artistId: SpotifyArtistId, callback?: SpotifyCallback<SpotifyArtist[]>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    getArtistTopTracks(artistId: SpotifyArtistId, country: string, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;

    // Playlist methods
    getPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<SpotifyPlaylist[]>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;
    getPlaylistTracks(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<SpotifyPlaylist[]>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;
    removeTracksFromPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, tracks: SpotifyTrackId[], options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    removeTracksFromPlaylistByPosition(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, positions: number[], snapshotId: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    reorderTracksInPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, rangeStart: any, insertBefore: any, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    replaceTracksInPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, uris: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    createPlaylist(userId: SpotifyUserId, playlistName: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    addTracksToPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, tracks: SpotifyTrackId[], options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    changePlaylistDetails(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getFeaturedPlaylists(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;
    getPlaylistsForCategory(categoryId: SpotifyCategoryId, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;

    // Search methods
    search(query: string, types: string[], options?: any, callback?: SpotifyCallback<SpotifySearchResult[]>): Promise<SpotifyResponse<SpotifySearchResult[]>> | undefined;
    searchAlbums(query: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    searchTracks(query: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    searchArtists(query: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    searchPlaylists(query: string, options?: any, callback?: SpotifyCallback<SpotifyPlaylist[]>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;


    // Playback control methods
    pause(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    play(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    setRepeat(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    setShuffle(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    skipToNext(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    skipToPrevious(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    transferMyPlayback(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

}

type SpotifySearchResult = SpotifyTrack | SpotifyAlbum | SpotifyArtist | SpotifyPlaylist;
type SpotifyCategoryId = string;
type SpotifyTrackId = string;
type SpotifyAlbumId = string;
type SpotifyArtistId = string;
type SpotifyUserId = string;
type SpotifyPlaylistId = string;

type SpotifyCallback<T> = (error: any, response: SpotifyResponse<T>) => void;

interface SpotifyResponse<T> {
    body: T,
    headers: object,
    statusCode: number,
}

interface SpotifyUser {

}

interface SpotifyCategory {

}

interface SpotifyPlaylist {

}

interface SpotifyArtist {

}

interface SpotifyAlbum {

}

interface SpotifyTrack {

}

interface SpotifyWebApiCredentials {
    clientId?: string,
    clientSecret?: string,
    redirectUri?: string,
}
