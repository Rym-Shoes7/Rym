import { Router } from "express";
import multer from "multer";
import path from "path";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/adminAuth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/products", async (req, res) => {
  try {
    const all = await db.select().from(productsTable).orderBy(productsTable.created_at);
    const { category } = req.query as { category?: string };
    const filtered = category && category !== "all"
      ? all.filter(p => p.category === category)
      : all;
    return res.json(filtered);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/products", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const { name, price, description, category } = req.body as Record<string, string>;
    const sizes = req.body.sizes ? (JSON.parse(req.body.sizes) as string[]) : [];
    const colors = req.body.colors ? (JSON.parse(req.body.colors) as string[]) : [];
    const files = (req.files as Express.Multer.File[]) || [];
    const images = files.map(f => `/uploads/${f.filename}`);
    const image_url = images[0] || null;
    const [product] = await db.insert(productsTable).values({
      name, price, description, category, image_url, images, sizes, colors,
    }).returning();
    return res.status(201).json(product);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, description, category } = req.body as Record<string, string>;
    const sizes = req.body.sizes ? (JSON.parse(req.body.sizes) as string[]) : [];
    const colors = req.body.colors ? (JSON.parse(req.body.colors) as string[]) : [];
    const existingImages: string[] = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const files = (req.files as Express.Multer.File[]) || [];
    const newImages = files.map(f => `/uploads/${f.filename}`);
    const images = [...existingImages, ...newImages];
    const image_url = images[0] || null;
    const [updated] = await db.update(productsTable)
      .set({ name, price, description, category, image_url, images, sizes, colors })
      .where(eq(productsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Product not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
