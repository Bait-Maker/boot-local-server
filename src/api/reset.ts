import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";
import { UserForbiddenError } from "./customErrors.js";

export async function handlerResetHits(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    console.log(config.api.platform);
    throw new UserForbiddenError(
      "Resetting is only allowed in dev environment",
    );
  }

  config.api.fileserverHits = 0;
  await deleteUsers();

  res.write("Server hits set to 0. Deleted all users");
  res.end();
}
