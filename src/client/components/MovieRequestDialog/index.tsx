import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getSettings from "$lib/settings";
import {
  addMovieToRadarr,
  getRadarrQualityProfiles,
  getRadarrRootFolders,
} from "$lib/apis/radarr/radarrApi";
import DialogBase from "$components/DialogBase";
import Button from "$components/Button";
import SelectField from "$components/SelectField";

export default function MovieRequestDialog({
  movie,
  requestRefetch,
  onClose,
}: {
  movie: { title: string; tmdbId: number };
  requestRefetch: () => Promise<any>;
  onClose: () => void;
}) {
  const settings = getSettings();

  const $config = useQuery({
    queryKey: ["movie_request_dialog__config"],
    queryFn: async () => {
      const [rootFolders, qualityProfiles] = await Promise.all([
        getRadarrRootFolders(),
        getRadarrQualityProfiles(),
      ]);

      return {
        rootFolders,
        qualityProfiles,
      };
    },
  });

  const [form, setForm] = useState({
    rootFolderPath: String(settings.radarr.root_folder_path),
    qualityProfileId: String(settings.radarr.quality_profile_id),
  });

  const onUpdate = () => {
    if (!form) {
      return;
    }

    addMovieToRadarr({
      tmdbId: Number(movie.tmdbId),
      rootFolderPath: form.rootFolderPath,
      qualityProfileId: Number(form.qualityProfileId),
    })
      .then(() => requestRefetch())
      .then(() => onClose());
  };

  if (!$config.data) {
    return null;
  }

  return (
    <DialogBase
      title={movie.title}
      onClose={onClose}
      slots={{ footer: <Button onClick={onUpdate}>Add Movie</Button> }}
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
      </div>
    </DialogBase>
  );
}
