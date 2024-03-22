import ky from "ky";
import { Request, Response } from "express";
import { take } from "lodash";

const packagesByProvider: Record<string, string[]> = {
  netflix: ["nfx"],
  disney: ["dnp"],
  apple: ["atp", "itu"],
  hulu: ["hlu"],
  hbo: ["mxx"],
  amazon: ["amp"],
};

export default function trendingTitlesByProvider(
  req: Request<{ provider: string }>,
  res: Response
) {
  const packages = packagesByProvider[req.params.provider];

  if (!packages) {
    return res.sendStatus(404);
  }

  ky.post("https://apis.justwatch.com/graphql", {
    json: {
      operationName: "GetPopularTitles",
      variables: {
        first: 40,
        platform: "WEB",
        popularTitlesSortBy: "TRENDING",
        sortRandomSeed: 0,
        offset: 0,
        creditsRole: "DIRECTOR",
        after: "",
        popularTitlesFilter: {
          ageCertifications: [],
          excludeGenres: [],
          excludeProductionCountries: [],
          objectTypes: [],
          productionCountries: [],
          genres: [],
          packages,
          excludeIrrelevantTitles: false,
          presentationTypes: [],
          monetizationTypes: [],
          searchQuery: "",
        },
        watchNowFilter: {
          packages,
          monetizationTypes: [],
        },
        language: "en",
        country: "US",
        allowSponsoredRecommendations: {
          appId: "3.8.2-webapp#3b1044f",
          country: "US",
          language: "en",
          pageType: "VIEW_POPULAR",
          placement: "POPULAR_VIEW",
          platform: "WEB",
          supportedObjectTypes: ["MOVIE", "SHOW", "GENERIC_TITLE_LIST"],
          supportedFormats: ["IMAGE", "VIDEO"],
        },
      },
      query:
        "query GetPopularTitles($allowSponsoredRecommendations: SponsoredRecommendationsInput, $backdropProfile: BackdropProfile, $country: Country!, $first: Int! = 70, $format: ImageFormat, $language: Language!, $platform: Platform! = WEB, $after: String, $popularTitlesFilter: TitleFilter, $popularTitlesSortBy: PopularTitlesSorting! = POPULAR, $profile: PosterProfile, $sortRandomSeed: Int! = 0, $watchNowFilter: WatchNowOfferFilter!, $offset: Int = 0, $creditsRole: CreditRole! = DIRECTOR) {\n  popularTitles(\n    allowSponsoredRecommendations: $allowSponsoredRecommendations\n    country: $country\n    filter: $popularTitlesFilter\n    first: $first\n    sortBy: $popularTitlesSortBy\n    sortRandomSeed: $sortRandomSeed\n    offset: $offset\n    after: $after\n  ) {\n    edges {\n      ...PopularTitleGraphql\n      __typename\n    }\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n      __typename\n    }\n    sponsoredAd {\n      ...SponsoredAdFragment\n      __typename\n    }\n    totalCount\n    __typename\n  }\n}\n\nfragment PopularTitleGraphql on PopularTitlesEdge {\n  cursor\n  node {\n    id\n    objectId\n    objectType\n    content(country: $country, language: $language) {\n      title\n      fullPath\n      scoring {\n        imdbVotes\n        imdbScore\n        tmdbPopularity\n        tmdbScore\n        __typename\n      }\n      dailymotionClips: clips(providers: [DAILYMOTION]) {\n        sourceUrl\n        externalId\n        provider\n        __typename\n      }\n      posterUrl(profile: $profile, format: $format)\n      ... on MovieOrShowOrSeasonContent {\n        backdrops(profile: $backdropProfile, format: $format) {\n          backdropUrl\n          __typename\n        }\n        __typename\n      }\n      isReleased\n      credits(role: $creditsRole) {\n        name\n        personId\n        __typename\n      }\n      scoring {\n        imdbVotes\n        __typename\n      }\n      runtime\n      genres {\n        translation(language: $language)\n        shortName\n        __typename\n      }\n      __typename\n    }\n    likelistEntry {\n      createdAt\n      __typename\n    }\n    dislikelistEntry {\n      createdAt\n      __typename\n    }\n    watchlistEntryV2 {\n      createdAt\n      __typename\n    }\n    customlistEntries {\n      createdAt\n      __typename\n    }\n    freeOffersCount: offerCount(\n      country: $country\n      platform: $platform\n      filter: {monetizationTypes: [FREE]}\n    )\n    watchNowOffer(country: $country, platform: $platform, filter: $watchNowFilter) {\n      id\n      standardWebURL\n      package {\n        id\n        packageId\n        clearName\n        __typename\n      }\n      retailPrice(language: $language)\n      retailPriceValue\n      lastChangeRetailPriceValue\n      currency\n      presentationType\n      monetizationType\n      availableTo\n      __typename\n    }\n    ... on Movie {\n      seenlistEntry {\n        createdAt\n        __typename\n      }\n      __typename\n    }\n    ... on Show {\n      tvShowTrackingEntry {\n        createdAt\n        __typename\n      }\n      seenState(country: $country) {\n        seenEpisodeCount\n        progress\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SponsoredAdFragment on SponsoredRecommendationAd {\n  bidId\n  holdoutGroup\n  campaign {\n    externalTrackers {\n      type\n      data\n      __typename\n    }\n    hideRatings\n    promotionalImageUrl\n    promotionalVideo {\n      url\n      __typename\n    }\n    promotionalText\n    promotionalImageUrlOverrides {\n      id\n      promotionalImageUrl\n      __typename\n    }\n    watchNowLabel\n    watchNowOffer {\n      standardWebURL\n      presentationType\n      monetizationType\n      package {\n        id\n        packageId\n        shortName\n        clearName\n        icon\n        __typename\n      }\n      __typename\n    }\n    watchNowOfferOverrides {\n      id\n      watchNowOffer {\n        standardWebURL\n        __typename\n      }\n      __typename\n    }\n    node {\n      id\n      ... on MovieOrShow {\n        content(country: $country, language: $language) {\n          fullPath\n          posterUrl\n          title\n          originalReleaseYear\n          scoring {\n            imdbScore\n            __typename\n          }\n          externalIds {\n            imdbId\n            __typename\n          }\n          backdrops(format: $format, profile: $backdropProfile) {\n            backdropUrl\n            __typename\n          }\n          isReleased\n          __typename\n        }\n        objectId\n        objectType\n        offers(country: $country, platform: $platform) {\n          monetizationType\n          presentationType\n          package {\n            id\n            packageId\n            __typename\n          }\n          id\n          __typename\n        }\n        watchlistEntryV2 {\n          createdAt\n          __typename\n        }\n        __typename\n      }\n      ... on Show {\n        seenState(country: $country) {\n          seenEpisodeCount\n          __typename\n        }\n        __typename\n      }\n      ... on GenericTitleList {\n        followedlistEntry {\n          createdAt\n          name\n          __typename\n        }\n        id\n        name\n        type\n        visibility\n        titles(country: $country) {\n          totalCount\n          edges {\n            cursor\n            node {\n              content(country: $country, language: $language) {\n                fullPath\n                posterUrl\n                title\n                originalReleaseYear\n                scoring {\n                  imdbScore\n                  __typename\n                }\n                isReleased\n                __typename\n              }\n              id\n              objectId\n              objectType\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n",
    },
  })
    .json()
    .then(({ data }: any) =>
      res.send(
        take(
          data.popularTitles.edges
            .map((edge: any) => edge.node)
            .map((node: any) => ({
              type: node.objectType === "SHOW" ? "series" : "movie",
              title: node.content.title,
            })),
          20
        )
      )
    );
}
