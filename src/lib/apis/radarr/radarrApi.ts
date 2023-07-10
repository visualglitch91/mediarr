import createClient from 'openapi-fetch';
import { log, request } from '$lib/utils';
import type { paths } from '$lib/apis/radarr/radarr.generated';
import type { components } from '$lib/apis/radarr/radarr.generated';
import { getTmdbMovie } from '$lib/apis/tmdb/tmdbApi';
import { PUBLIC_RADARR_API_KEY, PUBLIC_RADARR_BASE_URL } from '$env/static/public';

export type RadarrMovie = components['schemas']['MovieResource'];
export type MovieFileResource = components['schemas']['MovieFileResource'];
export type ReleaseResource = components['schemas']['ReleaseResource'];
export type RadarrDownload = components['schemas']['QueueResource'] & { movie: RadarrMovie };
export type DiskSpaceInfo = components['schemas']['DiskSpaceResource'];

export interface RadarrMovieOptions {
	title: string;
	qualityProfileId: number;
	minimumAvailability: 'announced' | 'inCinemas' | 'released';
	tags: number[];
	profileId: number;
	year: number;
	rootFolderPath: string;
	tmdbId: number;
	monitored?: boolean;
	searchNow?: boolean;
}

export const RadarrApi = createClient<paths>({
	baseUrl: PUBLIC_RADARR_BASE_URL,
	headers: {
		'X-Api-Key': PUBLIC_RADARR_API_KEY
	}
});

export const getRadarrMovies = (): Promise<RadarrMovie[]> =>
	RadarrApi.get('/api/v3/movie', {
		params: {}
	}).then((r) => r.data || []);

export const requestRadarrMovie = () => request(getRadarrMovieByTmdbId);

export const getRadarrMovieByTmdbId = (tmdbId: string): Promise<RadarrMovie | undefined> =>
	RadarrApi.get('/api/v3/movie', {
		params: {
			query: {
				tmdbId: Number(tmdbId)
			}
		}
	}).then((r) => r.data?.find((m) => (m.tmdbId as any) == tmdbId));

export const addRadarrMovie = async (tmdbId: string) => {
	const tmdbMovie = await getTmdbMovie(tmdbId);
	const radarrMovie = await lookupRadarrMovieByTmdbId(tmdbId);
	console.log('fetched movies', tmdbMovie, radarrMovie);

	if (radarrMovie?.id) throw new Error('Movie already exists');

	if (!tmdbMovie) throw new Error('Movie not found');

	const qualityProfile = 4;
	const options: RadarrMovieOptions = {
		qualityProfileId: qualityProfile,
		profileId: qualityProfile,
		rootFolderPath: '/movies',
		minimumAvailability: 'announced',
		title: tmdbMovie.title,
		tmdbId: tmdbMovie.id,
		year: Number((await tmdbMovie).release_date.slice(0, 4)),
		monitored: false,
		tags: [],
		searchNow: false
	};

	return RadarrApi.post('/api/v3/movie', {
		params: {},
		body: options
	}).then((r) => r.data);
};

export const cancelDownloadRadarrMovie = async (downloadId: number) => {
	const deleteResponse = await RadarrApi.del('/api/v3/queue/{id}', {
		params: {
			path: {
				id: downloadId
			},
			query: {
				blocklist: false,
				removeFromClient: true
			}
		}
	}).then((r) => log(r));

	return deleteResponse.response.ok;
};

export const fetchRadarrReleases = (movieId: string) =>
	RadarrApi.get('/api/v3/release', { params: { query: { movieId: Number(movieId) } } }).then(
		(r) => r.data
	);

export const downloadRadarrMovie = (guid: string) =>
	RadarrApi.post('/api/v3/release', {
		params: {},
		body: {
			indexerId: 2,
			guid
		}
	});

export const deleteRadarrMovie = (id: number) =>
	RadarrApi.del('/api/v3/moviefile/{id}', {
		params: {
			path: {
				id
			}
		}
	}).then((res) => res.response.ok);

export const getRadarrDownloads = (): Promise<RadarrDownload[]> =>
	RadarrApi.get('/api/v3/queue', {
		params: {
			query: {
				includeMovie: true
			}
		}
	}).then((r) => (r.data?.records?.filter((record) => record.movie) as RadarrDownload[]) || []);

export const getRadarrDownloadById = (radarrId: number) =>
	getRadarrDownloads().then((downloads) => downloads.find((d) => d.movie.id === radarrId));

const lookupRadarrMovieByTmdbId = (tmdbId: string) =>
	RadarrApi.get('/api/v3/movie/lookup/tmdb', {
		params: {
			query: {
				tmdbId: Number(tmdbId)
			}
		}
	}).then((r) => r.data as any as RadarrMovie);

export const getDiskSpace = (): Promise<DiskSpaceInfo[]> =>
	RadarrApi.get('/api/v3/diskspace', {}).then((d) => d.data || []);
