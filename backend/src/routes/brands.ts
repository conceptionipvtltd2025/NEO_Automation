import { Router } from "express";
import { requireAuth } from "../auth";
import { listBrands, upsertBrand, deleteBrand } from "../repo";

const router = Router();

// GET /api/brands  (public)
router.get("/", async (_req, res, next) => {
  try {
    res.json(await listBrands());
  } catch (e) {
    next(e);
  }
});

// PUT /api/brands/:id  (admin) — upsert
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const brand = { ...body, id: req.params.id };
    if (!brand.name) return res.status(400).json({ error: "name is required" });
    res.json(await upsertBrand(brand));
  } catch (e) {
    next(e);
  }
});

// DELETE /api/brands/:id  (admin)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await deleteBrand(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
