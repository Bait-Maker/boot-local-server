import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users, NewUser } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(user: NewUser) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email));
  return result;
}

export async function updateUser(
  email: string,
  password: string,
  userID: string,
) {
  const [result] = await db
    .update(users)
    .set({ email, hashedPassword: password })
    .where(eq(users.id, userID))
    .returning();

  return result;
}

export async function upgradeUser(userId: string) {
  const rows = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();

  return rows.length > 0;
}
