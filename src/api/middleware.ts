import { NextFunction, Request, Response } from "express";
import { serverHits } from "../config.js";

export function middleWareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    serverHits.fileserverHits++;
  });

  next();
}
