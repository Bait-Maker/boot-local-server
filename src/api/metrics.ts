import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerMetrics(_: Request, res: Response): Promise<void> {
  res.send(`Hits: ${config.fileserverHits}`);
}

export async function handlerResetHits(
  _: Request,
  res: Response,
): Promise<void> {
  config.fileserverHits = 0;
  res.write("Server hits set to 0");
  res.end();
}
