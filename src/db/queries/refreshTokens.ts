import { db } from "..";
import { eq } from "drizzle-orm";
import { RefreshToken, refreshTokens, users } from "../schema";

export async function createRefreshToken(token: RefreshToken) {
  const [result] = await db.insert(refreshTokens).values(token).returning();

  return result;
}

export async function getUserByRefreshToken(token: string) {
  const [result] = await db
    .select({ userId: refreshTokens.userId })
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  return result;
}
