import { DotsVerticalIcon } from "@radix-ui/react-icons";
import type { RadarrMovie } from "$lib/apis/radarr/radarrApi";
import type { SonarrSeries } from "$lib/apis/sonarr/sonarrApi";
import type { TitleType } from "$lib/types";
import Button from "$components/Button";
import ContextMenuButton from "$components/ContextMenu";
import LibraryItemContextItems from "$components/ContextMenu/LibraryItemContextItems";

export default function OpenInButton({
  title = "",
  sonarrSeries,
  radarrMovie,
  type,
  tmdbId,
}: {
  title?: string;
  sonarrSeries?: SonarrSeries;
  radarrMovie?: RadarrMovie;
  type: TitleType;
  tmdbId: number;
}) {
  return (
    <ContextMenuButton
      heading={title}
      slots={{
        menu: (
          <LibraryItemContextItems
            sonarrSeries={sonarrSeries}
            radarrMovie={radarrMovie}
            type={type}
            tmdbId={tmdbId}
          />
        ),
      }}
    >
      <Button slim>
        <DotsVerticalIcon width={24} height={24} />
      </Button>
    </ContextMenuButton>
  );
}
