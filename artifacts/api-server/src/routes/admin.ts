import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { mediaSettings, menuItems, orders } from "@workspace/db";
import { eq } from "drizzle-orm";

const adminRouter = Router();

// ── FILE UPLOAD ────────────────────────────────────────────────────────────────

const UPLOADS_DIR = path.resolve(process.cwd(), "artifacts/gastronomy/public/uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const name = `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype);
    cb(null, ok);
  },
});

adminRouter.post("/admin/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded or invalid file type." });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ── MEDIA ─────────────────────────────────────────────────────────────────────

adminRouter.get("/admin/media", async (_req, res) => {
  try {
    const rows = await db.select().from(mediaSettings);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media settings" });
  }
});

adminRouter.put("/admin/media/:slot", async (req, res) => {
  try {
    const { slot } = req.params;
    const { imageUrl } = req.body as { imageUrl: string };
    if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });

    const existing = await db.select().from(mediaSettings).where(eq(mediaSettings.slot, slot));
    if (existing.length === 0) {
      await db.insert(mediaSettings).values({ slot, imageUrl, updatedAt: new Date() });
    } else {
      await db.update(mediaSettings).set({ imageUrl, updatedAt: new Date() }).where(eq(mediaSettings.slot, slot));
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update media setting" });
  }
});

// ── MENU ITEMS ─────────────────────────────────────────────────────────────────

adminRouter.get("/admin/menu", async (_req, res) => {
  try {
    const rows = await db.select().from(menuItems).orderBy(menuItems.category, menuItems.sortOrder);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

adminRouter.post("/admin/menu", async (req, res) => {
  try {
    const { category, nameEn, nameFr, nameAr, description, price, imageUrl } = req.body as {
      category: string; nameEn: string; nameFr?: string; nameAr?: string;
      description?: string; price?: string; imageUrl?: string;
    };
    if (!category || !nameEn) return res.status(400).json({ error: "category and nameEn are required" });

    const existing = await db.select().from(menuItems).where(eq(menuItems.category, category));
    const sortOrder = existing.length > 0 ? Math.max(...existing.map(i => i.sortOrder)) + 1 : 1;

    const [inserted] = await db.insert(menuItems).values({
      category,
      nameEn,
      nameFr: nameFr || nameEn,
      nameAr: nameAr || nameEn,
      description: description || "",
      price: price || "",
      imageUrl: imageUrl || null,
      sortOrder,
    }).returning();
    res.json(inserted);
  } catch (err) {
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

adminRouter.put("/admin/menu/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nameEn, nameFr, nameAr, description, price, imageUrl } = req.body as {
      nameEn?: string; nameFr?: string; nameAr?: string;
      description?: string; price?: string; imageUrl?: string;
    };
    await db.update(menuItems).set({ nameEn, nameFr, nameAr, description, price, imageUrl, updatedAt: new Date() }).where(eq(menuItems.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

adminRouter.delete("/admin/menu/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(menuItems).where(eq(menuItems.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// ── ORDERS ─────────────────────────────────────────────────────────────────────

adminRouter.get("/admin/orders", async (_req, res) => {
  try {
    const rows = await db.select().from(orders).orderBy(orders.createdAt);
    res.json(rows.reverse());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

adminRouter.post("/admin/orders", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, message } = req.body as {
      customerName: string; customerEmail: string; customerPhone?: string; message?: string;
    };
    if (!customerName || !customerEmail) return res.status(400).json({ error: "Name and email required" });
    await db.insert(orders).values({ customerName, customerEmail, customerPhone, message, status: "pending" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

adminRouter.put("/admin/orders/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body as { status: string };
    if (!["pending", "confirmed", "cancelled"].includes(status)) return res.status(400).json({ error: "Invalid status" });
    await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

adminRouter.delete("/admin/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(orders).where(eq(orders.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default adminRouter;
