import { Router } from "express";
import multer from "multer";
import path from "path";
import { getFirestore } from "../lib/firebase.js";
import { authenticateToken } from "../middleware/adminAuth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/products", async (req, res) => {
  try {
    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection("products").orderBy("created_at", "desc");
    const { category } = req.query as { category?: string };
    if (category && category !== "all") {
      query = db.collection("products").where("category", "==", category).orderBy("created_at", "desc");
    }
    const snap = await query.get();
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json(products);
  } catch (err) {
    req.log.error(err, "get products error");
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const db = getFirestore();
    const doc = await db.collection("products").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Product not found" });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    req.log.error(err, "get product error");
    return res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/products", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const db = getFirestore();
    const { name, price, description, category } = req.body as Record<string, string>;
    const sizes = req.body.sizes ? (JSON.parse(req.body.sizes) as string[]) : [];
    const colors = req.body.colors ? (JSON.parse(req.body.colors) as string[]) : [];
    const files = (req.files as Express.Multer.File[]) || [];
    const images = files.map(f => `/uploads/${f.filename}`);
    const image_url = images[0] || null;
    const data = {
      name, price, description: description || "", category,
      image_url, images, sizes, colors,
      created_at: new Date().toISOString(),
    };
    const ref = await db.collection("products").add(data);
    return res.status(201).json({ id: ref.id, ...data });
  } catch (err) {
    req.log.error(err, "create product error");
    return res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const db = getFirestore();
    const { name, price, description, category } = req.body as Record<string, string>;
    const sizes = req.body.sizes ? (JSON.parse(req.body.sizes) as string[]) : [];
    const colors = req.body.colors ? (JSON.parse(req.body.colors) as string[]) : [];
    const existingImages: string[] = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const files = (req.files as Express.Multer.File[]) || [];
    const newImages = files.map(f => `/uploads/${f.filename}`);
    const images = [...existingImages, ...newImages];
    const image_url = images[0] || null;
    const data = { name, price, description: description || "", category, image_url, images, sizes, colors };
    await db.collection("products").doc(req.params.id).update(data);
    return res.json({ id: req.params.id, ...data });
  } catch (err) {
    req.log.error(err, "update product error");
    return res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    await db.collection("products").doc(req.params.id).delete();
    return res.json({ success: true });
  } catch (err) {
    req.log.error(err, "delete product error");
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
