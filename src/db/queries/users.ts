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
