import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserUnauthorizedError } from "./customErrors.js";
import { checkPasswordHash, makeJWT, validateJWT } from "../auth.js";
import { UserResponse } from "./users.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
  token: string;
};

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
    expiresIn?: number;
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

  if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
    duration = params.expiresIn;
  }

  const accessToken = makeJWT(user.id, duration, config.jwt.secret);

  validateJWT(accessToken, config.jwt.secret);

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
  } satisfies LoginResponse);
}
