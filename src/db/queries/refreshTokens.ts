import { db } from "../index.js";
import { eq, and, isNull, gt } from "drizzle-orm";
import { refreshTokens, users } from "../schema.js";
import { config } from "../../config.js";

export async function createRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userId: userID,
      token: token,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
    })
    .returning();

  return rows.length > 0;
}

export async function getUserByRefreshToken(token: string) {
  const currentDate = new Date();
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, currentDate),
      ),
    )
    .limit(1);

  return result;
}

export async function revokeToken(token: string) {
  const rows = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning();

  if (rows.length === 0) {
    throw new Error("Couldn't revoke token");
  }
}
