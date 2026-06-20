import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env.SESSION_SECRET || "rym_shoes_secret_2024";

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, username));
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, username: user.username });
  } catch (err) {
    req.log.error(err, "auth login error");
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
export { JWT_SECRET };
