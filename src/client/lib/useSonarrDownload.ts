import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { SonarrDownload, getSonarrDownloads } from "./apis/sonarr/sonarrApi";

export default function useSonarrDownload<K>(
  tvdbId: number | undefined,
  options?: Omit<
    UseQueryOptions<SonarrDownload[], any, K>,
    "queryKey" | "queryFn" | "select"
  >
) {
  return useQuery({
    queryKey: ["sonarr__downloads"] as const,
    queryFn: getSonarrDownloads,
    select: (downloads) => downloads.find((d) => d.series.tvdbId === tvdbId),
    ...options,
  });
}
