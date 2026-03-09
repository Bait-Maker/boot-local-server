import { Request, Response } from "express";
import { BadRequestError, UserUnauthorizedError } from "./customErrors";
import { respondWithJSON } from "./json";
import { getUserByRefreshToken } from "src/db/queries/refreshTokens";
import { makeJWT } from "src/auth";
import { config } from "src/config";

export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = req.get("Authorization");

  if (!refreshToken) {
    throw new UserUnauthorizedError("Could not get refresh token");
  }

  const { userId } = await getUserByRefreshToken(refreshToken);

  if (!userId) {
    throw new BadRequestError("Cannot find user");
  }

  const accessToken = makeJWT(
    userId,
    config.jwt.defaultDuration,
    config.jwt.secret,
  );

  respondWithJSON(res, 200, {
    token: accessToken,
  });
}
