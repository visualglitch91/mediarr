import useAllSonarrSeries from "./useAllSonarrSeries";

function shorten(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
}

export function useSonarrSeriesByTitle(title: string | undefined) {
  return useAllSonarrSeries({
    select: (data) =>
      data?.find((i) =>
        !title
          ? false
          : shorten(i.titleSlug || "") === shorten(title) ||
            i.alternateTitles?.find(
              (t) => shorten(t.title || "") === shorten(title)
            )
      ),
  });
}

export default function useSonarrSeries(tvdbId: number | undefined) {
  return useAllSonarrSeries({
    select: (data) => data?.find((i) => i.tvdbId === tvdbId),
  });
}
