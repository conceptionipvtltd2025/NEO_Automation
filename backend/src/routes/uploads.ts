import { Router } from "express";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import multer from "multer";
import { requireAuth } from "../auth";

const router = Router();

/** Absolute path to the folder where uploaded images live on disk. */
export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

/**
 * Public base URL that maps to UPLOADS_DIR. In production this must be set to the
 * externally-reachable URL (e.g. https://cidev.in/neo_website_backend/uploads).
 * In dev it falls back to a relative "/uploads" served by express.static.
 */
function uploadsBaseUrl(): string {
  const base = process.env.PUBLIC_UPLOADS_URL || "/uploads";
  return base.replace(/\/+$/, ""); // no trailing slash
}

// Map an image mime-type to a file extension.
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Multer stores the incoming file straight to disk with a unique, safe name.
 *
 * Why multipart (and not a base64 JSON body): the production host's WAF
 * (ModSecurity) blocks any request body containing a `data:…;base64,` string,
 * redirecting it to an error page. A normal binary multipart/form-data upload
 * is what firewalls expect for files, so it passes through cleanly.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdir(UPLOADS_DIR, { recursive: true })
      .then(() => cb(null, UPLOADS_DIR))
      .catch((err) => cb(err, UPLOADS_DIR));
  },
  filename: (_req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype.toLowerCase()] || "bin";
    cb(null, `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (EXT_BY_MIME[file.mimetype.toLowerCase()]) cb(null, true);
    else cb(new Error(`Unsupported image type: ${file.mimetype}`));
  },
});

/**
 * POST /api/uploads  (admin, multipart/form-data)
 * Field: `file` — the image binary.
 * Returns: { url: "https://…/uploads/ab12.jpg" }.
 */
router.post("/", requireAuth, (req, res) => {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      const message =
        err instanceof multer.MulterError
          ? err.code === "LIMIT_FILE_SIZE"
            ? "Image too large (max 10 MB)."
            : err.message
          : err instanceof Error
            ? err.message
            : "Upload failed.";
      const status = /Unsupported image type/.test(message) ? 415 : 400;
      return res.status(status).json({ error: message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file received (expected form field `file`)." });
    }
    return res.status(201).json({ url: `${uploadsBaseUrl()}/${req.file.filename}` });
  });
});

export default router;
