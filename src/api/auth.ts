import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserUnauthorizedError } from "./customErrors.js";
import { checkPasswordHash } from "../auth.js";
import { UserResponse } from "./users.js";
import { respondWithJSON } from "./json.js";

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

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  } satisfies UserResponse);
}
