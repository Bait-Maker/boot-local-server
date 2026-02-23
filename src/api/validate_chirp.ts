import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type ChirpMessage = {
    body: string;
  };

  const params: ChirpMessage = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  // # Check if body contains a profane
  const cleanedBody = censorProfanes(params.body);

  respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}

function censorProfanes(body: string) {
  const profanes = {
    kerfuffle: "kerfuffle",
    sharbert: "sharbert",
    fornax: "fornax",
  };

  const words = body.toLocaleLowerCase().split(" ");
  const wordsNotLowerCase = body.split(" ");

  for (let profane in profanes) {
    const wordIndex = words.findIndex((word) => word === profane);
    wordsNotLowerCase[wordIndex] = "****";
  }

  const cleanedBody = wordsNotLowerCase.join(" ");

  return cleanedBody;
}
