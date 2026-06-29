import { Router } from "express";
import { requireAuth } from "../auth";
import { listIndustries, upsertIndustry, deleteIndustry } from "../repo";

const router = Router();

// GET /api/industries  (public)
router.get("/", async (_req, res, next) => {
  try {
    res.json(await listIndustries());
  } catch (e) {
    next(e);
  }
});

// PUT /api/industries/:id  (admin) — upsert
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const industry = { ...body, id: req.params.id };
    if (!industry.name) return res.status(400).json({ error: "name is required" });
    res.json(await upsertIndustry(industry));
  } catch (e) {
    next(e);
  }
});

// DELETE /api/industries/:id  (admin)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await deleteIndustry(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
