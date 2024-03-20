import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { RadarrMovie, getRadarrMovies } from "./apis/radarr/radarrApi";

export default function useRadarrMovies<K>(
  options?: Omit<UseQueryOptions<RadarrMovie[], any, K>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["radarr__movies"] as const,
    queryFn: getRadarrMovies,
    ...options,
  });
}
