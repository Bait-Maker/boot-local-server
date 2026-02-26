import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./customErrors.js";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "src/db/schema.js";

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
  } satisfies UserResponse);
}
