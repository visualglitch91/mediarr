import cx from "classnames";
import { navigate } from "wouter/use-location";
import type { TitleType } from "$lib/types";
import { TMDB_PROFILE_SMALL } from "$lib/constants";
import useTitleModal from "$lib/useTitleModal";

export default function PersonCard({
  type = "person",
  size = "md",
  openInModal = true,
  tmdbId,
  backdropUri,
  name,
  subtitle,
}: {
  type?: TitleType;
  size?: "dynamic" | "md" | "lg";
  openInModal?: boolean;
  tmdbId: number;
  backdropUri: string;
  name: string;
  subtitle: string;
}) {
  const openTitleModal = useTitleModal();

  return (
    <button
      type="button"
      className={cx(
        "flex flex-col justify-start gap-3 p-4 rounded-xl overflow-hidden relative shadow-lg shrink-0 selectable hover:text-inherit hover:bg-stone-800 focus-visible:bg-stone-800 bg-stone-900 group text-left",
        {
          "w-36 h-56": size === "md",
          "h-52": size === "lg",
          "w-full": size === "dynamic",
        }
      )}
      onClick={() => {
        if (openInModal) {
          openTitleModal({ type, id: tmdbId, provider: "tmdb" });
        } else {
          navigate(`/${type}/${tmdbId}`);
        }
      }}
    >
      <div className="mx-auto rounded-full overflow-hidden flex-shrink-0 aspect-square w-full bg-zinc-200 bg-opacity-20">
        <div
          style={{
            backgroundImage: `url('${TMDB_PROFILE_SMALL}${backdropUri}')`,
          }}
          className="bg-center bg-cover group-hover:scale-105 group-focus-visible:scale-105 transition-transform w-full h-full"
        />
      </div>
      <div>
        <h2 className="text-sm text-zinc-300 font-medium line-clamp-1">
          {subtitle}
        </h2>
        <h1 className="font-semibold line-clamp-2">{name}</h1>
      </div>
    </button>
  );
}
