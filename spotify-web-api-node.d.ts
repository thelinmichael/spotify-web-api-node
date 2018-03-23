export = SpotifyWebApi;

declare class SpotifyWebApi {
    constructor(credentials?: SpotifyWebApi.Credentials);

    ///////////////////
    // Authentication and authorization methods
    ///////////////////
    authorizationCodeGrant(code: string): Promise<SpotifyWebApi.Response<SpotifyWebApi.AuthorizationGrant>>;
    authorizationCodeGrant(code: string, callback: SpotifyWebApi.Callback<SpotifyWebApi.AuthorizationGrant>);
    // TODO: Add options type
    clientCredentialsGrant(options?: any): Promise<SpotifyWebApi.Response<SpotifyWebApi.AuthorizationGrant>>;
    clientCredentialsGrant(options: any, callback: SpotifyWebApi.Callback<SpotifyWebApi.AuthorizationGrant>);
    createAuthorizeURL(scopes: string[], state: string, showDialog: boolean): string;
    getAccessToken(): string;
    getClientId(): string;
    getClientSecret(): string;
    getCredentials(): SpotifyWebApi.Credentials;
    getRedirectURI(): string;
    getRefreshToken(): string;
    setAccessToken(accessToken: string): void;
    setClientId(clientId: string): void;
    setClientSecret(clientSecret: string): void;
    setCredentials(credentials: SpotifyWebApi.Credentials): void;
    setRedirectURI(redirectUri: string): void;
    setRefreshToken(refreshToken: string): void;
    resetAccessToken(): void;
    resetClientId(): void;
    resetClientSecret(): void;
    resetCredentials(): void;
    resetRedirectURI(): void;
    resetRefreshToken(): void;
    refreshAccessToken(): Promise<SpotifyWebApi.Response<SpotifyWebApi.AuthorizationGrant>>;
    refreshAccessToken(callback: SpotifyWebApi.Callback<SpotifyWebApi.AuthorizationGrant>);

    ///////////////////
    // Metadata methods
    ///////////////////
    getAudioAnalysisForTrack(trackId: SpotifyWebApi.TrackId): Promise<SpotifyWebApi.Response<SpotifyWebApi.AudioAnalysis>>;
    getAudioAnalysisForTrack(trackId: SpotifyWebApi.TrackId, callback: SpotifyWebApi.Callback<SpotifyWebApi.AudioAnalysis>);

    getAudioFeaturesForTrack(trackId: SpotifyWebApi.TrackId): Promise<SpotifyWebApi.Response<SpotifyWebApi.AudioFeatures>>;
    getAudioFeaturesForTrack(trackId: SpotifyWebApi.TrackId, callback: SpotifyWebApi.Callback<SpotifyWebApi.AudioFeatures>);

    getAudioFeaturesForTracks(trackIds: SpotifyWebApi.TrackId[]): Promise<SpotifyWebApi.Response<any>>;
    getAudioFeaturesForTracks(trackIds: SpotifyWebApi.TrackId[], callback: SpotifyWebApi.Callback<any>);

    getAvailableGenreSeeds(): Promise<SpotifyWebApi.Response<any>>;
    getAvailableGenreSeeds(callback: SpotifyWebApi.Callback<any>);

