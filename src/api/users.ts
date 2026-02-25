import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./customErrors.js";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";

export async function handlerAddUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  }

  const params: parameters = req.body

  if (!params.email) {
    throw new BadRequestError("missing required fields");
  }

  const user = await createUser({email: params.email});

  if (!user) {
    throw new NotFoundError(`Failed to create user ${params.email}`);
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
