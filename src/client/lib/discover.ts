export interface Network {
  key: string;
  title: string;
  tmdbNetworkId: number;
}

export const networks: Record<string, Network> = {
  netflix: {
    key: "netflix",
    title: "Netflix",
    tmdbNetworkId: 213,
  },
  disney: {
    key: "disney",
    title: "Disney",
    tmdbNetworkId: 2739,
  },
  hbo: {
    key: "hbo",
    title: "HBO",
    tmdbNetworkId: 49,
  },
  hulu: {
    key: "hulu",
    title: "Hulu",
    tmdbNetworkId: 453,
  },
  amazon: {
    key: "amazon",
    title: "Amazon",
    tmdbNetworkId: 1024,
  },
  apple: {
    key: "apple",
    title: "Apple",
    tmdbNetworkId: 2552,
  },
};

export interface Genre {
  key: string;
  title: string;
  tmdbGenreId: { movie: number[]; tv: number[] };
}

export const genres: Record<string, Genre> = {
  action_adventure: {
    key: "action_adventure",
    title: "Action & Adventure",
    tmdbGenreId: { movie: [12, 28], tv: [10759] },
  },
  animation: {
    key: "animation",
    title: "Animation",
    tmdbGenreId: { movie: [16], tv: [16] },
  },
  comedy: {
    key: "comedy",
    title: "Comedy",
    tmdbGenreId: { movie: [35], tv: [35] },
  },
  crime: {
    key: "crime",
    title: "Crime",
    tmdbGenreId: { movie: [80], tv: [80] },
  },
};
