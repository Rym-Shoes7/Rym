import { Router } from "express";
import { getFirestore } from "../lib/firebase.js";
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
    const db = getFirestore();
    const orderNumber = generateOrderNumber();
    const data = {
      first_name: firstName,
      last_name: lastName || "",
      phone, address, wilaya,
      commune: commune || "",
      items,
      total: String(total),
      status: "pending",
      order_number: orderNumber,
      created_at: new Date().toISOString(),
    };
    const ref = await db.collection("orders").add(data);
    return res.status(201).json({ success: true, orderId: ref.id, orderNumber });
  } catch (err) {
    req.log.error(err, "create order error");
    return res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    const snap = await db.collection("orders").orderBy("created_at", "desc").get();
    const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json(orders);
  } catch (err) {
    req.log.error(err, "get orders error");
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id", authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    const { status } = req.body as { status: string };
    await db.collection("orders").doc(req.params.id).update({ status });
    return res.json({ id: req.params.id, status });
  } catch (err) {
    req.log.error(err, "update order error");
    return res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
