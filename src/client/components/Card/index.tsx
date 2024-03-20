import type { TitleType } from "$lib/types";
import { formatMinutesToTime } from "$lib/utils";
import classNames from "classnames";
import { ClockIcon, StarIcon } from "@radix-ui/react-icons";
import ContextMenu from "$components/ContextMenu";
import ProgressBar from "$components/ProgressBar";
import useRadarrMovie from "$lib/useRadarrMovie";
import useSonarrSeries from "$lib/useSonarrSeries";
import useTitleModal from "$lib/useTitleModal";
import LibraryItemContextItems from "$components/ContextMenu/LibraryItemContextItems";
import { navigate } from "wouter/use-location";

export default function Card({
  tmdbId,
  type = "movie",
  title,
  genres = [],
  runtimeMinutes = 0,
  seasons = 0,
  completionTime = "",
  backdropUrl,
  rating,
  available = true,
  progress = 0,
  size = "md",
  openInModal = true,
}: {
  tmdbId: number;
  type?: TitleType;
  title: string;
  genres?: string[];
  runtimeMinutes?: number;
  seasons?: number;
  completionTime?: string;
  backdropUrl: string;
  rating: number;
  available?: boolean;
  progress?: number;
  size?: "dynamic" | "md" | "lg";
  openInModal?: boolean;
}) {
  const $radarrMovie = useRadarrMovie(tmdbId);
  const $sonarrSerie = useSonarrSeries(title);
  const openTitleModal = useTitleModal();

  return (
    <ContextMenu
      heading={title}
      slots={{
        menu: (
          <LibraryItemContextItems
            radarrMovie={$radarrMovie.data}
            sonarrSeries={$sonarrSerie.data}
            type={type}
            tmdbId={tmdbId}
          />
        ),
      }}
    >
      <button
        className={classNames(
          "rounded overflow-hidden relative shadow-lg shrink-0 aspect-video selectable hover:text-inherit flex flex-col justify-between group placeholder-image",
          "p-2 px-3 gap-2",
          {
            "h-40": size === "md",
            "h-60": size === "lg",
            "w-full": size === "dynamic",
          }
        )}
        onClick={() => {
          if (openInModal) {
            openTitleModal({ type, id: tmdbId, provider: "tmdb" });
          } else {
            navigate(`/${type}/${tmdbId}`);
          }
        }}
      >
        <div
          style={{ backgroundImage: `url('${backdropUrl}') ` }}
          className="absolute inset-0 bg-center bg-cover group-hover:scale-105 group-focus-visible:scale-105 transition-transform"
        />
        <div
          className={classNames(
            "absolute inset-0 transition-opacity bg-darken sm:bg-opacity-100 bg-opacity-50",
            {
              "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100":
                available,
            }
          )}
        />
        <div className="flex flex-col justify-between flex-1 transition-opacity cursor-pointer relative opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
          <div className="text-left">
            <h1 className="font-bold tracking-wider text-lg">{title}</h1>
            <div className="text-xs text-zinc-300 tracking-wider font-medium">
              {genres
                .map((genre) => genre.charAt(0).toUpperCase() + genre.slice(1))
                .join(", ")}
            </div>
          </div>
          <div className="flex justify-between items-end">
            {completionTime ? (
              <div className="text-sm font-medium text-zinc-200 tracking-wide">
                Downloaded in{" "}
                <b>
                  {formatMinutesToTime(
                    (new Date(completionTime).getTime() - Date.now()) /
                      1000 /
                      60
                  )}
                </b>
              </div>
            ) : (
              <>
                {runtimeMinutes && (
                  <div className="flex gap-1.5 items-center">
                    <ClockIcon />
                    <div className="text-sm text-zinc-200">
                      {progress
                        ? formatMinutesToTime(
                            runtimeMinutes - runtimeMinutes * (progress / 100)
                          ) + " left"
                        : formatMinutesToTime(runtimeMinutes)}
                    </div>
                  </div>
                )}

                {seasons && (
                  <div className="text-sm text-zinc-200">
                    {seasons} Season{seasons > 1 ? "s" : ""}
                  </div>
                )}

                {rating && (
                  <div className="flex gap-1.5 items-center">
                    <StarIcon />
                    <div className="text-sm text-zinc-200">
                      {rating.toFixed(1)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {progress && (
          <div className="relative">
            <ProgressBar value={progress} />
          </div>
        )}
      </button>
    </ContextMenu>
  );
}
