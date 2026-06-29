import { Router } from "express";
import { requireAuth } from "../auth";
import { listCategories, upsertCategory, deleteCategory } from "../repo";

const router = Router();

// GET /api/categories  (public)
router.get("/", async (_req, res, next) => {
  try {
    res.json(await listCategories());
  } catch (e) {
    next(e);
  }
});

// PUT /api/categories/:id  (admin) — upsert
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const category = { ...body, id: req.params.id };
    if (!category.name) return res.status(400).json({ error: "name is required" });
    res.json(await upsertCategory(category));
  } catch (e) {
    next(e);
  }
});

// DELETE /api/categories/:id  (admin)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
