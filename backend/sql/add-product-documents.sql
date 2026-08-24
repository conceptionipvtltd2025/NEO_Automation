-- ============================================================
-- Neo Automation — add per-product PDF documents (datasheets, manuals,
-- certificates) to the products table.
--
-- Run in phpMyAdmin: select the neo_automation database -> SQL tab ->
-- paste -> Go.  BACK UP FIRST (Export tab) — this writes to live data.
--
-- Adds ONE column: products.documents, holding a JSON array of
--   [{"label":"Datasheet","url":"/uploads/ab12.pdf","size":482113}, …]
-- Existing rows get NULL, which the API reads as an empty list, so nothing
-- else changes. The backend also applies this automatically on boot — this
-- file is for running it by hand when you can't restart the API.
-- ============================================================

-- ── The migration ────────────────────────────────────────────
-- Works on MySQL 5.7+/8 and MariaDB 10.2+.
-- Re-running it is harmless: it just reports error 1060 "Duplicate column
-- name 'documents'", which means the column is already there.

ALTER TABLE `products` ADD COLUMN `documents` JSON;


-- ── MariaDB-only alternative ─────────────────────────────────
-- MariaDB (most cPanel hosts) supports IF NOT EXISTS, so this version is
-- silent when the column already exists. MySQL does NOT accept it — use the
-- statement above there.
--
--   ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `documents` JSON;


-- ── Verify ───────────────────────────────────────────────────
-- Should list one row: documents / json (or longtext on MariaDB) / YES.

SHOW COLUMNS FROM `products` LIKE 'documents';


-- ── Optional: attach a PDF by hand ───────────────────────────
-- Normally you do this in the admin panel (Products -> edit -> Product
-- documents), which uploads the file and fills this in for you. To point a
-- product at an already-hosted PDF without the admin panel:
--
--   UPDATE `products`
--      SET `documents` = '[{"label":"Product datasheet","url":"https://cidev.in/neo_website_backend/uploads/my-file.pdf"}]'
--    WHERE `id` = 'ac-tensor-str';
--
-- Clear a product's documents again:
--
--   UPDATE `products` SET `documents` = NULL WHERE `id` = 'ac-tensor-str';
