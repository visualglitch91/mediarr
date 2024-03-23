import { useState } from "react";
import { capitalize, times } from "lodash";
import { RouteComponentProps } from "wouter";
import classNames from "classnames";
import {
  ChevronLeftIcon,
  DotFilledIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import {
  getTmdbSeries,
  getTmdbSeriesRecommendations,
  getTmdbSeriesSeasons,
  getTmdbSeriesSimilar,
  type TmdbSeriesFull2,
} from "$lib/apis/tmdb/tmdbApi";
import { formatMinutesToTime, formatSize, notEmpty } from "$lib/utils";
import { TMDB_BACKDROP_SMALL } from "$lib/constants";
import useSonarrSeries from "$lib/useSonarrSeries";
import useSonarrDownload from "$lib/useSonarrDownload";
import getSettings from "$lib/settings";
import useModal from "$lib/useModal";
import Button from "$components/Button";
import Card from "$components/Card";
import { fetchCardTmdbProps } from "$components/Card/utils";
import Carousel, { CarouselPlaceholderItems } from "$components/Carousel";
import UICarousel from "$components/UICarousel";
import EpisodeCard from "$components/EpisodeCard";
import PersonCard from "$components/PersonCard";
import TitleContextMenu from "$components/TitleContextMenu";
import TitlePageLayout from "$components/TitlePageLayout";
import QueryRenderer from "$components/QueryRenderer";
import SonarrStatus from "$components/SonarrrStatus";
import SeriesRequestDialog from "$components/SeriesRequestDialog";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-medium text-lg">{children}</div>
);

