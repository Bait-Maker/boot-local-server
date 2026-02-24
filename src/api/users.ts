import { Request, Response } from "express";
import { createUser } from "src/db/queries/users";
import { BadRequestError } from "./customErrors";
import { newUser } from "src/db/schema";

export async function handlerAddUser(req: Request, res: Response) {
  const params: newUser = req.body;

  if (params.email.length <= 0 || params.email.length > 256) {
    throw new BadRequestError(
      "email cannot be empty or longer than 256 characters",
    );
  }

  const user = await createUser(params);
}
