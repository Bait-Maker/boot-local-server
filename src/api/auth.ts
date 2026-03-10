import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserUnauthorizedError } from "./customErrors.js";
import {
  checkPasswordHash,
  getBearerToken,
  makeJWT,
  makeRefreshToken,
  validateJWT,
} from "../auth.js";
import { UserResponse } from "./users.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import {
  createRefreshToken,
  getUserByRefreshToken,
  revokeToken,
} from "../db/queries/refreshTokens.js";

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

  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret,
  );

  validateJWT(accessToken, config.jwt.secret);

  // create refresh token
  const generatedRefreshToken = makeRefreshToken();
  const refreshToken = await createRefreshToken(user.id, generatedRefreshToken);

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
    refreshToken: refreshToken.token,
  } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);

  const result = await getUserByRefreshToken(refreshToken);

  if (!result) {
    throw new UserUnauthorizedError("Invalid refresh token");
  }

  const user = result.user;
  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret,
  );

  respondWithJSON(res, 200, {
    token: accessToken,
  });
}

export async function handlerRevoke(req: Request, res: Response) {
  let refreshToken = getBearerToken(req);

  await revokeToken(refreshToken);

  res.status(204).send();
}
