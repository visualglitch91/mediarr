import { capitalize } from "lodash";
import useRadarrDownload from "$lib/useRadarrDownload";
import useRadarrMovie from "$lib/useRadarrMovie";
import TitleStatusBase from "$components/TitleStatusBase";

const colors = {
  monitored: "orange",
  available: "green",
  downloading: "purple",
  unmonitored: "red",
} as const;

export default function RadarrStatus({
  tmdbId,
  size = "sm",
}: {
  tmdbId: number;
  size?: "sm" | "md" | "lg";
}) {
  const { data: radarrMovie } = useRadarrMovie(tmdbId);
  const { data: radarrDownload } = useRadarrDownload(tmdbId);

  if (!radarrMovie) {
    return null;
  }

  const status = !radarrMovie.monitored
    ? "unmonitored"
    : radarrMovie.hasFile
    ? "available"
    : radarrDownload && (radarrDownload.sizeleft || 0) < 0
    ? "downloading"
    : "monitored";

  return (
    <TitleStatusBase
      size={size}
      color={colors[status]}
      label={capitalize(status)}
    />
  );
}
