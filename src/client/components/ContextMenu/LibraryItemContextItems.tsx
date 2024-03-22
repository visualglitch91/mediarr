import type { RadarrMovie } from "$lib/apis/radarr/radarrApi";
import type { SonarrSeries } from "$lib/apis/sonarr/sonarrApi";
import getSettings from "$lib/settings";
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
  const settings = getSettings();

  return (
    <>
      {type === "movie" ? (
        <ContextMenuItem
          disabled={!radarrMovie}
          onClick={() =>
            window.open(
              settings.radarr.real_base_url + "/movie/" + radarrMovie?.tmdbId
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
              settings.sonarr.real_base_url +
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
