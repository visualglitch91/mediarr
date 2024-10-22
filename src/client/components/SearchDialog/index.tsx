import { take } from "lodash";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { TmdbMovie2, TmdbSeries2 } from "$lib/apis/tmdb/tmdbApi";
import { searchTmdbTitles } from "$lib/apis/tmdb/tmdbApi";
import { TMDB_POSTER_SMALL } from "$lib/constants";
import useDelayedValue from "$lib/useDelayedValue";
import useMountEffect from "$lib/useMountEffect";
import DialogBase, { DialogBaseControlProps } from "$components/DialogBase";

function DialogMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-zinc-200 opacity-50 font-light p-4">
      {children}
    </div>
  );
}

export default function SearchDialog({
  controlProps,
}: {
  controlProps?: DialogBaseControlProps;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(0);
  const delayedInputValue = useDelayedValue(inputValue, 700);

  const $search = useQuery({
    queryKey: ["search_modal", delayedInputValue] as const,
    queryFn: ({ queryKey: [, query] }) => {
      return searchTmdbTitles(query).then((items) => {
        return items
          .filter((i) => i.media_type !== "person")
          .filter(
            (i: TmdbMovie2 & TmdbSeries2) => i.release_date || i.first_air_date
          ) as (TmdbMovie2 & TmdbSeries2)[];
      });
    },
    select: (data) => {
      return data.map((item) => ({
        // ^ Types not accurate! ^
        tmdbId: item.id || 0,
        type: (item as any).media_type === "movie" ? "movie" : "series",
        posterUri: item.poster_path || "",
        title: item.title || item.name || "",
        year: new Date(
          item.release_date || item.first_air_date || Date.now()
        ).getFullYear(),
        overview: item.overview || "",
      }));
    },
  });

  useMountEffect(() => () => {
    window.clearTimeout(typingTimeoutRef.current);
  });

  return (
    <DialogBase
      controlProps={controlProps}
      disablePadding
      slots={{
        header: (
          <>
            <MagnifyingGlassIcon
              width={20}
              height={20}
              className="text-zinc-400"
            />
            <input
              value={inputValue}
              ref={(ref) => ref?.focus()}
              onChange={(e) => {
                window.clearTimeout(typingTimeoutRef.current);

                setIsTyping(true);

                typingTimeoutRef.current = window.setTimeout(
                  () => setIsTyping(false),
                  700
                );

                setInputValue(e.target.value);
              }}
              type="text"
              className="flex-1 bg-transparent font-light outline-none"
            />
          </>
        ),
      }}
    >
      <>
        {inputValue === "" ? (
          <DialogMessage>
            Start typing to search for movies and TV shows
          </DialogMessage>
        ) : isTyping || $search.isLoading ? (
          <DialogMessage>Loading...</DialogMessage>
        ) : $search.data?.length === 0 ? (
          <DialogMessage>No results</DialogMessage>
        ) : (
          <div className="py-2">
            {take($search.data, 20).map((result) => {
              return (
                <a
                  className="flex px-4 py-2 gap-4 hover:bg-lighten focus-visible:bg-lighten cursor-pointer outline-none"
                  href={`/${result.type}/${result.tmdbId}`}
                  onClick={controlProps?.onClose}
                >
                  <div
                    style={{
                      backgroundImage: `url('${TMDB_POSTER_SMALL}${result.posterUri}')`,
                    }}
                    className="bg-center bg-cover w-16 h-24 rounded-sm"
                  />
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex gap-2">
                      <div className="font-normal tracking-wide">
                        {result.title}
                      </div>
                      <div className="text-zinc-400">{result.year}</div>
                    </div>
                    <div className="text-sm text-zinc-300 line-clamp-3">
                      {result.overview}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </>
    </DialogBase>
  );
}
