import type { TmdbMovie2, TmdbSeries2 } from "$lib/apis/tmdb/tmdbApi";
import {
  TMDB_MOVIE_GENRES,
  TMDB_SERIES_GENRES,
  getTmdbMovie,
  getTmdbMovieBackdrop,
  getTmdbSeries,
  getTmdbSeriesBackdrop,
} from "$lib/apis/tmdb/tmdbApi";
import { TMDB_BACKDROP_SMALL } from "$lib/constants";
import Card from "./index";

export const fetchCardTmdbMovieProps = async ({
  id = 0,
}: TmdbMovie2): Promise<React.ComponentProps<typeof Card>> => {
  const movie = await getTmdbMovie(id);
  const backdropUri = await getTmdbMovieBackdrop(id);

  const genres =
    movie?.genres?.map((g) => g.name || "") ||
    //@ts-expect-error
    movie?.genre_ids?.map(
      (id: number) => TMDB_MOVIE_GENRES.find((g) => g.id === id)?.name || ""
    ) ||
    [];

  return {
    tmdbId: movie?.id || 0,
    title: movie?.title || "",
    genres,
    runtimeMinutes: movie?.runtime,
    backdropUrl: backdropUri ? TMDB_BACKDROP_SMALL + backdropUri : "",
    rating: movie?.vote_average || 0,
  };
};

export const fetchCardTmdbSeriesProps = async ({
  id = 0,
}: TmdbSeries2): Promise<React.ComponentProps<typeof Card>> => {
  const series = await getTmdbSeries(id);
  const backdropUri = await getTmdbSeriesBackdrop(id);

  const genres =
    series?.genres?.map((g) => g.name || "") ||
    //@ts-expect-error
    series?.genre_ids?.map(
      (id: number) => TMDB_SERIES_GENRES.find((g) => g.id === id)?.name || ""
    ) ||
    [];

  return {
    tmdbId: series?.id || 0,
    title: series?.name || "",
    genres,
    runtimeMinutes: series?.episode_run_time?.[0] || 0,
    seasons: series?.seasons?.length || 0,
    backdropUrl: backdropUri ? TMDB_BACKDROP_SMALL + backdropUri : "",
    rating: series?.vote_average || 0,
    type: "series",
  };
};

export const fetchCardTmdbProps = async (
  item: TmdbSeries2 | TmdbMovie2
): Promise<React.ComponentProps<typeof Card>> => {
  if ("name" in item) return fetchCardTmdbSeriesProps(item);
  return fetchCardTmdbMovieProps(item);
};
