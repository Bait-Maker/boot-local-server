import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerMetrics(_: Request, res: Response): Promise<void> {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", "no-store");

  const html = `<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`;
  res.send(html);
}
