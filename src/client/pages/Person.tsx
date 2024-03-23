import { RouteComponentProps } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { TMDB_POSTER_SMALL } from "$lib/constants";
import { getTmdbPerson } from "$lib/apis/tmdb/tmdbApi";
import Carousel from "$components/Carousel";
import Poster from "$components/Poster";
import TitlePageLayout from "$components/TitlePageLayout";

const GENDER_OPTIONS = ["Not set", "Female", "Male", "Non-binary"] as const;

export default function Person({
  params: { tmdbId },
  isModal = false,
  handleCloseModal = () => {},
}: {
  isModal?: boolean;
  handleCloseModal?: () => void;
} & RouteComponentProps<{ tmdbId: string }>) {
  const { data } = useQuery({
    queryKey: ["page__person", tmdbId] as const,
    queryFn: async ({ queryKey: [, tmdbId] }) => {
      const tmdbPerson = await getTmdbPerson(Number(tmdbId));

      const isDirector = tmdbPerson.known_for_department == "Directing";

      const knownForMovies = tmdbPerson.movie_credits[
        isDirector ? "crew" : "cast"
      ]?.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );
      const knownForSeries = tmdbPerson.tv_credits[
        isDirector ? "crew" : "cast"
      ]?.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );

      const knownForProps: React.ComponentProps<typeof Poster>[] = [
        ...(knownForMovies ?? []),
        ...(knownForSeries ?? []),
      ]
        .sort(
          (a: any, b: any) =>
            new Date(b.first_air_date || b.release_date || 0).getTime() -
            new Date(a.first_air_date || a.release_date || 0).getTime()
        )
        .map((i) => ({
          tmdbId: i.id,
          title: (i as any).title ?? (i as any).name ?? "",
          subtitle: (i as any).job ?? (i as any).character ?? "",
          backdropUrl: i.poster_path ? TMDB_POSTER_SMALL + i.poster_path : "",
        }))
        .filter((i) => i.backdropUrl);

      const movieCredits =
        tmdbPerson.movie_credits.cast?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        ).length || 0;
      const seriesCredits =
        tmdbPerson.tv_credits.cast?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        ).length || 0;
      const crewCredits =
        tmdbPerson.movie_credits.crew?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        ).length || 0;

      return {
        tmdbPerson,
        knownForProps,
        movieCredits,
        seriesCredits,
        crewCredits,
      };
    },
  });

  if (!data) {
    return <TitlePageLayout />;
  }

  const {
    tmdbPerson: person,
    knownForProps,
    movieCredits,
    seriesCredits,
    crewCredits,
  } = data;

  return (
    <>
      <TitlePageLayout
        titleInformation={{
          tmdbId: Number(person?.id),
          type: "person",
          title: person?.name || "Person",
          backdropUriCandidates: [person?.profile_path ?? ""],
          posterPath: person?.profile_path || "",
          tagline: person?.known_for_department || person?.name || "",
          overview: person?.biography || "",
        }}
        slots={{
          titleInfo: (
            <>
              {person?.homepage && (
                <>
                  {/* @ts-expect-error */}
                  <a href={person?.homepage} target="_blank">
                    Homepage
                  </a>
                  <DotFilledIcon />
                </>
              )}
              {movieCredits + seriesCredits + crewCredits > 0 && (
                <p>{movieCredits + seriesCredits + crewCredits} Credits</p>
              )}
            </>
          ),
          infoComponents: (
            <>
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">Known for</p>
                <h2 className="font-medium">{person?.known_for_department}</h2>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">Gender</p>
                <h2 className="font-medium">
                  {GENDER_OPTIONS[person?.gender ?? 0]}
                </h2>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">Birthday</p>
                <h2 className="font-medium">
                  {new Date(person?.birthday || Date.now()).toLocaleDateString(
                    "en",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </h2>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="text-zinc-400 text-sm">Place of Birth</p>
                <h2 className="font-medium">{person?.place_of_birth}</h2>
              </div>
            </>
          ),
          servarrComponents: <></>,
          carousels:
            knownForProps.length > 0 ? (
              <div className="max-w-screen-2xl 2xl:mx-auto w-full">
                <Carousel
                  gradientFromColor="from-stone-950"
                  slots={{
                    title: <div className="font-medium text-lg">Known For</div>,
                  }}
                >
                  {knownForProps.map((props) => (
                    <Poster
                      key={props.tmdbId}
                      orientation="portrait"
                      {...props}
                    />
                  ))}
                </Carousel>
              </div>
            ) : null,
        }}
      ></TitlePageLayout>
    </>
  );
}
