import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import { createAxiosProxy } from "./utils";

const port = Number(process.env.PORT);
const app = express();

ViteExpress.config({
  mode: process.env.ENV === "production" ? "production" : "development",
});

app.use(express.json());

createAxiosProxy(app, "/api/radarr", process.env.RADARR_API!, {
  "X-Api-Key": process.env.RADARR_API_KEY!,
});

createAxiosProxy(app, "/api/sonarr", process.env.SONARR_API!, {
  "X-Api-Key": process.env.SONARR_API_KEY!,
});

createAxiosProxy(app, "/api/prowlarr", process.env.PROWLARR_API!, {
  "X-Api-Key": process.env.PROWLARR_API_KEY!,
});

ViteExpress.listen(app, port, () =>
  console.log("Server is listening at port", port)
);
