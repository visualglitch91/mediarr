import { RouteComponentProps } from "wouter";
import { ArchiveIcon, DotFilledIcon, PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import {
  getTmdbMovie,
  getTmdbMovieRecommendations,
  getTmdbMovieSimilar,
} from "$lib/apis/tmdb/tmdbApi";
import { formatMinutesToTime, formatSize, notEmpty } from "$lib/utils";
import settingsStore from "$lib/settings";
import useRadarrMovie from "$lib/useRadarrMovie";
import useRadarrDownload from "$lib/useRadarrDownload";
import Button from "$components/Button";
import Card from "$components/Card";
import { fetchCardTmdbProps } from "$components/Card/utils";
import Carousel, { CarouselPlaceholderItems } from "$components/Carousel";
import PersonCard from "$components/PersonCard";
import OpenInButton from "$components/OpenInButton";
import TitlePageLayout from "$components/TitlePageLayout";
import QueryRenderer from "$components/QueryRenderer";
import RadarrStatus from "$components/RadarrStatus";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-medium text-lg">{children}</div>
);

export default function Movie({
  params: { tmdbId: tmdbIdString },
  isModal = false,
  handleCloseModal = () => {},
}: {
  isModal?: boolean;
  handleCloseModal?: () => void;
} & RouteComponentProps<{ tmdbId: string }>) {
  const tmdbId = parseInt(tmdbIdString);
  const tmdbUrl = "https://www.themoviedb.org/movie/" + tmdbId;

  function openRequestModal() {
    console.log("open request modal");
  }

  const $movie = useQuery({
    queryKey: ["movie", tmdbId] as const,
    queryFn: ({ queryKey: [, tmdbId] }) => getTmdbMovie(tmdbId),
  });

  const movie = $movie.data;

  const $radarrMovie = useRadarrMovie(tmdbId);

  const $radarrDownload = useRadarrDownload(tmdbId);

  const $recommendations = useQuery({
    enabled: !!movie,
    queryKey: ["page__movie__recommendations", tmdbId] as const,
    queryFn: async ({ queryKey: [, tmdbId] }) => {
      const tmdbRecommendationProps = getTmdbMovieRecommendations(tmdbId)
        .then((r) => Promise.all(r.map(fetchCardTmdbProps)))
        .then((r) => r.filter((p) => p.backdropUrl));

      const tmdbSimilarProps = getTmdbMovieSimilar(tmdbId)
        .then((r) => Promise.all(r.map(fetchCardTmdbProps)))
        .then((r) => r.filter((p) => p.backdropUrl));

      const castPropsPromise: Promise<
        React.ComponentProps<typeof PersonCard>[]
      > = Promise.resolve(movie).then((m) =>
        Promise.all(
          m?.credits?.cast?.slice(0, 20).map((m) => ({
            tmdbId: m.id || 0,
            backdropUri: m.profile_path || "",
            name: m.name || "",
            subtitle: m.character || m.known_for_department || "",
          })) || []
        )
      );

      return {
        tmdbRecommendationProps: await tmdbRecommendationProps,
        tmdbSimilarProps: await tmdbSimilarProps,
        castProps: await castPropsPromise,
      };
    },
  });

  if (!movie) {
    return (
      <TitlePageLayout isModal={isModal} handleCloseModal={handleCloseModal} />
    );
  }

  return (
    <TitlePageLayout
      titleInformation={{
        tmdbId,
        type: "movie",
        title: movie?.title || "Movie",
        backdropUriCandidates:
          movie?.images?.backdrops?.map((b) => b.file_path || "") || [],
        posterPath: movie?.poster_path || "",
        tagline: movie?.tagline || movie?.title || "",
        overview: movie?.overview || "",
      }}
      isModal={isModal}
      handleCloseModal={handleCloseModal}
      slots={{
        titleInfo: (
          <>
            {new Date(movie?.release_date || Date.now()).getFullYear()}
            <DotFilledIcon />
            {movie?.runtime} min
            <DotFilledIcon />
            <a href={tmdbUrl} target="_blank">
              {movie?.vote_average?.toFixed(1)} TMDB
            </a>
          </>
        ),
        episodesCarousel: <></>,
        titleRight: (
          <div className="flex gap-2 items-center flex-row-reverse justify-end lg:flex-row lg:justify-start">
            <QueryRenderer
              query={$radarrMovie}
              loading={<div className="placeholder h-10 w-48 rounded-xl" />}
              success={(radarrMovie) => (
                <>
                  {!movie &&
                  settingsStore.radarr.baseUrl &&
                  settingsStore.radarr.apiKey ? (
                    <Button type="primary" onClick={() => openRequestModal()}>
                      <span>Add to Radarr</span>
                      <PlusIcon width={20} height={20} />
                    </Button>
                  ) : radarrMovie ? (
                    <div
                      className="rounded-xl overflow-hidden flex stretch-items"
                      style={{ height: 40 }}
                    >
                      <RadarrStatus size="lg" tmdbId={tmdbId} />
                    </div>
                  ) : null}
                  <OpenInButton
                    title={movie?.title}
                    radarrMovie={radarrMovie}
                    type="movie"
                    tmdbId={tmdbId}
                  />
                </>
              )}
            />
          </div>
        ),
        infoComponents: (
          <>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Directed By</p>
              <h2 className="font-medium">
                {movie?.credits.crew
                  ?.filter((c) => c.job == "Director")
                  .map((p) => p.name)
                  .join(", ")}
              </h2>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Release Date</p>
              <h2 className="font-medium">
                {new Date(movie?.release_date || Date.now()).toLocaleDateString(
                  "en",
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </h2>
            </div>
            {notEmpty(movie?.budget) && (
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">Budget</p>
                <h2 className="font-medium">
                  {movie?.budget?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h2>
              </div>
            )}
            {notEmpty(movie?.revenue) && (
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">Revenue</p>
                <h2 className="font-medium">
                  {movie?.revenue?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h2>
              </div>
            )}
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Status</p>
              <h2 className="font-medium">{movie?.status}</h2>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-sm">Runtime</p>
              <h2 className="font-medium">{movie?.runtime} Minutes</h2>
            </div>
          </>
        ),
        servarrComponents: (
          <QueryRenderer
            query={$radarrMovie}
            loading={
              <div className="flex gap-4 flex-wrap col-span-4 sm:col-span-6 mt-4">
                <div className="placeholder h-10 w-40 rounded-xl" />
                <div className="placeholder h-10 w-40 rounded-xl" />
              </div>
            }
            success={(radarrMovie) => (
              <>
                {radarrMovie?.movieFile?.quality && (
                  <div className="col-span-2 lg:col-span-1">
                    <p className="text-zinc-400 text-sm">Video</p>
                    <h2 className="font-medium">
                      {radarrMovie?.movieFile?.quality.quality?.name}
                    </h2>
                  </div>
                )}

                {radarrMovie?.movieFile?.size && (
                  <div className="col-span-2 lg:col-span-1">
                    <p className="text-zinc-400 text-sm">Size On Disk</p>
                    <h2 className="font-medium">
                      {formatSize(radarrMovie?.movieFile?.size || 0)}
                    </h2>
                  </div>
                )}

                <QueryRenderer
                  query={$radarrDownload}
                  loading={<></>}
                  success={(download) => {
                    if (!download) {
                      return null;
                    }

                    return (
                      <div className="col-span-2 lg:col-span-1">
                        <p className="text-zinc-400 text-sm">Downloaded In</p>
                        <h2 className="font-medium">
                          {download.estimatedCompletionTime
                            ? formatMinutesToTime(
                                (new Date(
                                  download.estimatedCompletionTime
                                ).getTime() -
                                  Date.now()) /
                                  1000 /
                                  60
                              )
                            : "Stalled"}
                        </h2>
                      </div>
                    );
                  }}
                />

                <div className="flex gap-4 flex-wrap col-span-4 sm:col-span-6 mt-4">
                  <Button onClick={openRequestModal}>
                    <span className="mr-2">Request Movie</span>
                    <PlusIcon width={20} height={20} />
                  </Button>
                  <Button>
                    <span className="mr-2">Manage</span>
                    <ArchiveIcon width={20} height={20} />
                  </Button>
                </div>
              </>
            )}
          />
        ),
        carousels: (
          <QueryRenderer
            query={$recommendations}
            loading={
              <>
                <Carousel
                  gradientFromColor="from-stone-950"
                  slots={{
                    title: <SectionTitle>Cast & Crew</SectionTitle>,
                  }}
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
            success={(recommendation) => {
              const { castProps, tmdbRecommendationProps, tmdbSimilarProps } =
                recommendation;

              return (
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
                        <Card
                          key={props.tmdbId}
                          {...props}
                          openInModal={isModal}
                        />
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
                        <Card
                          key={props.tmdbId}
                          {...props}
                          openInModal={isModal}
                        />
                      ))}
                    </Carousel>
                  )}
                </>
              );
            }}
          />
        ),
      }}
    />
  );
}
