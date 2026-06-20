import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logger } from "./lib/logger.js";

export async function seedAdmin() {
  try {
    const [existing] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, "admin"));
    if (!existing) {
      const password_hash = await bcrypt.hash("123456", 10);
      await db.insert(adminUsersTable).values({ username: "admin", password_hash });
      logger.info("Admin user created (admin / 123456)");
    }
  } catch (err) {
    logger.error(err, "Failed to seed admin user");
  }
}