    getCategories(options: SpotifyWebApi.GetCategoriesOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.Category>>;
    getCategories(options: SpotifyWebApi.GetCategoriesOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.Category>);

    getCategory(categoryId: SpotifyWebApi.CategoryId, options?: SpotifyWebApi.GetCategoryOptions): Promise<SpotifyWebApi.Response<any>>;
    getCategory(categoryId: SpotifyWebApi.CategoryId, options: SpotifyWebApi.GetCategoryOptions, callback: SpotifyWebApi.Callback<any>);

    getNewReleases(options?: SpotifyWebApi.PlaylistSearchOptions): Promise<SpotifyWebApi.Response<any>>;
    getNewReleases(options: SpotifyWebApi.PlaylistSearchOptions, callback: SpotifyWebApi.Callback<any>);

    // TODO: Add options type
    getRecommendations(options?: any): Promise<SpotifyWebApi.Response<SpotifyWebApi.Recommendations>> | undefined;
    getRecommendations(options?: any, callback?: SpotifyWebApi.Callback<SpotifyWebApi.Recommendations>);

    ///////////////////
    // My methods
    ///////////////////
    getMe(): Promise<SpotifyWebApi.Response<SpotifyWebApi.PrivateUser>>;
    getMe(callback: SpotifyWebApi.Callback<SpotifyWebApi.PrivateUser>);

    getMyRecentlyPlayedTracks(options?: SpotifyWebApi.RecentlyPlayedOptions): Promise<SpotifyWebApi.Response<any>>;
    getMyRecentlyPlayedTracks(options: SpotifyWebApi.RecentlyPlayedOptions, callback: SpotifyWebApi.Callback<any>);

    getMySavedAlbums(options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    getMySavedAlbums(options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    getMySavedTracks(options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    getMySavedTracks(options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    getMyTopArtists(options?: SpotifyWebApi.MyTopOptions): Promise<SpotifyWebApi.Response<any>>;
    getMyTopArtists(options: SpotifyWebApi.MyTopOptions, callback: SpotifyWebApi.Callback<any>);

    getMyTopTracks(options?: SpotifyWebApi.MyTopOptions): Promise<SpotifyWebApi.Response<any>>;
    getMyTopTracks(options: SpotifyWebApi.MyTopOptions, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // User methods
    ///////////////////
    getUser(userId: SpotifyWebApi.UserId): Promise<SpotifyWebApi.Response<SpotifyWebApi.PublicUser>>;
    getUser(userId: SpotifyWebApi.UserId, callback: SpotifyWebApi.Callback<SpotifyWebApi.PublicUser>);

    getUserPlaylists(userId: SpotifyWebApi.UserId, options?: SpotifyWebApi.GetPlaylistOptions): Promise<SpotifyWebApi.Response<any>>;
    getUserPlaylists(userId: SpotifyWebApi.UserId, options: SpotifyWebApi.GetPlaylistOptions, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // Following methods
    ///////////////////
    getFollowedArtists(options?: SpotifyWebApi.GetFollowedArtistsOptions): Promise<SpotifyWebApi.Response<any>>;
    getFollowedArtists(options: SpotifyWebApi.GetFollowedArtistsOptions, callback: SpotifyWebApi.Callback<any>);

    isFollowingArtists(artistIds: SpotifyWebApi.ArtistId[]): Promise<SpotifyWebApi.Response<boolean>>;
    isFollowingArtists(artistIds: SpotifyWebApi.ArtistId[], callback: SpotifyWebApi.Callback<boolean>);

    followArtists(artists: SpotifyWebApi.ArtistId[]): Promise<SpotifyWebApi.Response<void>>;
    followArtists(artists: SpotifyWebApi.ArtistId[], callback: SpotifyWebApi.Callback<void>);

    unfollowArtists(artistIds: SpotifyWebApi.ArtistId[]): Promise<SpotifyWebApi.Response<void>>;
    unfollowArtists(artistIds: SpotifyWebApi.ArtistId[], callback: SpotifyWebApi.Callback<void>);

    isFollowingUsers(userIds: SpotifyWebApi.UserId[]): Promise<SpotifyWebApi.Response<boolean>>;
    isFollowingUsers(userIds: SpotifyWebApi.UserId[], callback: SpotifyWebApi.Callback<boolean>);

    followUsers(userIds: SpotifyWebApi.UserId[]): Promise<SpotifyWebApi.Response<void>>;
    followUsers(userIds: SpotifyWebApi.UserId[], callback: SpotifyWebApi.Callback<void>);

    unfollowUsers(userIds: SpotifyWebApi.UserId[]): Promise<SpotifyWebApi.Response<void>>;
    unfollowUsers(userIds: SpotifyWebApi.UserId[], callback: SpotifyWebApi.Callback<void>);

    followPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options?: SpotifyWebApi.FollowPlaylistOptions): Promise<SpotifyWebApi.Response<void>>;
    followPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options: SpotifyWebApi.FollowPlaylistOptions, callback: SpotifyWebApi.Callback<void>);

    areFollowingPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, followerIds: SpotifyWebApi.UserId[]): Promise<SpotifyWebApi.Response<boolean>>;
    areFollowingPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, followerIds: SpotifyWebApi.UserId[], callback: SpotifyWebApi.Callback<boolean>);

    unfollowPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId): Promise<SpotifyWebApi.Response<void>>;
    unfollowPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, callback: SpotifyWebApi.Callback<void>);

    // Saved tracks and albums
    addToMySavedAlbums(albumIds: SpotifyWebApi.AlbumId[]): Promise<SpotifyWebApi.Response<void>>;
    addToMySavedTracks(trackIds: SpotifyWebApi.TrackId[], callback: SpotifyWebApi.Callback<void>);

    removeFromMySavedAlbums(albumIds: SpotifyWebApi.AlbumId[]): Promise<SpotifyWebApi.Response<void>>;
    removeFromMySavedTracks(trackIds: SpotifyWebApi.TrackId[], callback: SpotifyWebApi.Callback<void>);

    containsMySavedAlbums(albumIds: SpotifyWebApi.AlbumId[]): Promise<boolean>;
    containsMySavedTracks(trackIds: SpotifyWebApi.TrackId[], callback: SpotifyWebApi.Callback<boolean>);


    ///////////////////
    // Track methods
    ///////////////////
    getTrack(trackId: SpotifyWebApi.TrackId, options?: SpotifyWebApi.GetTrackOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.Track>>;
    getTrack(trackId: SpotifyWebApi.TrackId, options: SpotifyWebApi.GetTrackOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.Track>);

    getTracks(trackIds: SpotifyWebApi.TrackId[], options?: SpotifyWebApi.GetTrackOptions): Promise<SpotifyWebApi.Response<any>>;
    getTracks(trackIds: SpotifyWebApi.TrackId[], options: SpotifyWebApi.GetTrackOptions, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // Album methods
    ///////////////////
    getAlbum(albumId: SpotifyWebApi.AlbumId, options?: SpotifyWebApi.GetAlbumOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.Album>>;
    getAlbum(albumId: SpotifyWebApi.AlbumId, options: SpotifyWebApi.GetAlbumOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.Album>);

    getAlbums(albumIds: SpotifyWebApi.AlbumId[], options?: SpotifyWebApi.GetAlbumOptions): Promise<SpotifyWebApi.Response<any>>;
    getAlbums(albumIds: SpotifyWebApi.AlbumId[], options: SpotifyWebApi.GetAlbumOptions, callback: SpotifyWebApi.Callback<any>);

    getAlbumTracks(albumId: SpotifyWebApi.AlbumId, options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    getAlbumTracks(albumId: SpotifyWebApi.AlbumId, options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // Artist methods
    ///////////////////
    getArtist(artistId: SpotifyWebApi.ArtistId): Promise<SpotifyWebApi.Response<SpotifyWebApi.Artist>>;
    getArtist(artistId: SpotifyWebApi.ArtistId, callback: SpotifyWebApi.Callback<SpotifyWebApi.Artist>);

    getArtists(artists: SpotifyWebApi.ArtistId[]): Promise<SpotifyWebApi.Response<any>>;
    getArtists(artists: SpotifyWebApi.ArtistId[], callback: SpotifyWebApi.Callback<any>);

    getArtistAlbums(artistId: SpotifyWebApi.ArtistId, options?: SpotifyWebApi.ArtistsAlbumsOptions): Promise<SpotifyWebApi.Response<any>>;
    getArtistAlbums(artistId: SpotifyWebApi.ArtistId, options: SpotifyWebApi.ArtistsAlbumsOptions, callback: SpotifyWebApi.Callback<any>);

    getArtistRelatedArtists(artistId: SpotifyWebApi.ArtistId): Promise<SpotifyWebApi.Response<any>>;
    getArtistRelatedArtists(artistId: SpotifyWebApi.ArtistId, callback: SpotifyWebApi.Callback<any>);

    getArtistTopTracks(artistId: SpotifyWebApi.ArtistId, country: string): Promise<SpotifyWebApi.Response<any>>;
    getArtistTopTracks(artistId: SpotifyWebApi.ArtistId, country: string, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // Playlist methods
    ///////////////////
    getPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options?: SpotifyWebApi.GetPlaylistOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.Playlist>>;
    getPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options: SpotifyWebApi.GetPlaylistOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.Playlist>);

    getPlaylistTracks(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options?: SpotifyWebApi.GetPlaylistTracksOptions): Promise<SpotifyWebApi.Response<any>>;
    getPlaylistTracks(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options: SpotifyWebApi.GetPlaylistTracksOptions, callback: SpotifyWebApi.Callback<any>);

    removeTracksFromPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, tracks: SpotifyWebApi.TrackId[], options?: SpotifyWebApi.RemoveTrackFromPlaylistOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.PlaylistSnapshotId>>;
    removeTracksFromPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, tracks: SpotifyWebApi.TrackId[], options: SpotifyWebApi.RemoveTrackFromPlaylistOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.PlaylistSnapshotId>);

    removeTracksFromPlaylistByPosition(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, positions: number[], snapshotId: SpotifyWebApi.PlaylistSnapshotId): Promise<SpotifyWebApi.Response<SpotifyWebApi.PlaylistSnapshotId>>;
    removeTracksFromPlaylistByPosition(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, positions: number[], snapshotId: SpotifyWebApi.PlaylistSnapshotId, callback: SpotifyWebApi.Callback<SpotifyWebApi.PlaylistSnapshotId>);

    reorderTracksInPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, rangeStart: number, insertBefore: number, options?: SpotifyWebApi.ReorderPlaylistOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.PlaylistSnapshotId>>;
    reorderTracksInPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, rangeStart: number, insertBefore: number, options: SpotifyWebApi.ReorderPlaylistOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.PlaylistSnapshotId>);

    replaceTracksInPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, uris: string[]): Promise<SpotifyWebApi.Response<void>>;
    replaceTracksInPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, uris: string[], callback: SpotifyWebApi.Callback<void>);

    createPlaylist(userId: SpotifyWebApi.UserId, playlistName: string, options?: SpotifyWebApi.PlaylistOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.Playlist>>;
    createPlaylist(userId: SpotifyWebApi.UserId, playlistName: string, options: SpotifyWebApi.PlaylistOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.Playlist>);

    addTracksToPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, tracks: SpotifyWebApi.TrackId[], options?: SpotifyWebApi.AddTrackToPlaylistOptions): Promise<SpotifyWebApi.Response<void>>;
    addTracksToPlaylist(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, tracks: SpotifyWebApi.TrackId[], options: SpotifyWebApi.AddTrackToPlaylistOptions, callback: SpotifyWebApi.Callback<void>);

    changePlaylistDetails(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options?: SpotifyWebApi.PlaylistOptions): Promise<SpotifyWebApi.Response<void>>;
    changePlaylistDetails(userId: SpotifyWebApi.UserId, playlistId: SpotifyWebApi.PlaylistId, options: SpotifyWebApi.PlaylistOptions, callback: SpotifyWebApi.Callback<void>);

    getFeaturedPlaylists(options?: SpotifyWebApi.FeaturedPlaylistOptions): Promise<SpotifyWebApi.Response<any>>;
    getFeaturedPlaylists(options: SpotifyWebApi.FeaturedPlaylistOptions, callback: SpotifyWebApi.Callback<any>);

    getPlaylistsForCategory(categoryId: SpotifyWebApi.CategoryId, options?: SpotifyWebApi.PlaylistSearchOptions): Promise<SpotifyWebApi.Response<any>>;
    getPlaylistsForCategory(categoryId: SpotifyWebApi.CategoryId, options: SpotifyWebApi.PlaylistSearchOptions, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // Search methods
    ///////////////////
    search(query: string, types: SpotifyWebApi.ObjectType[], options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    search(query: string, types: SpotifyWebApi.ObjectType[], options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    searchAlbums(query: string, options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    searchAlbums(query: string, options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    searchTracks(query: string, options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    searchTracks(query: string, options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    searchArtists(query: string, options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    searchArtists(query: string, options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    searchPlaylists(query: string, options?: SpotifyWebApi.SearchOptions): Promise<SpotifyWebApi.Response<any>>;
    searchPlaylists(query: string, options: SpotifyWebApi.SearchOptions, callback: SpotifyWebApi.Callback<any>);

    ///////////////////
    // Playback control methods
    ///////////////////
    pause(options?: SpotifyWebApi.PauseOptions): Promise<SpotifyWebApi.Response<void>>;
    pause(options: SpotifyWebApi.PauseOptions, callback: SpotifyWebApi.Callback<void>);

    play(options?: SpotifyWebApi.PlayOptions): Promise<SpotifyWebApi.Response<void>>;
    play(options: SpotifyWebApi.PlayOptions, callback: SpotifyWebApi.Callback<void>);

    setRepeat(options?: SpotifyWebApi.RepeatOptions): Promise<SpotifyWebApi.Response<void>>;
    setRepeat(options: SpotifyWebApi.RepeatOptions, callback: SpotifyWebApi.Callback<void>);

    setShuffle(options?: SpotifyWebApi.ShuffleOptions): Promise<SpotifyWebApi.Response<void>>;
    setShuffle(options: SpotifyWebApi.ShuffleOptions, callback: SpotifyWebApi.Callback<void>);

    skipToNext(): Promise<SpotifyWebApi.Response<void>>;
    skipToNext(callback: SpotifyWebApi.Callback<void>);

    skipToPrevious(): Promise<SpotifyWebApi.Response<void>>;
    skipToPrevious(callback: SpotifyWebApi.Callback<void>);

    transferMyPlayback(options?: SpotifyWebApi.TransferPlaybackOptions): Promise<SpotifyWebApi.Response<void>>;
    transferMyPlayback(options: SpotifyWebApi.TransferPlaybackOptions, callback: SpotifyWebApi.Callback<void>);

    getMyCurrentPlaybackState(options?: SpotifyWebApi.GetTrackOptions): Promise<SpotifyWebApi.Response<any>>;
    getMyCurrentPlaybackState(options: SpotifyWebApi.GetTrackOptions, callback: SpotifyWebApi.Callback<any>);

    getMyCurrentPlayingTrack(options?: SpotifyWebApi.GetTrackOptions): Promise<SpotifyWebApi.Response<SpotifyWebApi.Track>>;
    getMyCurrentPlayingTrack(options: SpotifyWebApi.GetTrackOptions, callback: SpotifyWebApi.Callback<SpotifyWebApi.Track>);

    getMyDevices(): Promise<SpotifyWebApi.Response<any>>;
    getMyDevices(callback: SpotifyWebApi.Callback<any>);

}

declare namespace SpotifyWebApi {

    type ObjectType = "track" | "playlist" | "album" | "artist" | "audio_features" | "user";
    type AlbumType = "album" | "single" | "compilation";
    type ContextType = "artist" | "playlist" | "album";
    type RecommendationsSeedType = "artist" | "track" | "genre";
    type ReleaseDatePrecision = "day" | "month" | "year";

    type SearchResult = Track | Album | Artist | Playlist;
    type CategoryId = string;
    type TrackId = string;
    type AlbumId = string;
    type ArtistId = string;
    type UserId = string;
    type PlaylistId = string;
    type PlaylistSnapshotId = string;
    type AudioAnalysis = any;

    type Callback<T> = (error: Error, response: Response<T>) => void;

    export interface Response<T> {
        body: T,
        headers: any,
        statusCode: number,
    }


    // Type definitions as per  Object Model
    // https://developer.spotify.com/web-api/object-model/

    export interface SimplifiedArtist {
        external_urls: ExternalUrl,
        href: string,
        id: string,
        name: string,
        type: ObjectType,
        uri: string,
    }

    export interface Artist extends SimplifiedArtist {
        followers: Followers,
        genres: string[],
        images: Image[],
        popularity: number,
    }

    export interface SimplifiedAlbum {
        album_type: AlbumType,
        artists: SimplifiedArtist[],
        available_markets: string[],
        external_urls: ExternalUrl,
        href: string,
        id: string,
        images: Image[],
        name: string,
        type: ObjectType,
        release_date: string,
        release_date_precision: ReleaseDatePrecision,
        uri: string,
    }

    export interface Album extends SimplifiedAlbum {
        copyrights: Copyright[],
        external_ids: ExternalId,
        genres: string[],
        label: string,
        popularity: number,
        tracks: Page<SimplifiedTrack>,
    }

    export interface AudioFeatures {
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
        type: ObjectType,
        uri: string,
        valence: number,
    }

    export interface Category {
        href: string,
        icons: Image[],
        id: string,
        name: string,
    }

    export interface Copyright {
        text: string,
        type: string,
    }

    export interface Cursor {
        after: string,
    }

    export interface Device {
        id: string,
        is_active: boolean,
        is_restricted: boolean,
        name: string,
        type: string,
        volume_percent: number,
    }

    export interface Error {
        status: number,
        message: string,
    }

    // to be defined
    type ExternalId = any;

    // to be defined
    type ExternalUrl = any;

    export interface Followers {
        href: string,
        total: number,
    }

    export interface Image {
        height?: number,
        url: string,
        width?: number,
    }

    export interface Page<T> {
        href: string,
        items: T[],
        limit: number,
        next?: string,
        offset: number,
        previous?: string,
        total: number,
    }

    export interface CursorBasedPage<T> {
        href: string,
        items: T[],
        limit: number,
        next?: string,
        cursors: Cursor,
        total: number,
    }

    export interface SimplifiedPlaylist {
        collaborative: boolean,
        external_urls: ExternalUrl,
        href: string,
        id: string,
        images: Image[],
        name: string,
        owner: PublicUser,
        public?: boolean,
        snapshot_id: PlaylistSnapshotId,
        //TODO: Revisit the inheritence here... Possible inconsistencies in the API
        tracks: Page<PlaylistTrack>,
        type: string,
        uri: string,
    }

    export interface Playlist extends SimplifiedPlaylist {
        description: string,
        followers: Followers,
    }

    export interface PlaylistTrack {
        added_at?: Date,
        added_by?: PublicUser,
        is_local: boolean,
        track: Track,
    }

    export interface Recommendations {
        seeds: RecommendationsSeed[],
        tracks: SimplifiedTrack[],
    }

    export interface RecommendationsSeed {
        afterFilteringSize: number,
        afterRelinkingSize: number,
        href?: string,
        id: string,
        initialPoolSize: number,
        type: RecommendationsSeedType,
    }

    export interface Restriction {
        reason: string,
    }

    export interface SavedTrack {
        added_at: Date,
        track: Track,
    }

    export interface SavedAlbum {
        added_at: Date,
        track: Album,
    }

    export interface Track extends SimplifiedTrack {
        album: SimplifiedAlbum,
        external_ids: ExternalId,
        restrictions: Restriction,
        popularity: number,
    }

    export interface SimplifiedTrack {
        artists: SimplifiedArtist[],
        available_markets: string[],
        disc_number: number,
        duration_ms: number,
        explicit: boolean,
        external_urls: ExternalUrl,
        href: string,
        id: string,
        is_playable: boolean,
        linked_from: TrackLink,
        name: string,
        preview_url?: string,
        track_number: number,
        type: string,
        uri: number,
    }

    export interface TrackLink {
        external_urls: ExternalUrl,
        href: string,
        id: string,
        type: string,
        uri: string,
    }

    export interface PrivateUser extends PublicUser {
        birthdate?: string,
        country?: string,
        email?: string,
        product?: string,
    }

    export interface PublicUser {
        display_name: string,
        external_urls: ExternalUrl,
        followers: Followers,
        href: string,
        id: string,
        images: Image[],
        type: string,
        uri: string,
    }

    export interface PlayHistory {
        track: SimplifiedTrack,
        played_at: Date,
        context: Context,
    }

    export interface Context {
        type: ContextType,
        href: string,
        external_urls: ExternalUrl,
        uri: string,
    }

    export interface Credentials {
        clientId?: string,
        clientSecret?: string,
        redirectUri?: string,
    }

    export interface AuthorizationGrant {
        access_token: string,
        refresh_token: string,
        expires_in: number,
    }

    // Option Definitions
    export interface PauseOptions {
        device_id?: string,
    }

    export interface PlayOptions {
        device_id?: string,
        context_uri: string,
        uris: string[],
        offset: any,
    }

    export interface ShuffleOptions {
        state: boolean,
        deviceId?: string,
    }

    export interface RepeatOptions {
        state: "track" | "context" | "off",
        deviceId?: string
    }

    export interface TransferPlaybackOptions {
        device_ids: string[],
        play?: boolean,
    }

    export interface SearchOptions {
        market?: string,
        limit?: number,
        offset?: number,
    }

    export interface PlaylistSearchOptions {
        country?: string,
        limit?: number,
        offset?: number,
    }

    export interface GetCategoriesOptions extends PlaylistSearchOptions {
        locale?: string,
    }

    export interface GetCategoryOptions {
        country?: string,
        locale?: string,
    }

    export interface FeaturedPlaylistOptions extends PlaylistSearchOptions {
        timestamp?: Date,
        locale?: string,
    }

    export interface PlaylistOptions {
        name?: string,
        public?: boolean,
        collaborative?: boolean,
        description?: string,
    }

    export interface AddTrackToPlaylistOptions {
        position?: number,
    }

    export interface ReorderPlaylistOptions {
        range_length?: number,
        snapshot_id?: PlaylistSnapshotId,
    }

    export interface RemoveTrackFromPlaylistOptions {
        snapshot_id?: PlaylistSnapshotId,
    }
    export interface GetPlaylistTracksOptions extends SearchOptions {
        fields?: string[],
    }

    export interface GetPlaylistOptions {
        limit?: number,
        offset?: number,
    }

    export interface ArtistsAlbumsOptions extends SearchOptions {
        album_type?: string,
    }

    export interface GetAlbumOptions {
        marekt?: string,
    }

    export interface GetTrackOptions {
        marekt?: string,
    }

    export interface FollowPlaylistOptions {
        public?: boolean,
    }

    export interface GetFollowedArtistsOptions {
        limit?: number,
        after?: string,
    }

    export interface MyTopOptions {
        limit?: number,
        offset?: number,
        time_range?: "long_term" | "medium_term" | "short_term",
    }

    export interface RecentlyPlayedOptions {
        limit?: number,
        before?: number,
        after?: number,
    }

}
