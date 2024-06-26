import { removeFromRadarr } from "$lib/apis/radarr/radarrApi";
import { removeFromSonarr } from "$lib/apis/sonarr/sonarrApi";
import DialogBase, { DialogBaseControlProps } from "$components/DialogBase";
import Button from "$components/Button";

export default function UnmonitorDialog({
  radarrMovie,
  sonarrSeries,
  requestRefetch,
  controlProps,
}: {
  radarrMovie?: { id?: number; title?: string | null };
  sonarrSeries?: { id?: number; name?: string | null };
  requestRefetch: () => Promise<any>;
  controlProps?: DialogBaseControlProps;
}) {
  if (!radarrMovie && !sonarrSeries) {
    throw new Error("Either radarrMovie or sonarrSeries must be provided");
  }

  const title = radarrMovie?.title || sonarrSeries?.name || "";

  const onConfirm = () => {
    (radarrMovie?.id
      ? removeFromRadarr(radarrMovie.id)
      : sonarrSeries?.id
      ? removeFromSonarr(sonarrSeries.id)
      : Promise.resolve()
    )
      .then(() => requestRefetch())
      .then(() => controlProps?.onClose?.());
  };

  return (
    <DialogBase
      title={`Unmonitor ${title}`}
      controlProps={controlProps}
      slots={{ footer: <Button onClick={onConfirm}>Continue</Button> }}
    >
      Are you sure you want to unmonitor {title}? All files will be deleted.
    </DialogBase>
  );
}
