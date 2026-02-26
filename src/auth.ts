import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string) {
  return argon2.verify(hash, password);
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

/**
 * makes a JWT token and returns that token
 */
export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const date = Math.floor(Date.now() / 1000); // get current time in seconds

  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: date,
    exp: date + expiresIn,
  };

  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string) {
  const decoded = jwt.verify(tokenString, secret);
  return decoded.sub;
}
