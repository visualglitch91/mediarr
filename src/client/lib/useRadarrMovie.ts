import useRadarrMovies from "./useRadarrMovies";

export default function useRadarrMovie(tmdbId: number) {
  return useRadarrMovies({
    select: (data) => data.find((movie) => movie.tmdbId === tmdbId),
  });
}
