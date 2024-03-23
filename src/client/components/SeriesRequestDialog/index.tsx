import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getSettings from "$lib/settings";
import {
  SeriesMonitorType,
  addSeriesToSonarr,
  getSonarrLanguageProfiles,
  getSonarrQualityProfiles,
  getSonarrRootFolders,
} from "$lib/apis/sonarr/sonarrApi";
import DialogBase, { DialogBaseControlProps } from "$components/DialogBase";
import Button from "$components/Button";
import SelectField from "$components/SelectField";

export default function SeriesRequestDialog({
  series,
  requestRefetch,
  controlProps,
}: {
  series: { name: string; tmdbId: number };
  requestRefetch: () => Promise<any>;
  controlProps?: DialogBaseControlProps;
}) {
  const settings = getSettings();

  const $config = useQuery({
    queryKey: ["movie_request_dialog__config"],
    queryFn: async () => {
      const [rootFolders, qualityProfiles, languageProfiles] =
        await Promise.all([
          getSonarrRootFolders(),
          getSonarrQualityProfiles(),
          getSonarrLanguageProfiles(),
        ]);

      return {
        rootFolders,
        qualityProfiles,
        languageProfiles,
      };
    },
  });

  const [form, setForm] = useState({
    rootFolderPath: String(settings.sonarr.root_folder_path),
    qualityProfileId: String(settings.sonarr.quality_profile_id),
    languageProfileId: String(settings.sonarr.language_profile_id),
    monitor: "all" as SeriesMonitorType,
  });

  const onUpdate = () => {
    if (!form) {
      return;
    }

    addSeriesToSonarr({
      tmdbId: Number(series.tmdbId),
      rootFolderPath: form.rootFolderPath,
      qualityProfileId: Number(form.qualityProfileId),
      languageProfileId: Number(form.languageProfileId),
      monitor: form.monitor,
    })
      .then(() => requestRefetch())
      .then(() => controlProps?.onClose?.());
  };

  if (!$config.data) {
    return null;
  }

  return (
    <DialogBase
      title={series.name}
      controlProps={controlProps}
      slots={{ footer: <Button onClick={onUpdate}>Add TV Show</Button> }}
    >
      <div className="flex flex-col gap-4">
        <SelectField
          label="Root Folder"
          value={form.rootFolderPath}
          options={$config.data.rootFolders.map((it) => ({
            value: String(it.id!),
            label: it.path!,
          }))}
          onChange={(value) => {
            setForm({ ...form!, rootFolderPath: value || "" });
          }}
        />
        <SelectField
          label="Quality Profile"
          value={String(form.qualityProfileId)}
          options={$config.data.qualityProfiles.map((it) => ({
            value: String(it.id!),
            label: it.name!,
          }))}
          onChange={(value) => {
            setForm({ ...form, qualityProfileId: value || "" });
          }}
        />
        <SelectField
          label="Language Profile"
          value={String(form.languageProfileId)}
          options={$config.data.languageProfiles.map((it) => ({
            value: String(it.id!),
            label: it.name!,
          }))}
          onChange={(value) => {
            setForm({ ...form, languageProfileId: value || "" });
          }}
        />
        <SelectField
          label="Monitor"
          value={form.monitor}
          options={[
            { value: "all", label: "All" },
            { value: "future", label: "Future Episodes" },
          ]}
          onChange={(value) => {
            setForm({ ...form, monitor: value || "all" });
          }}
        />
      </div>
    </DialogBase>
  );
}
