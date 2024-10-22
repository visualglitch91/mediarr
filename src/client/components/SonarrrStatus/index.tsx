import { SonarrSeries } from "$lib/apis/sonarr/sonarrApi";
import useSonarrDownload from "$lib/useSonarrDownload";
import useSonarrSeries, { useSonarrSeriesByTitle } from "$lib/useSonarrSeries";
import TitleStatusBase from "$components/TitleStatusBase";

const colors = {
  monitored: "orange",
  available: "green",
  partially_available: "blue",
  downloading: "purple",
  unavailable: "red",
  unmonitored: "red",
} as const;

const labels = {
  monitored: "Monitored",
  available: "Available",
  partially_available: "Partially Available",
  downloading: "Downloading",
  unavailable: "Unavailable",
  unmonitored: "Unmonitored",
};

function getPercent(show: SonarrSeries) {
  const { episodeCount, episodeFileCount } = show.statistics || {};

  if (
    typeof episodeCount === "undefined" ||
    typeof episodeFileCount === "undefined"
  ) {
    return 0;
  }

  return episodeCount === 0 ? -1 : (episodeFileCount / episodeCount) * 100;
}

export default function SonarrStatus({
  identifier: { title, tvdbId: externalTVDBId },
  size = "sm",
}: {
  identifier: { title?: string; tvdbId?: number };
  size?: "sm" | "md" | "lg";
}) {
  const { data: { tvdbId: possibleTVDBId } = {} } =
    useSonarrSeriesByTitle(title);

  const tvdbId = externalTVDBId || possibleTVDBId;
  const { data: sonarrMovie } = useSonarrSeries(tvdbId);
  const { data: sonarrDownload } = useSonarrDownload(tvdbId);

  if (!sonarrMovie) {
    return null;
  }

  const percent = getPercent(sonarrMovie);

  const status = !sonarrMovie.path
    ? "unmonitored"
    : sonarrDownload && (sonarrDownload.sizeleft || 0) > 0
    ? "downloading"
    : percent === 100
    ? "available"
    : percent > 0
    ? "partially_available"
    : "unavailable";

  return (
    <TitleStatusBase
      size={size}
      color={colors[status]}
      label={labels[status]}
    />
  );
}
