import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import config from "../../config.json";
import { createAPIProxy } from "./utils";
import trendingTitlesByProvider from "./trendingTitlesByProvider";

const port = Number(config.port);
const app = express();

ViteExpress.config({
  mode: process.env.ENV === "production" ? "production" : "development",
});

app.use(express.json());

createAPIProxy(app, "/api/radarr", config.radarr.base_url, {
  "X-Api-Key": config.radarr.api_key,
});

createAPIProxy(app, "/api/sonarr", config.sonarr.base_url, {
  "X-Api-Key": config.sonarr.api_key,
});

app.get("/api/settings", (_, res) => {
  const { radarr, sonarr, ...rest } = config;

  res.json({
    radarr: {
      ...radarr,
      real_base_url: radarr.base_url,
      base_url: "/api/radarr",
      api_key: "noop",
    },
    sonarr: {
      ...sonarr,
      real_base_url: sonarr.base_url,
      base_url: "/api/sonarr",
      api_key: "noop",
    },
    ...rest,
  });
});

app.get("/api/trending/:provider", trendingTitlesByProvider);

ViteExpress.listen(app, port, () =>
  console.log("Server is listening at port", port)
);
