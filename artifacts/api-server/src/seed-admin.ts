import bcrypt from "bcryptjs";
import { getFirestore } from "./lib/firebase.js";
import { logger } from "./lib/logger.js";

export async function seedAdmin() {
  try {
    const db = getFirestore();
    const snap = await db.collection("admin_users").where("username", "==", "admin").limit(1).get();
    if (snap.empty) {
      const password_hash = await bcrypt.hash("123456", 10);
      await db.collection("admin_users").add({ username: "admin", password_hash, created_at: new Date().toISOString() });
      logger.info("Admin user created in Firestore (admin / 123456)");
    } else {
      logger.info("Admin user already exists in Firestore");
    }
  } catch (err) {
    logger.error(err, "Failed to seed admin user in Firestore");
  }
}
