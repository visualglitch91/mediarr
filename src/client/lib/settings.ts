const settingsStore = {
  language: "",
  discover: {
    region: "",
    includedLanguages: "",
    excludeLibraryItems: false,
  },
  radarr: {
    baseUrl: "/api/radarr",
    apiKey: "noop",
    rootFolderPath: "/movies",
    qualityProfileId: 1,
    profileId: 1,
  },
  sonarr: {
    baseUrl: "/api/sonarr",
    apiKey: "noop",
    rootFolderPath: "/tvshows",
    qualityProfileId: 1,
    languageProfileId: 1,
  },
};

export default settingsStore;
