import { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { getBearerToken } from "../auth.js";
import { config } from "src/config";

export async function handlerUpgradeUser(req: Request, res: Response) {
  type parameters = {
    event: "user.upgraded";
    data: {
      userId: string;
    };
  };

  const apiKey = getBearerToken(req);

  if (apiKey !== config.api.polkaKey) {
    res.status(401).send();
    return;
  }

  const params: parameters = req.body;

  if (params.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }

  if (!params.data || !params.data.userId) {
    res.status(400).send();
  }

  const userId = params.data.userId;
  const upgrade = await upgradeUser(userId);

  if (!upgrade) {
    res.status(404).send();
  }

  res.status(204).send();
}
