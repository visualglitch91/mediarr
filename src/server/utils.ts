import { Express } from "express";
import ky from "ky";
import { isEmpty } from "lodash";

export function createAxiosProxy(
  app: Express,
  path: string,
  baseURL: string,
  headers: Record<string, string>
) {
  app.use(path, async (req, res) => {
    try {
      const response = await ky(`${baseURL}${req.url}`, {
        method: req.method,
        headers: { "content-type": req.headers["content-type"], ...headers },
        ...(isEmpty(req.body) ? {} : { body: req.body }),
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
