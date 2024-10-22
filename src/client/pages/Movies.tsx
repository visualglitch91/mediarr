import Poster from "$components/Poster";
import { getRadarrPosterUrl } from "$lib/apis/radarr/radarrApi";
import useRadarrMovies from "$lib/useRadarrMovies";
import useResizeObserver from "use-resize-observer";

const POSTER_WIDTH_WITH_GAP = 176 + 16;

export default function Movies() {
  const $radarMovies = useRadarrMovies();
  const columns = Math.floor((window.innerWidth - 48) / POSTER_WIDTH_WITH_GAP);

  useResizeObserver({ ref: document.body });

  return (
    <div className="p-8">
      <div
        className="flex flex-wrap gap-x-4 gap-y-8 mx-auto"
        style={{ width: columns * POSTER_WIDTH_WITH_GAP }}
      >
        {$radarMovies.data?.map((item) => {
          const backdropUrl = getRadarrPosterUrl(item);

          return (
            <Poster
              key={item.tmdbId}
              type="movie"
              tmdbId={item.tmdbId}
              orientation="portrait"
              title={item.title || ""}
              backdropUrl={backdropUrl || ""}
            />
          );
        })}
      </div>
    </div>
  );
}
