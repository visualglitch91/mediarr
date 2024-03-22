import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import { createAPIProxy } from "./utils";
import trendingTitlesByProvider from "./trendingTitlesByProvider";

const port = Number(process.env.PORT);
const app = express();

ViteExpress.config({
  mode: process.env.ENV === "production" ? "production" : "development",
});

app.use(express.json());

createAPIProxy(app, "/api/radarr", process.env.RADARR_API!, {
  "X-Api-Key": process.env.RADARR_API_KEY!,
});

createAPIProxy(app, "/api/sonarr", process.env.SONARR_API!, {
  "X-Api-Key": process.env.SONARR_API_KEY!,
});

app.get("/api/trending/:provider", trendingTitlesByProvider);

ViteExpress.listen(app, port, () =>
  console.log("Server is listening at port", port)
);
