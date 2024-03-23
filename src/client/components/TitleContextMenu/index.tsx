import { DotsVerticalIcon } from "@radix-ui/react-icons";
import type { RadarrMovie } from "$lib/apis/radarr/radarrApi";
import type { SonarrSeries } from "$lib/apis/sonarr/sonarrApi";
import type { TitleType } from "$lib/types";
import getSettings from "$lib/settings";
import useModal from "$lib/useModal";
import Button from "$components/Button";
import ContextMenuButton from "$components/ContextMenu";
import ContextMenuItem from "$components/ContextMenu/ContextMenuItem";
import UnmonitorDialog from "$components/UnmonitorDialog";

export default function TitleContextMenu({
  title = "",
  sonarrSeries,
  radarrMovie,
  type,
  tmdbId,
  requestRefetch = () => Promise.resolve(),
}: {
  title?: string;
  sonarrSeries?: SonarrSeries;
  radarrMovie?: RadarrMovie;
  type: TitleType;
  tmdbId: number;
  requestRefetch?: () => Promise<any>;
}) {
  const mount = useModal();
  const settings = getSettings();

  return (
    <ContextMenuButton
      heading={title}
      slots={{
        menu: (
          <>
            {(radarrMovie || sonarrSeries) && (
              <ContextMenuItem
                onClick={() =>
                  mount((controlProps) => (
                    <UnmonitorDialog
                      radarrMovie={radarrMovie}
                      sonarrSeries={sonarrSeries}
                      requestRefetch={requestRefetch}
                      controlProps={controlProps}
                    />
                  ))
                }
              >
                Unmonitor
              </ContextMenuItem>
            )}
            {type === "movie" ? (
              <ContextMenuItem
                disabled={!radarrMovie}
                onClick={() =>
                  window.open(
                    settings.radarr.real_base_url +
                      "/movie/" +
                      radarrMovie?.tmdbId
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
        ),
      }}
    >
      <Button slim>
        <DotsVerticalIcon width={24} height={24} />
      </Button>
    </ContextMenuButton>
  );
}
