import ky from "ky";
import { times } from "lodash";
import { RouteComponentProps } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { networks } from "$lib/discover";
import {
  fetchCardTmdbMovieProps,
  fetchCardTmdbSeriesProps,
} from "$components/Card/utils";
import CardPlaceholder from "$components/CardPlaceholder";
import GridPage from "$components/GridPage";
import Card from "$components/Card";
import { TmdbApiOpen } from "$lib/apis/tmdb/tmdbApi";

export default function Network({
  params: { network: networkKey },
}: RouteComponentProps<{ network: string }>) {
  const network = networks[networkKey];

  const { data } = useQuery({
    refetchOnMount: false,
    queryKey: ["page__network", network] as const,
    queryFn: async ({ queryKey: [, network] }) => {
      const items = await ky.get(`/api/trending/${network.key}`).json<
        {
          type: "series" | "movie";
          title: string;
        }[]
      >();

      return Promise.all(
        items.map((item) => {
          if (item.type === "series") {
            return TmdbApiOpen.GET("/3/search/tv", {
              params: {
                query: {
                  query: item.title,
                },
              },
            })
              .then((res) =>
                (res.data?.results || []).find(
                  (it) => it.name?.toLowerCase() === item.title?.toLowerCase()
                )
              )
              .then((item) => item && fetchCardTmdbSeriesProps(item));
          }

          if (item.type === "movie") {
            return TmdbApiOpen.GET("/3/search/movie", {
              params: {
                query: {
                  query: item.title,
                },
              },
            })
              .then((res) =>
                (res.data?.results || []).find(
                  (it) => it.title?.toLowerCase() === item.title?.toLowerCase()
                )
              )
              .then((item) => item && fetchCardTmdbMovieProps(item));
          }

          throw new Error("Invalid item type");
        })
      );
    },
  });

  if (!data) {
    return (
      <GridPage title={network.title}>
        {times(20, (i) => (
          <CardPlaceholder key={i} index={i} size="dynamic" />
        ))}
      </GridPage>
    );
  }

  return (
    <GridPage title={network.title}>
      {data.map((props) =>
        props ? <Card key={props.tmdbId} {...props} size="dynamic" /> : null
      )}
    </GridPage>
  );
}
