import { times } from "lodash";
import { RouteComponentProps } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getTmdbNetworkSeries } from "$lib/apis/tmdb/tmdbApi";
import { networks } from "$lib/discover";
import { fetchCardTmdbSeriesProps } from "$components/Card/utils";
import CardPlaceholder from "$components/CardPlaceholder";
import GridPage from "$components/GridPage";
import Card from "$components/Card";

export default function Network({
  params: { network: networkKey },
}: RouteComponentProps<{ network: string }>) {
  const network = networks[networkKey];

  const { data } = useQuery({
    queryKey: ["page__network", network] as const,
    queryFn: async ({ queryKey: [, network] }) => {
      //@todo Use JustWatch to fetch streaming services
      const series = await getTmdbNetworkSeries(network.tmdbNetworkId);
      return await Promise.all(series.map(fetchCardTmdbSeriesProps));
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
      {data.map((props) => (
        <Card key={props.tmdbId} {...props} size="dynamic" />
      ))}
    </GridPage>
  );
}
