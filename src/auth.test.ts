import { describe, it, expect, beforeAll } from "vitest";
import {
  checkPasswordHash,
  hashPassword,
  makeJWT,
  validateJWT,
} from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  const userID = "abcdefghij1234567890";
  const expiresIn = 200;
  const secret = "secret";
  let jwtToken: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
    jwtToken = makeJWT(userID, expiresIn, secret);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return true for verified JWT token", () => {
    const result = validateJWT(jwtToken, secret);
    expect(result).toBe(userID);
  });
});
