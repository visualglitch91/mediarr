import ky from "ky";
import createClient from "openapi-fetch";
import type { components, paths } from "$lib/apis/radarr/radarr.generated";
import { getTmdbMovie } from "$lib/apis/tmdb/tmdbApi";
import settingsStore from "$lib/settings";
import { log } from "$lib/utils";

export type RadarrMovie = components["schemas"]["MovieResource"];
export type MovieFileResource = components["schemas"]["MovieFileResource"];
export type ReleaseResource = components["schemas"]["ReleaseResource"];
export type RadarrDownload = components["schemas"]["QueueResource"] & {
  movie: RadarrMovie;
};

export type DiskSpaceInfo = components["schemas"]["DiskSpaceResource"];

export interface RadarrMovieOptions {
  title: string;
  qualityProfileId: number;
  minimumAvailability: "announced" | "inCinemas" | "released";
  tags: number[];
  profileId: number;
  year: number;
  rootFolderPath: string;
  tmdbId: number;
  monitored?: boolean;
  searchNow?: boolean;
}

function getRadarrApi() {
  const baseUrl = settingsStore.radarr.baseUrl;
  const apiKey = settingsStore.radarr.apiKey;
  const rootFolder = settingsStore.radarr.rootFolderPath;
  const qualityProfileId = settingsStore.radarr.qualityProfileId;

  if (!baseUrl || !apiKey || !rootFolder || !qualityProfileId) return undefined;

  return createClient<paths>({
    baseUrl,
    headers: {
      "X-Api-Key": apiKey,
    },
  });
}

export const getRadarrMovies = (): Promise<RadarrMovie[]> =>
  getRadarrApi()
    ?.GET("/api/v3/movie", { params: {} })
    .then((r) => r.data || []) || Promise.resolve([]);

export const getRadarrMovieByTmdbId = (
  tmdbId: string
): Promise<RadarrMovie | undefined> =>
  getRadarrApi()
    ?.GET("/api/v3/movie", {
      params: {
        query: {
          tmdbId: Number(tmdbId),
        },
      },
    })
    .then((r) => r.data?.find((m) => (m.tmdbId as any) == tmdbId)) ||
  Promise.resolve(undefined);

export const addMovieToRadarr = async (tmdbId: number) => {
  const tmdbMovie = await getTmdbMovie(tmdbId);
  const radarrMovie = await lookupRadarrMovieByTmdbId(tmdbId);

  if (radarrMovie?.id) throw new Error("Movie already exists");

  if (!tmdbMovie) throw new Error("Movie not found");

  const options: RadarrMovieOptions = {
    qualityProfileId: settingsStore.radarr.qualityProfileId || 0,
    profileId: settingsStore.radarr.profileId || 0,
    rootFolderPath: settingsStore.radarr.rootFolderPath || "",
    minimumAvailability: "announced",
    title: tmdbMovie.title || tmdbMovie.original_title || "",
    tmdbId: tmdbMovie.id || 0,
    year: Number(tmdbMovie.release_date?.slice(0, 4)),
    monitored: true,
    tags: [],
    searchNow: true,
  };

  return (
    getRadarrApi()
      ?.POST("/api/v3/movie", {
        params: {},
        body: options,
      })
      .then((r) => r.data) || Promise.resolve(undefined)
  );
};

export const cancelDownloadRadarrMovie = async (downloadId: number) => {
  const deleteResponse = await getRadarrApi()
    ?.DELETE("/api/v3/queue/{id}", {
      params: {
        path: {
          id: downloadId,
        },
        query: {
          blocklist: false,
          removeFromClient: true,
        },
      },
    })
    .then((r) => log(r));

  return !!deleteResponse?.response.ok;
};

export const fetchRadarrReleases = (movieId: number) =>
  getRadarrApi()
    ?.GET("/api/v3/release", { params: { query: { movieId: movieId } } })
    .then((r) => r.data || []) || Promise.resolve([]);

export const downloadRadarrMovie = (guid: string, indexerId: number) =>
  getRadarrApi()
    ?.POST("/api/v3/release", {
      params: {},
      body: {
        indexerId,
        guid,
      },
    })
    .then((res) => res.response.ok) || Promise.resolve(false);

export const deleteRadarrMovie = (id: number) =>
  getRadarrApi()
    ?.DELETE("/api/v3/moviefile/{id}", {
      params: {
        path: {
          id,
        },
      },
    })
    .then((res) => res.response.ok) || Promise.resolve(false);

export const getRadarrDownloads = (): Promise<RadarrDownload[]> =>
  getRadarrApi()
    ?.GET("/api/v3/queue", {
      params: {
        query: {
          includeMovie: true,
        },
      },
    })
    .then(
      (r) =>
        (r.data?.records?.filter(
          (record) => record.movie
        ) as RadarrDownload[]) || []
    ) || Promise.resolve([]);

export const getRadarrDownloadsById = (radarrId: number) =>
  getRadarrDownloads().then((downloads) =>
    downloads.filter((d) => d.movie.id === radarrId)
  );

export const getRadarrDownloadsByTmdbId = (tmdbId: number) =>
  getRadarrDownloads().then((downloads) =>
    downloads.filter((d) => d.movie.tmdbId === tmdbId)
  );

const lookupRadarrMovieByTmdbId = (tmdbId: number) =>
  getRadarrApi()
    ?.GET("/api/v3/movie/lookup/tmdb", {
      params: {
        query: {
          tmdbId,
        },
      },
    })
    .then((r) => r.data as any as RadarrMovie) || Promise.resolve(undefined);

export const getDiskSpace = (): Promise<DiskSpaceInfo[]> =>
  getRadarrApi()
    ?.GET("/api/v3/diskspace", {})
    .then((d) => d.data || []) || Promise.resolve([]);

export const removeFromRadarr = (id: number) =>
  getRadarrApi()
    ?.DELETE("/api/v3/movie/{id}", {
      params: {
        path: {
          id,
        },
      },
    })
    .then((res) => res.response.ok) || Promise.resolve(false);

export const getRadarrHealth = async (
  baseUrl: string | undefined = undefined,
  apiKey: string | undefined = undefined
) =>
  ky
    .get((baseUrl || settingsStore.radarr.baseUrl) + "/api/v3/health", {
      headers: {
        "X-Api-Key": apiKey || settingsStore.radarr.apiKey,
      },
    })
    .then((res) => res.statusCode === 200)
    .catch(() => false);

export const getRadarrRootFolders = async (
  baseUrl: string | undefined = undefined,
  apiKey: string | undefined = undefined
) =>
  ky
    .get<components["schemas"]["RootFolderResource"][]>(
      (baseUrl || settingsStore.radarr.baseUrl) + "/api/v3/rootFolder",
      {
        headers: {
          "X-Api-Key": apiKey || settingsStore.radarr.apiKey,
        },
      }
    )
    .json()
    .then((res) => res || []);

export const getRadarrQualityProfiles = async (
  baseUrl: string | undefined = undefined,
  apiKey: string | undefined = undefined
) =>
  ky
    .get<components["schemas"]["QualityProfileResource"][]>(
      (baseUrl || settingsStore.radarr.baseUrl) + "/api/v3/qualityprofile",
      {
        headers: {
          "X-Api-Key": apiKey || settingsStore.radarr.apiKey,
        },
      }
    )
    .json()
    .then((res) => res || []);

export function getRadarrPosterUrl(item: RadarrMovie, original = false) {
  const url =
    settingsStore.radarr.baseUrl +
    (item.images?.find((i) => i.coverType === "poster")?.url || "");

  if (!original) return url.replace("poster.jpg", `poster-${500}.jpg`);

  return url;
}