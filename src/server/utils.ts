import { Express } from "express";
import ky from "ky";
import { isEmpty } from "lodash";

export function createAPIProxy(
  app: Express,
  path: string,
  baseURL: string,
  headers: Record<string, string>
) {
  app.use(path, async (req, res) => {
    try {
      const requestURL = new URL(`${baseURL}${req.url}`);

      if (req.url.startsWith("/MediaCover/")) {
        requestURL.pathname = `/api/v3${requestURL.pathname}`;
        requestURL.searchParams.set("apikey", headers["X-Api-Key"]);
      }

      const response = await ky(requestURL.toString(), {
        method: req.method,
        headers: { "content-type": req.headers["content-type"], ...headers },
        ...(isEmpty(req.body) ? {} : { json: req.body }),
      });

      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());

      res.type(blob.type);
      res.send(buffer);
    } catch (err: any) {
      res.status(err.response?.status || 500).send(err.message);
    }
  });
}
