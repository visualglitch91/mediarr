import classNames from "classnames";
import Slot, { Slots } from "$components/Slot";

export default function EpisodeCard({
  backdropUrl,
  title = "",
  subtitle = "",
  episodeNumber,
  runtime = 0,
  airDate,
  size = "md",
  onClick,
  slots,
}: {
  backdropUrl: string;
  title?: string;
  subtitle?: string;
  episodeNumber?: string;
  runtime?: number;
  progress?: number;
  airDate?: Date;
  size?: "md" | "sm" | "dynamic";
  onClick?: () => void;
  slots?: Slots<"leftTop" | "rightTop">;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "aspect-video bg-center bg-cover rounded-lg overflow-hidden transition-opacity shadow-lg selectable flex-shrink-0 placeholder-image relative",
        "flex flex-col px-2 lg:px-3 py-2 gap-2 text-left",
        {
          "h-44": size === "md",
          "h-36 lg:h-44": size === "sm",
          "h-full": size === "dynamic",
          group: false,
          "cursor-default": true,
        }
      )}
      style={{ backgroundImage: `url('${backdropUrl}')` }}
    >
      <div
        className={classNames(
          "absolute inset-0 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0 bg-gradient-to-t",
          {
            "bg-darken": true,
            "bg-gradient-to-t from-darken": false,
          }
        )}
      />
      <div
        className={classNames(
          "flex-1 flex flex-col justify-between relative group-hover:opacity-0 group-focus-visible:opacity-0 transition-all",
          "text-xs lg:text-sm font-medium text-zinc-300",
          { "opacity-8": true }
        )}
      >
        <div className="flex justify-between items-center">
          <div>
            <Slot slots={slots} name="leftTop">
              {airDate && airDate > new Date() ? (
                <p>
                  {airDate.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              ) : episodeNumber ? (
                <p>{episodeNumber}</p>
              ) : null}
            </Slot>
          </div>
          <div>
            <Slot slots={slots} name="rightTop">
              {runtime && <p>{runtime.toFixed(0)} min</p>}
            </Slot>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <slot name="left-bottom">
            <div className="flex flex-col items-start">
              {subtitle && (
                <h2 className="text-zinc-300 text-sm font-medium">
                  {subtitle}
                </h2>
              )}
              {title && (
                <h1 className="text-zinc-200 text-base font-medium text-left line-clamp-2">
                  {title}
                </h1>
              )}
            </div>
          </slot>
        </div>
      </div>
    </button>
  );
}
