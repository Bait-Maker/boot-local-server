import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export async function getChirps(authorId?: string, sortOrder?: string) {
  return await db
    .select()
    .from(chirps)
    .where(authorId ? eq(chirps.userId, authorId) : undefined)
    .orderBy(
      sortOrder === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt),
    );
}

export async function getChirpById(id: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result;
}

export async function deleteChirp(chirpID: string) {
  const rows = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpID))
    .returning();

  return rows.length > 0;
}
