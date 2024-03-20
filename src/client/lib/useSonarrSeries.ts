import useAllSonarrSeries from "./useAllSonarrSeries";

function shorten(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
}

export default function useSonarrSeries(title: string) {
  return useAllSonarrSeries({
    select: (data) =>
      data?.find(
        (i) =>
          shorten(i.titleSlug || "") === shorten(title) ||
          i.alternateTitles?.find(
            (t) => shorten(t.title || "") === shorten(title)
          )
      ),
  });
}
