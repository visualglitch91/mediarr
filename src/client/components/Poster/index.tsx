import classNames from "classnames";
import { navigate } from "wouter/use-location";
import { StarIcon } from "@radix-ui/react-icons";
import { TitleType } from "$lib/types";
import { getTmdbIdFromTvdbId } from "$lib/apis/tmdb/tmdbApi";
import LazyImg from "$components/LazyImg";
import Slot, { Slots } from "$components/Slot";
import RadarrStatus from "$components/RadarrStatus";
import SonarrStatus from "$components/SonarrrStatus";

export default function Poster({
  type = "movie",
  title = "",
  subtitle = "",
  hideStatus,
  shadow,
  size = "md",
  orientation = "landscape",
  backdropUrl,
  rating,
  tmdbId,
  tvdbId,
  slots,
}: {
  type?: TitleType;
  tmdbId?: number;
  tvdbId?: number;
  title?: string;
  subtitle?: string;
  hideStatus?: boolean;
  shadow?: boolean;
  rating?: number;
  size?: "dynamic" | "md" | "lg" | "sm";
  orientation?: "portrait" | "landscape";
  backdropUrl: string;
  slots?: Slots<"topLeft" | "topRight" | "bottomRight" | "footer">;
}) {
  return (
    <button
      type="button"
      className={classNames(
        "relative flex rounded-xl selectable group hover:text-inherit flex-shrink-0 overflow-hidden text-left",
        {
          "aspect-video": orientation === "landscape",
          "aspect-[2/3]": orientation === "portrait",
          "w-32": size === "sm" && orientation === "portrait",
          "h-32": size === "sm" && orientation === "landscape",
          "w-44": size === "md" && orientation === "portrait",
          "h-44": size === "md" && orientation === "landscape",
          "w-60": size === "lg" && orientation === "portrait",
          "h-60": size === "lg" && orientation === "landscape",
          "w-full": size === "dynamic",
          "shadow-lg": shadow,
        }
      )}
      onClick={async () => {
        const _tmdbId =
          tmdbId || (tvdbId && (await getTmdbIdFromTvdbId(tvdbId)));

        if (!_tmdbId) {
          return;
        }

        navigate(`/${type}/${_tmdbId}`);
      }}
    >
      <LazyImg
        src={backdropUrl}
        className="absolute inset-0 group-hover:scale-105 transition-transform"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-black"
        style={{ filter: "blur(50px)", transform: "scale(3)" }}
      >
        <LazyImg src={backdropUrl} />
      </div>

      <div
        className={classNames(
          "flex-1 flex flex-col justify-between bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity z-[1]",
          { "py-2 px-3": true }
        )}
      >
        <div className="flex justify-self-start justify-between">
          <Slot slots={slots} name="topLeft">
            <div>
              <h1 className="text-zinc-100 font-bold line-clamp-2 text-lg">
                {title}
              </h1>
              <h2 className="text-zinc-300 text-sm font-medium line-clamp-2">
                {subtitle}
              </h2>
            </div>
          </Slot>
          <Slot slots={slots} name="topRight">
            <div />
          </Slot>
        </div>
        <div className="flex justify-self-end justify-between">
          <slot name="bottom-left">
            <div>
              {rating && (
                <h2 className="flex items-center gap-1.5 text-sm text-zinc-300 font-medium">
                  <StarIcon />
                  {rating.toFixed(1)}
                </h2>
              )}
            </div>
          </slot>
          <Slot slots={slots} name="bottomRight">
            <div />
          </Slot>
        </div>
      </div>

      {!hideStatus && (
        <div className="absolute bottom-0 w-full">
          {type === "movie" && tmdbId ? (
            <RadarrStatus tmdbId={tmdbId} />
          ) : type === "series" ? (
            <SonarrStatus identifier={{ tvdbId, title }} />
          ) : null}
        </div>
      )}
    </button>
  );
}
