import { times } from "lodash";
import { RouteComponentProps } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getTmdbGenreMovies, getTmdbGenreSeries } from "$lib/apis/tmdb/tmdbApi";
import { genres } from "$lib/discover";
import {
  fetchCardTmdbMovieProps,
  fetchCardTmdbSeriesProps,
} from "$components/Card/utils";
import CardPlaceholder from "$components/CardPlaceholder";
import GridPage from "$components/GridPage";
import Card from "$components/Card";

export default function Genre({
  params: { genre: genreKey },
}: RouteComponentProps<{ genre: string }>) {
  const genre = genres[genreKey];

  const { data } = useQuery({
    queryKey: ["page__genre", genre] as const,
    queryFn: async ({ queryKey: [, genre] }) => {
      const movies = await getTmdbGenreMovies(genre.tmdbGenreId.movie);
      const series = await getTmdbGenreSeries(genre.tmdbGenreId.tv);

      return await Promise.all(
        movies
          .map(fetchCardTmdbMovieProps)
          .concat(series.map(fetchCardTmdbSeriesProps))
      );
    },
  });

  if (!data) {
    return (
      <GridPage title={genre.title}>
        {times(20, (i) => (
          <CardPlaceholder key={i} index={i} size="dynamic" />
        ))}
      </GridPage>
    );
  }

  return (
    <GridPage title={genre.title}>
      {data.map((props) => (
        <Card key={props.tmdbId} {...props} size="dynamic" />
      ))}
    </GridPage>
  );
}
