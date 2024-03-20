const settingsStore = {
  language: "",
  discover: {
    region: "",
    includedLanguages: "",
    excludeLibraryItems: false,
  },
  radarr: {
    baseUrl: "",
    apiKey: "",
    rootFolderPath: "",
    qualityProfileId: 0,
    profileId: 0,
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
