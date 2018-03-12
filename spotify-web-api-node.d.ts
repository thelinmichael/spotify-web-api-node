export = SpotifyWebApi;

declare class SpotifyWebApi {
    constructor(credentials?: SpotifyWebApiCredentials);

    // Authentication and authorization methods
    authorizationCodeGrant(code: any, callback?: SpotifyCallback<SpotifyAuthorizationGrant>): Promise<SpotifyResponse<SpotifyAuthorizationGrant>> | undefined;
    clientCredentialsGrant(options?: any, callback?: SpotifyCallback<SpotifyAuthorizationGrant>): Promise<SpotifyResponse<SpotifyAuthorizationGrant>> | undefined;
    createAuthorizeURL(scopes: string[], state: string, showDialog: boolean): string;
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
    refreshAccessToken(callback?: SpotifyCallback<SpotifyAuthorizationGrant>): Promise<SpotifyResponse<SpotifyAuthorizationGrant>> | undefined;

    // Metadata methods
    getAudioAnalysisForTrack(trackId: SpotifyTrackId, callback?: SpotifyCallback<SpotifyAudioAnalysis>): Promise<SpotifyResponse<SpotifyAudioAnalysis>> | undefined;
    getAudioFeaturesForTrack(trackId: SpotifyTrackId, callback?: SpotifyCallback<SpotifyAudioFeatures>): Promise<SpotifyResponse<SpotifyAudioFeatures>> | undefined;
    getAudioFeaturesForTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getAvailableGenreSeeds(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getCategories(options?: SpotifyGetCategoriesOptions, callback?: SpotifyCallback<SpotifyCategory>): Promise<SpotifyResponse<SpotifyCategory>> | undefined;
    getCategory(categoryId: SpotifyCategoryId, options?: SpotifyGetCategoryOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getNewReleases(options?: SpotifyPlaylistSearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getRecommendations(options?: any, callback?: SpotifyCallback<SpotifyRecommendations>): Promise<SpotifyResponse<SpotifyRecommendations>> | undefined;

    // My methods
    getMe(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyPrivateUser>> | undefined;
    getMyCurrentPlaybackState(options?: SpotifyGetTrackOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyCurrentPlayingTrack(options?: SpotifyGetTrackOptions, callback?: SpotifyCallback<SpotifyTrack>): Promise<SpotifyResponse<SpotifyTrack>> | undefined;
    getMyDevices(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyRecentlyPlayedTracks(options?: SpotifyRecentlyPlayedOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMySavedAlbums(options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMySavedTracks(options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyTopArtists(options?: SpotifyMyTopOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyTopTracks(options?: SpotifyMyTopOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // User methods
    getUser(userId: SpotifyUserId, callback?: SpotifyCallback<SpotifyPublicUser>): Promise<SpotifyResponse<SpotifyPublicUser>> | undefined;
    getUserPlaylists(userId: SpotifyUserId, options?: SpotifyGetPlaylistOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Following methods
    getFollowedArtists(options?: SpotifyGetFollowedArtistsOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    isFollowingArtists(artistIds: SpotifyArtistId[], callback?: SpotifyCallback<boolean>): Promise<SpotifyResponse<boolean>> | undefined;
    followArtists(artists: SpotifyArtistId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    unfollowArtists(artistIds: SpotifyArtistId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    isFollowingUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<boolean>): Promise<SpotifyResponse<boolean>> | undefined;
    followUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    unfollowUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    followPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: SpotifyFollowPlaylistOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    areFollowingPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, followerIds: SpotifyUserId[], callback?: SpotifyCallback<boolean>): Promise<SpotifyResponse<boolean>> | undefined | undefined;
    unfollowPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;

    // Saved tracks and albums
    addToMySavedAlbums(albumIds: SpotifyAlbumId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    addToMySavedTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    removeFromMySavedAlbums(albumIds: SpotifyAlbumId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    removeFromMySavedTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    containsMySavedAlbums(albumIds: SpotifyAlbumId[], callback?: SpotifyCallback<boolean>): Promise<boolean> | undefined;
    containsMySavedTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<boolean>): Promise<boolean> | undefined;


    // Track methods
    getTrack(trackId: SpotifyTrackId, options?: SpotifyGetTrackOptions, callback?: SpotifyCallback<SpotifyTrack>): Promise<SpotifyResponse<SpotifyTrack>> | undefined;
    getTracks(trackIds: SpotifyTrackId[], options?: SpotifyGetTrackOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Album methods
    getAlbum(albumId: SpotifyAlbumId, options?: SpotifyGetAlbumOptions, callback?: SpotifyCallback<SpotifyAlbum>): Promise<SpotifyResponse<SpotifyAlbum>> | undefined;
    getAlbums(albumIds: SpotifyAlbumId[], options?: SpotifyGetAlbumOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getAlbumTracks(albumId: SpotifyAlbumId, options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Artist methods
    getArtist(artistId: SpotifyArtistId, callback?: SpotifyCallback<SpotifyArtist>): Promise<SpotifyResponse<SpotifyArtist>> | undefined;
    getArtists(artists: SpotifyArtistId[], callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getArtistAlbums(artistId: SpotifyArtistId, options?: SpotifyArtistsAlbumsOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getArtistRelatedArtists(artistId: SpotifyArtistId, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getArtistTopTracks(artistId: SpotifyArtistId, country: string, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Playlist methods
    getPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: SpotifyGetPlaylistOptions, callback?: SpotifyCallback<SpotifyPlaylist>): Promise<SpotifyResponse<SpotifyPlaylist>> | undefined;
    getPlaylistTracks(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: SpotifyGetPlaylistTracksOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    removeTracksFromPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, tracks: SpotifyTrackId[], options?: SpotifyRemoveTrackFromPlaylistOptions, callback?: SpotifyCallback<SpotfiyPlaylistSnapshotId>): Promise<SpotifyResponse<SpotfiyPlaylistSnapshotId>> | undefined;
    removeTracksFromPlaylistByPosition(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, positions: number[], snapshotId: SpotfiyPlaylistSnapshotId, callback?: SpotifyCallback<SpotfiyPlaylistSnapshotId>): Promise<SpotifyResponse<SpotfiyPlaylistSnapshotId>> | undefined;
    reorderTracksInPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, rangeStart: number, insertBefore: number, options?: SpotifyReorderPlaylistOptions, callback?: SpotifyCallback<SpotfiyPlaylistSnapshotId>): Promise<SpotifyResponse<SpotfiyPlaylistSnapshotId>> | undefined;
    replaceTracksInPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, uris: string[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    createPlaylist(userId: SpotifyUserId, playlistName: string, options?: SpotifyPlaylistOptions, callback?: SpotifyCallback<SpotifyPlaylist>): Promise<SpotifyResponse<SpotifyPlaylist>> | undefined;
    addTracksToPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, tracks: SpotifyTrackId[], options?: SpotifyAddTrackToPlaylistOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    changePlaylistDetails(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: SpotifyPlaylistOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    getFeaturedPlaylists(options?: SpotifyFeaturedPlaylistOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getPlaylistsForCategory(categoryId: SpotifyCategoryId, options?: SpotifyPlaylistSearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;

    // Search methods
    search(query: string, types: SpotifyObjectType[], options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    searchAlbums(query: string, options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    searchTracks(query: string, options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    searchArtists(query: string, options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    searchPlaylists(query: string, options?: SpotifySearchOptions, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;


    // Playback control methods
    pause(options?: SpotifyPauseOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    play(options?: SpotifyPlayOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    setRepeat(options?: SpotifyRepeatOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    setShuffle(options?: SpotifyShuffleOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    skipToNext(callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    skipToPrevious(callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    transferMyPlayback(options?: SpotifyTransferPlaybackOptions, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;

}

type SpotifyObjectType = "track" | "playlist" | "album" | "artist" | "audio_features" | "user";
type SpotifyAlbumType = "album" | "single" | "compilation";
type SpotifyContextType = "artist" | "playlist" | "album";
type SpotifyRecommendationsSeedType = "artist" | "track" | "genre";
type SpotifyReleaseDatePrecision = "day" | "month" | "year";

type SpotifySearchResult = SpotifyTrack | SpotifyAlbum | SpotifyArtist | SpotifyPlaylist;
type SpotifyCategoryId = string;
type SpotifyTrackId = string;
type SpotifyAlbumId = string;
type SpotifyArtistId = string;
type SpotifyUserId = string;
type SpotifyPlaylistId = string;
type SpotfiyPlaylistSnapshotId = string;
type SpotifyAudioAnalysis = any;

type SpotifyCallback<T> = (error: Error, response: SpotifyResponse<T>) => void;

interface SpotifyResponse<T> {
    body: T,
    headers: any,
    statusCode: number,
}


// Type definitions as per Spotify Object Model
// https://developer.spotify.com/web-api/object-model/

interface SpotifySimplifiedArtist {
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    name: string,
    type: SpotifyObjectType,
    uri: string,
}

interface SpotifyArtist extends SpotifySimplifiedArtist {
    followers: SpotifyFollowers,
    genres: string[],
    images: SpotifyImage[],
    popularity: number,
}

interface SpotifySimplifiedAlbum {
    album_type: SpotifyAlbumType,
    artists: SpotifySimplifiedArtist[],
    available_markets: string[],
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    type: SpotifyObjectType,
    release_date: string,
    release_date_precision: SpotifyReleaseDatePrecision,
    uri: string,
}

interface SpotifyAlbum extends SpotifySimplifiedAlbum {
    copyrights: SpotifyCopyright[],
    external_ids: SpotifyExternalId,
    genres: string[],
    label: string,
    popularity: number,
    tracks: SpotifyPage<SpotifySimplifiedTrack>,
}

interface SpotifyAudioFeatures {
    acousticness: number,
    analysis_url: string,
    danceability: number,
    duration_ms: number,
    energy: number,
    id: string,
    instrumentalness: number,
    key: number,
    liveness: number,
    loudness: number,
    mode: number,
    speechiness: number,
    tempo: number,
    time_signature: number,
    track_href: string,
    type: SpotifyObjectType,
    uri: string,
    valence: number,
}

interface SpotifyCategory {
    href: string,
    icons: SpotifyImage[],
    id: string,
    name: string,
}

interface SpotifyCopyright {
    text: string,
    type: string,
}

interface SpotifyCursor {
    after: string,
}

interface SpotifyDevice {
    id: string,
    is_active: boolean,
    is_restricted: boolean,
    name: string,
    type: string,
    volume_percent: number,
}

interface SpotifyError {
    status: number,
    message: string,
}

// to be defined
type SpotifyExternalId = any;

// to be defined
type SpotifyExternalUrl = any;

interface SpotifyFollowers {
    href: string,
    total: number,
}

interface SpotifyImage {
    height?: number,
    url: string,
    width?: number,
}

interface SpotifyPage<T> {
    href: string,
    items: T[],
    limit: number,
    next?: string,
    offset: number,
    previous?: string,
    total: number,
}

interface SpotifyCursorBasedPage<T> {
    href: string,
    items: T[],
    limit: number,
    next?: string,
    cursors: SpotifyCursor,
    total: number,
}

interface SpotifySimplifiedPlaylist {
    collaborative: boolean,
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    owner: SpotifyPublicUser,
    public?: boolean,
    snapshot_id: string,
    //TODO: Revisit the inheritence here... Possible inconsistencies in the API
    tracks: SpotifyPage<SpotifyPlaylistTrack>,
    type: string,
    uri: string,
}

interface SpotifyPlaylist extends SpotifySimplifiedPlaylist {
    description: string,
    followers: SpotifyFollowers,
}

interface SpotifyPlaylistTrack {
    added_at?: Date,
    added_by?: SpotifyPublicUser,
    is_local: boolean,
    track: SpotifyTrack,
}

interface SpotifyRecommendations {
    seeds: SpotifyRecommendationsSeed[],
    tracks: SpotifySimplifiedTrack[],
}

interface SpotifyRecommendationsSeed {
    afterFilteringSize: number,
    afterRelinkingSize: number,
    href?: string,
    id: string,
    initialPoolSize: number,
    type: SpotifyRecommendationsSeedType,
}

interface SpotifyRestriction {
    reason: string,
}

interface SpotifySavedTrack {
    added_at: Date,
    track: SpotifyTrack,
}

interface SpotifySavedAlbum {
    added_at: Date,
    track: SpotifyAlbum,
}

interface SpotifyTrack extends SpotifySimplifiedTrack {
    album: SpotifySimplifiedAlbum,
    external_ids: SpotifyExternalId,
    restrictions: SpotifyRestriction,
    popularity: number,
}

interface SpotifySimplifiedTrack {
    artists: SpotifySimplifiedArtist[],
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    is_playable: boolean,
    linked_from: SpotifyTrackLink,
    name: string,
    preview_url?: string,
    track_number: number,
    type: string,
    uri: number,
}

interface SpotifyTrackLink {
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    type: string,
    uri: string,
}

interface SpotifyPrivateUser extends SpotifyPublicUser {
    birthdate?: string,
    country?: string,
    email?: string,
    product?: string,
}

interface SpotifyPublicUser {
    display_name: string,
    external_urls: SpotifyExternalUrl,
    followers: SpotifyFollowers,
    href: string,
    id: string,
    images: SpotifyImage[],
    type: string,
    uri: string,
}

interface SpotifyPlayHistory {
    track: SpotifySimplifiedTrack,
    played_at: Date,
    context: SpotifyContext,
}

interface SpotifyContext {
    type: SpotifyContextType,
    href: string,
    external_urls: SpotifyExternalUrl,
    uri: string,
}

interface SpotifyWebApiCredentials {
    clientId?: string,
    clientSecret?: string,
    redirectUri?: string,
}

interface SpotifyAuthorizationGrant {
    access_token: string,
    refresh_token: string,
    expires_in: number,
}

// Option Definitions
interface SpotifyPauseOptions {
    device_id?: string,
}

interface SpotifyPlayOptions {
    device_id?: string,
    context_uri: string,
    uris: string[],
    offset: any,
}

interface SpotifyShuffleOptions {
    state: boolean,
    deviceId?: string,
}

interface SpotifyRepeatOptions {
    state: "track" | "context" | "off",
    deviceId?: string
}

interface SpotifyTransferPlaybackOptions {
    device_ids: string[],
    play?: boolean,
}

interface SpotifySearchOptions {
    market?: string,
    limit?: number,
    offset?: number,
}

interface SpotifyPlaylistSearchOptions {
    country?: string,
    limit?: number,
    offset?: number,
}

interface SpotifyGetCategoriesOptions extends SpotifyPlaylistSearchOptions {
    locale?: string,
}

interface SpotifyGetCategoryOptions {
    country?: string,
    locale?: string,
}

interface SpotifyFeaturedPlaylistOptions extends SpotifyPlaylistSearchOptions {
    timestamp?: Date,
    locale?: string,
}

interface SpotifyPlaylistOptions {
    name?: string,
    public?: boolean,
    collaborative?: boolean,
    description?: string,
}

interface SpotifyAddTrackToPlaylistOptions {
    position?: number,
}

interface SpotifyReorderPlaylistOptions {
    range_length?: number,
    snapshot_id?: SpotfiyPlaylistSnapshotId,
}

interface SpotifyRemoveTrackFromPlaylistOptions {
    snapshot_id?: SpotfiyPlaylistSnapshotId,
}
interface SpotifyGetPlaylistTracksOptions extends SpotifySearchOptions {
    fields?: string[],
}

interface SpotifyGetPlaylistOptions {
    limit?: number,
    offset?: number,
}

interface SpotifyArtistsAlbumsOptions extends SpotifySearchOptions {
    album_type?: string,
}

interface SpotifyGetAlbumOptions {
    marekt?: string,
}

interface SpotifyGetTrackOptions {
    marekt?: string,
}

interface SpotifyFollowPlaylistOptions {
    public?: boolean,
}

interface SpotifyGetFollowedArtistsOptions {
    limit?: number,
    after?: string,
}

interface SpotifyMyTopOptions {
    limit?: number,
    offset?: number,
    time_range?: "long_term" | "medium_term" | "short_term",
}

interface SpotifyRecentlyPlayedOptions {
    limit?: number,
    before?: number,
    after?: number,
}

