import { Request, Response } from "express";
import { serverHits } from "../config.js";

export async function handlerServerHits(
  req: Request,
  res: Response,
): Promise<void> {
  res.set("Content-TYpe", "text/plain; charset=utf-8");
  res.send(`Hits: ${serverHits.fileserverHits}`);
}

export async function handlerResetHits(req: Request, res: Response) {
  res.set("Content-TYpe", "text/plain; charset=utf-8");

  serverHits.fileserverHits = 0;
  res.send("Server hits have been reset");
}
