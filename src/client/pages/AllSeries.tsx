import Poster from "$components/Poster";
import { getSonarrPosterUrl } from "$lib/apis/sonarr/sonarrApi";
import useAllSonarrSeries from "$lib/useAllSonarrSeries";
import useResizeObserver from "use-resize-observer";

const POSTER_WIDTH_WITH_GAP = 176 + 16;

export default function AllSeries() {
  const $sonarrSeries = useAllSonarrSeries();
  const columns = Math.floor((window.innerWidth - 48) / POSTER_WIDTH_WITH_GAP);

  useResizeObserver({ ref: document.body });

  return (
    <div className="p-8">
      <div
        className="flex flex-wrap gap-x-4 gap-y-8 mx-auto"
        style={{ width: columns * POSTER_WIDTH_WITH_GAP }}
      >
        {$sonarrSeries.data?.map((item) => {
          const backdropUrl = getSonarrPosterUrl(item);

          return (
            <Poster
              key={item.tvdbId}
              type="series"
              tvdbId={item.tvdbId}
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
