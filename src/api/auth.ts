import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserUnauthorizedError } from "./customErrors.js";
import {
  checkPasswordHash,
  makeJWT,
  makeRefreshToken,
  validateJWT,
} from "../auth.js";
import { UserResponse } from "./users.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";

type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await getUserByEmail({ email: params.email });

  if (!user) {
    throw new UserUnauthorizedError("incorrect email or password");
  }

  const matching = await checkPasswordHash(
    params.password,
    user.hashedPassword,
  );

  if (!matching) {
    throw new UserUnauthorizedError("incorrect email or password");
  }

  let duration = config.jwt.defaultDuration; // 1hr

  const accessToken = makeJWT(user.id, duration, config.jwt.secret);

  validateJWT(accessToken, config.jwt.secret);

  // create refresh token
  const generatedRefreshToken = await makeRefreshToken();
  const currentDate = new Date();
  // 1. Get the current time in milliseconds currentDate.getTime()
  // 2. Add the duration in milliseconds (60 * days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const expirationTimeMsec = currentDate.getTime() + 60 * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(expirationTimeMsec);

  const refreshToken = await createRefreshToken({
    userId: user.id,
    token: generatedRefreshToken,
    expiresAt: expirationDate,
  });

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
    refreshToken: refreshToken.token,
  } satisfies LoginResponse);
}
