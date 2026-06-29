import { Router } from "express";
import { requireAuth } from "../auth";
import {
  listProducts,
  upsertProduct,
  deleteProduct,
  toggleProduct,
} from "../repo";

const router = Router();

// GET /api/products  (public) — all products; the frontend filters hidden ones.
router.get("/", async (_req, res, next) => {
  try {
    res.json(await listProducts());
  } catch (e) {
    next(e);
  }
});

// PUT /api/products/:id  (admin) — create or update (upsert).
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const product = { ...body, id: req.params.id };
    if (!product.name) return res.status(400).json({ error: "name is required" });
    res.json(await upsertProduct(product));
  } catch (e) {
    next(e);
  }
});

// PATCH /api/products/:id/toggle  (admin) — flip visibility.
router.patch("/:id/toggle", requireAuth, async (req, res, next) => {
  try {
    const updated = await toggleProduct(req.params.id);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/products/:id  (admin)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
