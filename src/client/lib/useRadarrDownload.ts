import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { RadarrDownload, getRadarrDownloads } from "./apis/radarr/radarrApi";

export default function useRadarrDownload<K>(
  tmdbId: number,
  options?: Omit<
    UseQueryOptions<RadarrDownload[], any, K>,
    "queryKey" | "queryFn" | "select"
  >
) {
  return useQuery({
    queryKey: ["radarr__downloads"] as const,
    queryFn: getRadarrDownloads,
    select: (downloads) => downloads.find((d) => d.movie.tmdbId === tmdbId),
    ...options,
  });
}
