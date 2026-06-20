import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/adminAuth.js";

const router = Router();

function generateOrderNumber() {
  return `RYM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}

router.post("/orders", async (req, res) => {
  const { firstName, lastName, phone, address, wilaya, commune, items, total } = req.body as {
    firstName: string; lastName: string; phone: string; address: string;
    wilaya: string; commune: string; items: unknown; total: number;
  };
  if (!firstName || !phone || !address || !wilaya) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const [order] = await db.insert(ordersTable).values({
      first_name: firstName,
      last_name: lastName || "",
      phone,
      address,
      wilaya,
      commune: commune || "",
      items,
      total: String(total),
      status: "pending",
    }).returning();
    const orderNumber = `${order.id}-${generateOrderNumber()}`;
    return res.status(201).json({ success: true, orderId: order.id, orderNumber });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.created_at);
    return res.json(orders.reverse());
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body as { status: string };
    const [updated] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Order not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
