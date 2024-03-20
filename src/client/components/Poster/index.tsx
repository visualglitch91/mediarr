import classNames from "classnames";
import { navigate } from "wouter/use-location";
import { StarIcon } from "@radix-ui/react-icons";
import { TitleType } from "$lib/types";
import useTitleModal from "$lib/useTitleModal";
import LazyImg from "$components/LazyImg";
import ProgressBar from "$components/ProgressBar";
import Slot, { Slots } from "$components/Slot";

export default function Poster({
  openInModal = true,
  type = "movie",
  title = "",
  subtitle = "",
  progress = 0,
  shadow = false,
  size = "md",
  orientation = "landscape",
  backdropUrl,
  rating,
  tmdbId,
  tvdbId,
  slots = {},
}: {
  openInModal?: boolean;
  type?: TitleType;
  tmdbId?: number;
  tvdbId?: number;
  title?: string;
  subtitle?: string;
  progress?: number;
  shadow?: boolean;
  rating?: number;
  size?: "dynamic" | "md" | "lg" | "sm";
  orientation?: "portrait" | "landscape";
  backdropUrl: string;
  slots?: Slots<"topLeft" | "topRight" | "bottomRight">;
}) {
  const openTitleModal = useTitleModal();

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
      onClick={() => {
        if (openInModal) {
          if (tmdbId) {
            openTitleModal({ type, id: tmdbId, provider: "tmdb" });
          } else if (tvdbId) {
            openTitleModal({ type, id: tvdbId, provider: "tvdb" });
          }
        } else {
          navigate(tmdbId || tvdbId ? `/${type}/${tmdbId || tvdbId}` : "/");
        }
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

      {progress > 0 && (
        <div className="absolute bottom-2 lg:bottom-3 inset-x-2 lg:inset-x-3 bg-gradient-to-t ease-in-out z-[1]">
          <ProgressBar value={progress} />
        </div>
      )}
    </button>
  );
}
