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
    baseUrl: "",
    apiKey: "",
    rootFolderPath: "",
    qualityProfileId: 0,
    languageProfileId: 0,
  },
};

export default settingsStore;
