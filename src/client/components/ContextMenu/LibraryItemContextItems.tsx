import type { RadarrMovie } from "$lib/apis/radarr/radarrApi";
import type { SonarrSeries } from "$lib/apis/sonarr/sonarrApi";
import settingsStore from "$lib/settings";
import type { TitleType } from "$lib/types";
import ContextMenuItem from "./ContextMenuItem";

export default function LibraryItemContextItems({
  sonarrSeries,
  radarrMovie,
  type,
  tmdbId,
}: {
  sonarrSeries?: SonarrSeries;
  radarrMovie?: RadarrMovie;
  type?: TitleType;
  tmdbId?: number;
}) {
  return (
    <>
      {type === "movie" ? (
        <ContextMenuItem
          disabled={!radarrMovie}
          onClick={() =>
            window.open(
              settingsStore.radarr.baseUrl + "/movie/" + radarrMovie?.tmdbId
            )
          }
        >
          Open in Radarr
        </ContextMenuItem>
      ) : (
        <ContextMenuItem
          disabled={!sonarrSeries}
          onClick={() =>
            window.open(
              settingsStore.sonarr.baseUrl +
                "/series/" +
                sonarrSeries?.titleSlug
            )
          }
        >
          Open in Sonarr
        </ContextMenuItem>
      )}
      <ContextMenuItem
        onClick={() => {
          window.open(`https://www.themoviedb.org/${type}/${tmdbId}`);
        }}
      >
        Open in TMDB
      </ContextMenuItem>
    </>
  );
}
