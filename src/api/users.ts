import { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  UserUnauthorizedError,
} from "./customErrors.js";
import { respondWithJSON } from "./json.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashed_password">;

export async function handlerAddUser(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError("missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword: hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new NotFoundError(`Failed to create user ${params.email}`);
  }

  respondWithJSON(res, 201, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  let accessToken = getBearerToken(req);

  const userID = validateJWT(accessToken, config.jwt.secret);

  if (!params.email || !params.password) {
    throw new BadRequestError("missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await updateUser(params.email, hashedPassword, userID);

  if (!user) {
    throw new UserUnauthorizedError("Failed to update user");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}
