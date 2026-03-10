import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { BadRequestError, UserUnauthorizedError } from "./api/customErrors.js";
import crypto from "crypto";
const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string) {
  if (!password) return false;
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

/**
 * Generates a JWT token and returns that token
 * @returns JWT Token string
 */
export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000); // get current time in seconds
  const expiresAt = issuedAt + expiresIn;
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userID,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies Payload,
    secret,
    { algorithm: "HS256" },
  );

  return token;
}

/**
 *  Validates a JWT Token
 * @throws UserUnauthorizedError
 * @returns the userID (sub of the payload object)
 */
export function validateJWT(tokenString: string, secret: string) {
  let decoded: Payload;

  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UserUnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UserUnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UserUnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
  let token = req.get("Authorization");

  if (!token) {
    throw new BadRequestError("Cannot get bearer token");
  }

  const tokenParts = token.split(" ");

  if (tokenParts.length !== 2) {
    throw new BadRequestError("Bearer string empty");
  }

  token = tokenParts[1];

  return token;
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
