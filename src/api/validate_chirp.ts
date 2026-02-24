import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type ChirpMessage = {
    body: string;
  };

  const badWords = ["kerfuffle", "sharbert", "fornax"];

  const params: ChirpMessage = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  // # Check if body contains a profane
  let splitBody = params.body.split(" ");
  for (let i = 0; i < splitBody.length; i++) {
    if (badWords.includes(splitBody[i].toLocaleLowerCase())) {
      splitBody[i] = "****";
    }
  }
  const cleanedBody = splitBody.join(" ");

  respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}