export default function Series({
  params: { tmdbId: tmdbIdString },
}: RouteComponentProps<{ tmdbId: string }>) {
  const mount = useModal();
  const settings = getSettings();
  const tmdbId = parseInt(tmdbIdString);

  const $series = useQuery({
    queryKey: ["series", tmdbId] as const,
    queryFn: ({ queryKey: [, tmdbId] }) => getTmdbSeries(tmdbId),
  });

  const numberOfSeasons = $series.data?.number_of_seasons;

  const $seasons = useQuery({
    enabled: !!numberOfSeasons,
    queryKey: ["series__seasons", { tmdbId, numberOfSeasons }] as const,
    queryFn: ({ queryKey: [, { tmdbId, numberOfSeasons }] }) => {
      if (!numberOfSeasons) {
        throw new Error("numberOfSeasons is not defined");
      }

      return getTmdbSeriesSeasons(tmdbId, numberOfSeasons);
    },
  });

  const tvdbId = $series.data?.external_ids?.tvdb_id;
  const $sonarrSeries = useSonarrSeries(tvdbId);
  const $sonarrDownload = useSonarrDownload(tvdbId);

  const $recommendations = useQuery({
    enabled: !!$series.data,
    queryKey: ["page__series__recommendations", tmdbId] as const,
    queryFn: async ({ queryKey: [, tmdbId] }) => {
      if (!$series.data) {
        throw new Error("$series.data is not defined");
      }

      const tmdbSeries = $series.data;
      const tmdbRecommendationProps = getTmdbSeriesRecommendations(tmdbId).then(
        (r) => Promise.all(r.map(fetchCardTmdbProps))
      );

      const tmdbSimilarProps = getTmdbSeriesSimilar(tmdbId)
        .then((r) => Promise.all(r.map(fetchCardTmdbProps)))
        .then((r) => r.filter((p) => p.backdropUrl));

      const castProps: React.ComponentProps<typeof PersonCard>[] =
        tmdbSeries.aggregate_credits?.cast?.slice(0, 20)?.map((m) => ({
          tmdbId: m.id || 0,
          backdropUri: m.profile_path || "",
          name: m.name || "",
          subtitle: m.roles?.[0]?.character || m.known_for_department || "",
        })) || [];

      return {
        tmdbRecommendationProps: await tmdbRecommendationProps,
        tmdbSimilarProps: await tmdbSimilarProps,
        castProps,
      };
    },
  });

  const [seasonSelectVisible, setSeasonSelectVisible] = useState(false);
  const [visibleSeasonNumber, setVisibleSeasonNumber] = useState(1);

  async function openRequestModal() {
    mount((controlProps) => (
      <SeriesRequestDialog
        series={{ tmdbId, name: tmdbSeries.name! }}
        requestRefetch={() => $sonarrSeries.refetch()}
        controlProps={controlProps}
      />
    ));
  }

  if (!$series.data || !$seasons.data) {
    return (
      <TitlePageLayout
        slots={{
          episodesCarousel: (
            <Carousel
              gradientFromColor="from-stone-950"
              className={"px-2 sm:px-4 lg:px-8 2xl:px-0"}
              heading="Episodes"
            >
              <CarouselPlaceholderItems />
            </Carousel>
          ),
        }}
      />
    );
  }

  const tmdbUrl = `https://www.themoviedb.org/tv/${tmdbId}`;
  const tmdbSeries = $series.data as TmdbSeriesFull2;

  return (
    <TitlePageLayout
      titleInformation={{
        tmdbId,
        tvdbId,
        type: "series",
        backdropUriCandidates:
          tmdbSeries.images?.backdrops?.map((b) => b.file_path || "") || [],
        posterPath: tmdbSeries.poster_path || "",
        title: tmdbSeries.name || "",
        tagline: tmdbSeries.tagline || tmdbSeries.name || "",
        overview: tmdbSeries.overview || "",
      }}
      slots={{
        titleInfo: (
          <>
            {new Date(tmdbSeries.first_air_date || Date.now()).getFullYear()}
            <DotFilledIcon />
            {tmdbSeries.status}
            <DotFilledIcon />
            <a href={tmdbUrl} target="_blank">
              {tmdbSeries.vote_average?.toFixed(1)} TMDB
            </a>
          </>
        ),
        titleRight: (
          <div className="flex gap-2 items-center justify-start lg:flex-row">
            {$sonarrSeries.isLoading ? (
              <div className="placeholder h-10 w-48 rounded-xl" />
            ) : (
              <>
                {!$sonarrSeries.data &&
                settings.sonarr.api_key &&
                settings.sonarr.base_url ? (
                  <Button type="primary" onClick={openRequestModal}>
                    <span>Add to Sonarr</span>
                    <PlusIcon width={20} height={20} />
                  </Button>
                ) : $sonarrSeries.data && tvdbId ? (
                  <div
                    className="rounded-xl overflow-hidden flex stretch-items"
                    style={{ height: 40 }}
                  >
                    <SonarrStatus size="lg" identifier={{ tvdbId }} />
                  </div>
                ) : null}
                <TitleContextMenu
                  title={tmdbSeries.name}
                  sonarrSeries={$sonarrSeries.data}
                  type="series"
                  tmdbId={tmdbId}
                  requestRefetch={() => $sonarrSeries.refetch()}
                />
              </>
            )}
          </div>
        ),
        episodesCarousel: (
          <Carousel
            gradientFromColor="from-stone-950"
            className={"px-2 sm:px-4 lg:px-8 2xl:px-0"}
            slots={{
              title: (
                <UICarousel className="flex gap-6">
                  {times(numberOfSeasons || 0, (i) => {
                    const seasonNumber = i + 1;

                    const season = tmdbSeries.seasons?.find(
                      (s) => s.season_number === seasonNumber
                    );

                    const isSelected =
                      season?.season_number === visibleSeasonNumber;

                    return (
                      <button
                        key={i}
                        className={classNames(
                          "font-medium tracking-wide transition-colors flex-shrink-0 flex items-center gap-1",
                          {
                            "text-zinc-200": isSelected && seasonSelectVisible,
                            "text-zinc-500 hover:text-zinc-200 cursor-pointer":
                              (!isSelected || seasonSelectVisible === false) &&
                              tmdbSeries.number_of_seasons !== 1,
                            "text-zinc-500 cursor-default":
                              tmdbSeries.number_of_seasons === 1,
                            hidden:
                              !seasonSelectVisible &&
                              visibleSeasonNumber !==
                                (season?.season_number || 1),
                          }
                        )}
                        onClick={() => {
                          if (tmdbSeries.number_of_seasons === 1) return;

                          if (seasonSelectVisible) {
                            setVisibleSeasonNumber(season?.season_number || 1);
                            setSeasonSelectVisible(false);
                          } else {
                            setSeasonSelectVisible(true);
                          }
                        }}
                      >
                        <ChevronLeftIcon
                          width={20}
                          height={20}
                          className={
                            seasonSelectVisible ||
                            tmdbSeries.number_of_seasons === 1
                              ? "hidden"
                              : ""
                          }
                        />
                        Season {season?.season_number}
                      </button>
                    );
                  })}
                </UICarousel>
              ),
            }}
          >
            <QueryRenderer
              query={$seasons}
              loading={<CarouselPlaceholderItems />}
              success={(seasons) => {
                const selectedSeason = seasons[visibleSeasonNumber - 1];

                if (!selectedSeason) {
                  return null;
                }

                return (
                  selectedSeason.episodes?.map((episode) => {
                    const cardProps = {
                      title: episode?.name || "",
                      subtitle: `Episode ${episode?.episode_number}`,
                      backdropUrl:
                        TMDB_BACKDROP_SMALL + episode?.still_path || "",
                      airDate:
                        episode.air_date &&
                        new Date(episode.air_date) > new Date()
                          ? new Date(episode.air_date)
                          : undefined,
                    };

                    return <EpisodeCard key={episode.id} {...cardProps} />;
                  }) || null
                );
              }}
            />
          </Carousel>
        ),
        infoComponents: (
          <>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Created By</p>
              <h2 className="font-medium">
                {tmdbSeries.created_by?.map((c) => c.name).join(", ")}
              </h2>
            </div>
            {tmdbSeries.first_air_date && (
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">First Air Date</p>
                <h2 className="font-medium">
                  {new Date(tmdbSeries.first_air_date).toLocaleDateString(
                    "en",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </h2>
              </div>
            )}
            {
              //@ts-expect-error
              tmdbSeries.next_episode_to_air?.air_date ? (
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-zinc-400 text-sm">Next Air Date</p>
                  <h2 className="font-medium">
                    {new Date(
                      //@ts-expect-error
                      tmdbSeries.next_episode_to_air?.air_date
                    ).toLocaleDateString("en", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h2>
                </div>
              ) : tmdbSeries.last_air_date ? (
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-zinc-400 text-sm">Last Air Date</p>
                  <h2 className="font-medium">
                    {new Date(tmdbSeries.last_air_date).toLocaleDateString(
                      "en",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </h2>
                </div>
              ) : null
            }
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Networks</p>
              <h2 className="font-medium">
                {tmdbSeries.networks?.map((n) => n.name).join(", ")}
              </h2>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Episode Run Time</p>
              <h2 className="font-medium">
                {tmdbSeries.episode_run_time} Minutes
              </h2>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Spoken Languages</p>
              <h2 className="font-medium">
                {tmdbSeries.spoken_languages
                  ?.map((l) => capitalize(l.english_name || ""))
                  .join(", ")}
              </h2>
            </div>
          </>
        ),
        servarrComponents: (
          <QueryRenderer
            query={$sonarrSeries}
            loading={
              <div className="flex gap-4 flex-wrap col-span-4 sm:col-span-6 mt-4">
                <div className="placeholder h-10 w-40 rounded-xl" />
                <div className="placeholder h-10 w-40 rounded-xl" />
              </div>
            }
            success={(sonarrSeries) =>
              !sonarrSeries ? null : (
                <>
                  {notEmpty(sonarrSeries.statistics?.episodeFileCount) && (
                    <div className="col-span-2 lg:col-span-1">
                      <p className="text-zinc-400 text-sm">Available</p>
                      <h2 className="font-medium">
                        {sonarrSeries.statistics?.episodeFileCount || 0}{" "}
                        Episodes
                      </h2>
                    </div>
                  )}

                  {notEmpty(sonarrSeries.statistics?.sizeOnDisk) && (
                    <div className="col-span-2 lg:col-span-1">
                      <p className="text-zinc-400 text-sm">Size On Disk</p>
                      <h2 className="font-medium">
                        {formatSize(sonarrSeries.statistics?.sizeOnDisk || 0)}
                      </h2>
                    </div>
                  )}

                  <QueryRenderer
                    query={$sonarrDownload}
                    loading={<></>}
                    success={(download) =>
                      download ? (
                        <div className="col-span-2 lg:col-span-1">
                          <p className="text-zinc-400 text-sm">
                            Download Completed In
                          </p>
                          <h2 className="font-medium">
                            {download.estimatedCompletionTime
                              ? formatMinutesToTime(
                                  (new Date(
                                    download?.estimatedCompletionTime
                                  ).getTime() -
                                    Date.now()) /
                                    1000 /
                                    60
                                )
                              : "Stalled"}
                          </h2>
                        </div>
                      ) : null
                    }
                  />
                </>
              )
            }
          />
        ),
        carousels: (
          <QueryRenderer
            query={$recommendations}
            loading={
              <>
                <Carousel
                  gradientFromColor="from-stone-950"
                  slots={{ title: <SectionTitle>Cast & Crew</SectionTitle> }}
                >
                  <CarouselPlaceholderItems />
                </Carousel>

                <Carousel
                  gradientFromColor="from-stone-950"
                  slots={{
                    title: <SectionTitle>Recommendations</SectionTitle>,
                  }}
                >
                  <CarouselPlaceholderItems />
                </Carousel>

                <Carousel
                  gradientFromColor="from-stone-950"
                  slots={{
                    title: <SectionTitle>Similar Series</SectionTitle>,
                  }}
                >
                  <CarouselPlaceholderItems />
                </Carousel>
              </>
            }
            success={({
              castProps,
              tmdbRecommendationProps,
              tmdbSimilarProps,
            }) => (
              <>
                {notEmpty(castProps) && (
                  <Carousel
                    gradientFromColor="from-stone-950"
                    slots={{
                      title: <SectionTitle>Cast & Crew</SectionTitle>,
                    }}
                  >
                    {castProps.map((props) => (
                      <PersonCard key={props.tmdbId} {...props} />
                    ))}
                  </Carousel>
                )}
                {notEmpty(tmdbRecommendationProps) && (
                  <Carousel
                    gradientFromColor="from-stone-950"
                    slots={{
                      title: <SectionTitle>Recommendations</SectionTitle>,
                    }}
                  >
                    {tmdbRecommendationProps.map((props) => (
                      <Card key={props.tmdbId} {...props} />
                    ))}
                  </Carousel>
                )}
                {notEmpty(tmdbSimilarProps) && (
                  <Carousel
                    gradientFromColor="from-stone-950"
                    slots={{
                      title: <SectionTitle>Similar Series</SectionTitle>,
                    }}
                  >
                    {tmdbSimilarProps.map((props) => (
                      <Card key={props.tmdbId} {...props} />
                    ))}
                  </Carousel>
                )}
              </>
            )}
          />
        ),
      }}
    />
  );
}
