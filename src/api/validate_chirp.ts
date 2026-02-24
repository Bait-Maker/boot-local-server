import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./customErrors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type ChirpMessage = {
    body: string;
  };

  const params: ChirpMessage = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  if (params.body.length === 0) {
    throw new BadRequestError("Chirp cannot be empty.");
  }

  // # Check if body contains a profane
  let splitBody = params.body.split(" ");
  const badWords = ["kerfuffle", "sharbert", "fornax"];

  for (let i = 0; i < splitBody.length; i++) {
    if (badWords.includes(splitBody[i].toLocaleLowerCase())) {
      splitBody[i] = "****";
    }
  }
  const cleanedBody = splitBody.join(" ");

  respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}
