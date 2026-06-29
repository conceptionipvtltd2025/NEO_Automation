import { Router } from "express";
import { requireAuth } from "../auth";
import {
  listInquiries,
  createInquiry,
  setInquiryStatus,
  deleteInquiry,
} from "../repo";

const router = Router();

const STATUSES = ["new", "read", "responded", "closed"];

// POST /api/inquiries  (public) — submit a customer inquiry from the website form.
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, address, message, productId, productName } =
      req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const inquiry = await createInquiry({
      name,
      email,
      phone,
      address,
      message,
      productId,
      productName,
    });
    res.status(201).json(inquiry);
  } catch (e) {
    next(e);
  }
});

// GET /api/inquiries  (admin)
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    res.json(await listInquiries());
  } catch (e) {
    next(e);
  }
});

// PATCH /api/inquiries/:id/status  (admin)  { status }
router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const updated = await setInquiryStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Inquiry not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/inquiries/:id  (admin)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await deleteInquiry(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
