import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getFirestore } from "../lib/firebase.js";

const router = Router();

export const JWT_SECRET = process.env.SESSION_SECRET || "rym_shoes_secret_2024";

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const db = getFirestore();
    const snap = await db.collection("admin_users").where("username", "==", username).limit(1).get();
    if (snap.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = snap.docs[0].data();
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: snap.docs[0].id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, username: user.username });
  } catch (err) {
    req.log.error(err, "auth login error");
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
