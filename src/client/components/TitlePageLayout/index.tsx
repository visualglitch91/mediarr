import useResizeObserver from "use-resize-observer";
import { TMDB_IMAGES_ORIGINAL, TMDB_POSTER_SMALL } from "$lib/constants";
import type { TitleType } from "$lib/types";
import Slot, { Slots } from "$components/Slot";
import LazyImg from "$components/LazyImg";
import TruncatedText from "$components/TruncatedText";
import classNames from "classnames";

const body = document.body;

function getBackdropUri(uris: string[]) {
  return (
    uris[Math.max(2, Math.floor(uris.length / 8))] ||
    uris[uris.length - 1] ||
    ""
  );
}

export default function TitlePageLayout({
  titleInformation,
  slots,
}: {
  titleInformation?: {
    tmdbId: number;
    tvdbId?: number;
    type: TitleType;
    title: string;
    tagline: string;
    overview: string;
    backdropUriCandidates: string[];
    posterPath: string;
  };
  slots?: Slots<
    | "titleInfo"
    | "titleRight"
    | "episodesCarousel"
    | "infoDescription"
    | "infoComponents"
    | "servarrComponents"
    | "carousels"
  >;
}) {
  const { ref: bottomRef, height: bottomHeight = 0 } = useResizeObserver();

  const backdropUri =
    titleInformation && getBackdropUri(titleInformation.backdropUriCandidates);

  useResizeObserver({ ref: body });

  const imageHeight = window.innerHeight - bottomHeight * 0.3;

  return (
    <>
      {/* Desktop */}
      {backdropUri && (
        <div
          style={{ height: imageHeight }}
          className={
            "hidden sm:block inset-x-0 bg-center bg-cover bg-stone-950 fixed"
          }
        >
          <LazyImg src={TMDB_IMAGES_ORIGINAL + backdropUri} className="h-full">
            <div className="absolute inset-0 bg-darken" />
          </LazyImg>
        </div>
      )}

      {/* Mobile */}
      <div
        style={{ height: imageHeight }}
        className="sm:hidden fixed inset-x-0 bg-center bg-cover bg-stone-950"
      >
        {titleInformation && (
          <LazyImg
            src={TMDB_IMAGES_ORIGINAL + titleInformation.posterPath}
            className="h-full"
          >
            <div className="absolute inset-0 bg-darken" />
          </LazyImg>
        )}
      </div>

      <div className="flex flex-col min-h-screen">
        <div
          className={classNames("flex flex-col relative z-[1] ", {
            "pt-10": !backdropUri,
            "h-[85vh] sm:h-screen": !!backdropUri,
          })}
        >
          <div className="flex-1 relative flex pt-24 px-2 sm:px-4 lg:px-8 pb-6">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-30%" />
            <div className="z-[1] flex-1 flex justify-end gap-8 items-end max-w-screen-2xl mx-auto">
              {titleInformation ? (
                <div
                  className="aspect-[2/3] w-52 bg-center bg-cover rounded-md hidden sm:block"
                  style={{
                    backgroundImage: `url('${TMDB_POSTER_SMALL}${titleInformation.posterPath}')`,
                  }}
                />
              ) : (
                <div className="aspect-[2/3] w-52 bg-center bg-cover rounded-md hidden sm:block placeholder" />
              )}
              <div className="flex-1 flex gap-4 justify-between flex-col lg:flex-row lg:items-end">
                <div>
                  <div className="text-zinc-300 text-sm uppercase font-semibold flex items-center gap-1">
                    <Slot slots={slots} name="titleInfo">
                      <div className="placeholder-text">Placeholder Long</div>
                    </Slot>
                  </div>
                  {titleInformation ? (
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">
                      {titleInformation.title}
                    </h1>
                  ) : (
                    <h1 className="text-4xl sm:text-5xl md:text-6xl placeholder-text mt-2">
                      Placeholder
                    </h1>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Slot slots={slots} name="titleRight" />
                </div>
              </div>
            </div>
          </div>
          <div ref={bottomRef} className="pb-6 bg-stone-950">
            <div className="max-w-screen-2xl mx-auto">
              <Slot slots={slots} name="episodesCarousel" />
            </div>
          </div>
        </div>

        <div
          className={
            "flex-1 flex flex-col gap-6 bg-stone-950 px-2 sm:px-4 lg:px-8 pb-6 relative 2xl:px-0"
          }
        >
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 sm:gap-x-8 rounded-xl py-4 max-w-screen-2xl 2xl:mx-auto w-full">
            <Slot slots={slots} name="infoDescription">
              <div className="flex flex-col gap-3 max-w-5xl row-span-3 col-span-4 sm:col-span-6 lg:col-span-3 mb-4 lg:mr-8">
                {titleInformation ? (
                  <>
                    <div className="flex gap-4 justify-between">
                      <h1 className="font-semibold text-xl sm:text-2xl">
                        {titleInformation.tagline}
                      </h1>
                    </div>
                    <TruncatedText
                      className="pl-4 border-l-2 text-sm sm:text-base text-zinc-300"
                      text={titleInformation.overview}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex gap-4 justify-between">
                      <h1 className="font-semibold text-xl sm:text-2xl placeholder-text">
                        Placeholder
                      </h1>
                    </div>
                    <div className="flex">
                      <div className="mr-4 placeholder w-1 flex-shrink-0 rounded" />
                      <p className="text-sm sm:text-base placeholder-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur sit amet sem eget dolor lobortis mollis.
                        Aliquam semper imperdiet mi nec viverra. Praesent ac
                        ligula congue, aliquam diam nec, ullamcorper libero.
                        Nunc mattis rhoncus justo, ac pretium urna vehicula et.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Slot>
            <Slot slots={slots} name="infoComponents" />
            <Slot slots={slots} name="servarrComponents">
              <div className="flex gap-4 flex-wrap col-span-4 sm:col-span-6 mt-4">
                <div className="placeholder h-10 w-40 rounded-xl" />
                <div className="placeholder h-10 w-40 rounded-xl" />
              </div>
            </Slot>
          </div>
          <div className="flex flex-col gap-6 max-w-screen-2xl 2xl:mx-auto w-full">
            <Slot slots={slots} name="carousels" />
          </div>
        </div>
      </div>
    </>
  );
}
