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
    getAudioFeaturesForTracks(trackIds: SpotifyTrackId[], callback?: SpotifyCallback<SpotifyAudioFeatures[]>): Promise<SpotifyResponse<SpotifyAudioFeatures[]>> | undefined;
    getAvailableGenreSeeds(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getCategories(options?: any, callback?: SpotifyCallback<SpotifyCategory>): Promise<SpotifyResponse<SpotifyCategory>> | undefined;
    getCategory(categoryId: SpotifyCategoryId, options?: any, callback?: SpotifyCallback<SpotifyCategory[]>): Promise<SpotifyResponse<SpotifyCategory[]>> | undefined;
    getNewReleases(options?: any, callback?: SpotifyCallback<SpotifySimplifiedAlbum[]>): Promise<SpotifyResponse<SpotifySimplifiedAlbum[]>> | undefined;
    getRecommendations(options?: any, callback?: SpotifyCallback<SpotifyRecommendations>): Promise<SpotifyResponse<SpotifyRecommendations>> | undefined;

    // My methods
    getMe(callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyPrivateUser>> | undefined;
    getMyCurrentPlaybackState(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<any>> | undefined;
    getMyCurrentPlayingTrack(options?: any, callback?: SpotifyCallback<SpotifyTrack>): Promise<SpotifyResponse<SpotifyTrack>> | undefined;
    getMyDevices(callback?: SpotifyCallback<SpotifyDevice[]>): Promise<SpotifyResponse<SpotifyDevice[]>> | undefined;
    getMyRecentlyPlayedTracks(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    getMySavedAlbums(options?: any, callback?: SpotifyCallback<SpotifyAlbum[]>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    getMySavedTracks(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    getMyTopArtists(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    getMyTopTracks(options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;

    // User methods
    getUser(userId: SpotifyUserId, callback?: SpotifyCallback<SpotifyPublicUser>): Promise<SpotifyResponse<SpotifyPublicUser>> | undefined;
    getUserPlaylists(userId: SpotifyUserId, options?: any, callback?: SpotifyCallback<SpotifyPlaylist[]>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;

    // Following methods
    getFollowedArtists(options?: any, callback?: SpotifyCallback<SpotifyArtist[]>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    isFollowingArtists(artistIds: SpotifyArtistId[], callback?: SpotifyCallback<boolean>): Promise<SpotifyResponse<boolean>> | undefined;
    followArtists(artists: SpotifyArtistId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    unfollowArtists(artistIds: SpotifyArtistId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    isFollowingUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<boolean>): Promise<SpotifyResponse<boolean>> | undefined;
    followUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    unfollowUsers(userIds: SpotifyUserId[], callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    followPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
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
    getTrack(trackId: SpotifyTrackId, options?: any, callback?: SpotifyCallback<SpotifyTrack>): Promise<SpotifyResponse<SpotifyTrack>> | undefined;
    getTracks(trackIds: SpotifyTrackId[], options?: any, callback?: SpotifyCallback<SpotifySimplifiedTrack[]>): Promise<SpotifyResponse<SpotifySimplifiedTrack[]>> | undefined;

    // Album methods
    getAlbum(albumId: SpotifyAlbumId, options?: any, callback?: SpotifyCallback<SpotifyAlbum>): Promise<SpotifyResponse<SpotifyAlbum>> | undefined;
    getAlbums(albumIds: SpotifyAlbumId[], options?: any, callback?: SpotifyCallback<SpotifyAlbum[]>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    getAlbumTracks(albumId: SpotifyAlbumId, options?: any, callback?: SpotifyCallback<SpotifySimplifiedTrack[]>): Promise<SpotifyResponse<SpotifySimplifiedTrack[]>> | undefined;

    // Artist methods
    getArtist(artistId: SpotifyArtistId, callback?: SpotifyCallback<SpotifyArtist>): Promise<SpotifyResponse<SpotifyArtist>> | undefined;
    getArtists(artists: SpotifyArtistId[], callback?: SpotifyCallback<SpotifyArtist[]>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    getArtistAlbums(artistId: SpotifyArtistId, options?: any, callback?: SpotifyCallback<SpotifySimplifiedAlbum[]>): Promise<SpotifyResponse<SpotifySimplifiedAlbum[]>> | undefined;
    getArtistRelatedArtists(artistId: SpotifyArtistId, callback?: SpotifyCallback<SpotifyArtist[]>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    getArtistTopTracks(artistId: SpotifyArtistId, country: string, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;

    // Playlist methods
    getPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<SpotifyPlaylist>): Promise<SpotifyResponse<SpotifyPlaylist>> | undefined;
    getPlaylistTracks(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<SpotifyTrack[]>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    removeTracksFromPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, tracks: SpotifyTrackId[], options?: any, callback?: SpotifyCallback<SpotfiyPlaylistSnapshotId>): Promise<SpotifyResponse<SpotfiyPlaylistSnapshotId>> | undefined;
    removeTracksFromPlaylistByPosition(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, positions: number[], snapshotId: SpotfiyPlaylistSnapshotId, callback?: SpotifyCallback<SpotfiyPlaylistSnapshotId>): Promise<SpotifyResponse<SpotfiyPlaylistSnapshotId>> | undefined;
    reorderTracksInPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, rangeStart: number, insertBefore: number, options?: any, callback?: SpotifyCallback<SpotfiyPlaylistSnapshotId>): Promise<SpotifyResponse<SpotfiyPlaylistSnapshotId>> | undefined;
    replaceTracksInPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, uris: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    createPlaylist(userId: SpotifyUserId, playlistName: string, options?: any, callback?: SpotifyCallback<SpotifyPlaylist>): Promise<SpotifyResponse<SpotifyPlaylist>> | undefined;
    addTracksToPlaylist(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, tracks: SpotifyTrackId[], options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    changePlaylistDetails(userId: SpotifyUserId, playlistId: SpotifyPlaylistId, options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    getFeaturedPlaylists(options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;
    getPlaylistsForCategory(categoryId: SpotifyCategoryId, options?: any, callback?: SpotifyCallback<SpotifySimplifiedPlaylist[]>): Promise<SpotifyResponse<SpotifySimplifiedPlaylist[]>> | undefined;

    // Search methods
    search(query: string, types: string[], options?: any, callback?: SpotifyCallback<SpotifySearchResult[]>): Promise<SpotifyResponse<SpotifySearchResult[]>> | undefined;
    searchAlbums(query: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyAlbum[]>> | undefined;
    searchTracks(query: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyTrack[]>> | undefined;
    searchArtists(query: string, options?: any, callback?: SpotifyCallback<any>): Promise<SpotifyResponse<SpotifyArtist[]>> | undefined;
    searchPlaylists(query: string, options?: any, callback?: SpotifyCallback<SpotifyPlaylist[]>): Promise<SpotifyResponse<SpotifyPlaylist[]>> | undefined;


    // Playback control methods
    pause(callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    play(options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    setRepeat(options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    setShuffle(options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    skipToNext(callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    skipToPrevious(callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;
    transferMyPlayback(options?: any, callback?: SpotifyCallback<void>): Promise<SpotifyResponse<void>> | undefined;

}

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

// type SpotifySingleItemCallback<T> = (error: Error, response: SpotifySingleItemResponse<T>) => void;

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
    type: string,
    uri: string,
}

interface SpotifyArtist extends SpotifySimplifiedArtist {
    followers: SpotifyFollowers,
    genres: string[],
    images: SpotifyImage[],
    popularity: number,
}

interface SpotifySimplifiedAlbum {
    album_type: string,
    artists: SpotifySimplifiedArtist[],
    available_markets: string[],
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    type: string,
    release_date: string,
    release_date_precision: string,
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
    type: string,
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
    type: string,
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
    type: string,
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