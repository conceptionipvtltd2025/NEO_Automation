import { Router } from "express";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import multer from "multer";
import { requireAuth } from "../auth";

const router = Router();

/** Absolute path to the folder where uploaded files live on disk. */
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

// Documents (product literature). Some browsers/OSes label a PDF as
// application/octet-stream, so the filename extension is checked as well.
const DOC_EXT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/x-pdf": "pdf",
  "application/acrobat": "pdf",
  "text/pdf": "pdf",
};

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB — datasheets are far bigger than photos

/** The extension to store a file under, or "" when the type isn't allowed. */
function extFor(file: Express.Multer.File): string {
  const mime = (file.mimetype || "").toLowerCase();
  if (EXT_BY_MIME[mime]) return EXT_BY_MIME[mime];
  if (DOC_EXT_BY_MIME[mime]) return "pdf";
  // Fall back to the extension for types the browser reported vaguely.
  if (/\.pdf$/i.test(file.originalname || "")) return "pdf";
  return "";
}

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
    cb(
      null,
      `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${extFor(file) || "bin"}`
    );
  },
});

/**
 * One multer instance handles both images and PDFs. They used to be separate
 * endpoints, which meant an admin panel talking to a backend that predates the
 * document route got a bare 404 and an unexplained "upload failed" — accepting
 * both on `/api/uploads` removes that whole failure mode.
 */
const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (extFor(file)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype} (images and PDF only)`));
  },
});

/** Shared handler: store the file, answer with its public URL and size. */
function handleUpload(req: any, res: any) {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      const message =
        err instanceof multer.MulterError
          ? err.code === "LIMIT_FILE_SIZE"
            ? "File too large (max 25 MB)."
            : err.message
          : err instanceof Error
            ? err.message
            : "Upload failed.";
      const status = /Unsupported file type/.test(message) ? 415 : 400;
      return res.status(status).json({ error: message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file received (expected form field `file`)." });
    }
    return res.status(201).json({
      url: `${uploadsBaseUrl()}/${req.file.filename}`,
      size: req.file.size,
      name: req.file.originalname,
    });
  });
}

/**
 * POST /api/uploads      (admin, multipart/form-data) — image or PDF.
 * POST /api/uploads/doc  (admin, multipart/form-data) — same thing; the admin
 *   panel posts product literature here so the intent is readable in the logs.
 * Field: `file` — the binary.
 * Returns: { url: "https://…/uploads/ab12.pdf", size, name }.
 */
router.post("/", requireAuth, handleUpload);
router.post("/doc", requireAuth, handleUpload);

export default router;
