import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { SonarrSeries, getSonarrSeries } from "./apis/sonarr/sonarrApi";

export default function useAllSonarrSeries<K = SonarrSeries[]>(
  options?: Omit<
    UseQueryOptions<SonarrSeries[], any, K>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: ["sonarr__series"] as const,
    queryFn: getSonarrSeries,
    ...options,
  });
}
