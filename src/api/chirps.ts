import { Request, Response } from "express";
import {
  createChirp,
  deleteChirp,
  getChirpById,
  getChirps,
} from "../db/queries/chirps.js";
import {
  BadRequestError,
  NotFoundError,
  UserForbiddenError,
} from "./customErrors.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  const { body } = req.body;

  if (!body) {
    throw new BadRequestError("missing required fields");
  }

  const token = getBearerToken(req);
  const userID = validateJWT(token, config.jwt.secret);

  const cleaned = validateChirp(body);
  const chirp = await createChirp({ body: cleaned, userId: userID });

  if (!chirp) {
    throw new NotFoundError("Failed to create chirp");
  }

  respondWithJSON(res, 201, chirp);
}

function validateChirp(chirpBody: string) {
  const maxChirpLength = 140;
  if (chirpBody.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  if (chirpBody.length === 0) {
    throw new BadRequestError("Chirp cannot be empty.");
  }

  // # Check if body contains a profane
  const badWords = ["kerfuffle", "sharbert", "fornax"];
  return getCleanedBody(chirpBody, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
  let words = body.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i].toLocaleLowerCase())) {
      words[i] = "****";
    }
  }
  const cleanedBody = words.join(" ");

  return cleanedBody;
}

export async function handlerGetChirps(_: Request, res: Response) {
  const chirps = await getChirps();

  if (!chirps) {
    throw new BadRequestError("Unable to fetch chirps");
  }
  respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
  const { chirpId } = req.params;

  if (typeof chirpId !== "string") {
    throw new BadRequestError("Invalid chirp ID");
  }

  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpID: ${chirpId} not found`);
  }

  respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const { chirpId } = req.params;

  const accessToken = getBearerToken(req);
  const userId = validateJWT(accessToken, config.jwt.secret);

  if (typeof chirpId !== "string") {
    throw new BadRequestError("Invalid chirp ID");
  }

  const chirp = await getChirpById(chirpId);

  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }

  if (chirp.userId !== userId) {
    throw new UserForbiddenError(
      "Permission denied: you do not have necessary permission to make changes to this chirp",
    );
  }

  const deleted = await deleteChirp(chirpId);
  if (!deleted) {
    throw new Error(`Failed to delete chirp with id: ${chirpId}`);
  }

  res.status(204).send();
}
