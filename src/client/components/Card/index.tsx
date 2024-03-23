import classNames from "classnames";
import { navigate } from "wouter/use-location";
import { ClockIcon, StarIcon } from "@radix-ui/react-icons";
import type { TitleType } from "$lib/types";
import { formatMinutesToTime } from "$lib/utils";

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
  size = "md",
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
  size?: "dynamic" | "md" | "lg";
}) {
  return (
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
        navigate(`/${type}/${tmdbId}`);
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
      <div className="flex flex-col justify-between flex-1 transition-opacity cursor-pointer relative opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 w-full">
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
                  (new Date(completionTime).getTime() - Date.now()) / 1000 / 60
                )}
              </b>
            </div>
          ) : (
            <>
              {rating > 0 && (
                <div className="flex gap-1.5 items-center">
                  <StarIcon />
                  <div className="text-sm text-zinc-200">
                    {rating.toFixed(1)}
                  </div>
                </div>
              )}

              {seasons > 0 && (
                <div className="text-sm text-zinc-200">
                  {seasons} Season{seasons > 1 ? "s" : ""}
                </div>
              )}

              {runtimeMinutes > 0 && (
                <div className="flex gap-1.5 items-center">
                  <ClockIcon />
                  <div className="text-sm text-zinc-200">
                    {formatMinutesToTime(runtimeMinutes)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  );
}
