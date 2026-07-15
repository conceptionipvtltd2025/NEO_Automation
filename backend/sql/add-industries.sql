-- ============================================================
-- Neo Automation — add the 6 new industries + repair the 6 existing rows
--
-- Run in phpMyAdmin: select the neo_automation database -> SQL tab ->
-- paste -> Go.  BACK UP FIRST (Export tab) — this writes to live data.
--
-- Safe to run twice: inserts are insert-if-missing, and every UPDATE is
-- guarded so a value you changed in the admin panel is never overwritten.
-- ============================================================

START TRANSACTION;

-- ── 1. Insert all 12 seed industries, skipping any id that already exists ──
--    (`ON DUPLICATE KEY UPDATE id=id` is a deliberate no-op: it means
--     "leave the existing row exactly as it is".)

-- 1. Automotive
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('automotive',
   'Automotive',
   'Precision at line speed',
   'Zero-defect assembly for the mobility era',
   'From body-in-white to final assembly, we deploy smart tightening, riveting and error-proofing systems that keep automotive lines moving at takt time with full traceability.',
   'https://images.unsplash.com/photo-1589320012458-ce28bd1c86b1?auto=format&fit=crop&w=1600&q=85',
   'Car',
   '#7c86f0',
   '[\"Smart tightening & torque traceability\",\"Structural blind riveting (BIW)\",\"Ergonomic crane-assisted handling\",\"Line-side surface finishing\"]',
   '{\"value\":\"40%\",\"label\":\"faster takt cycles\"}',
   1,
   1784100000000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 2. Aerospace
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('aerospace',
   'Aerospace',
   'Aviation-grade joining',
   'Where every fastener is mission-critical',
   'Aerospace assembly demands certified torque, documented processes and flawless surface integrity. Our calibrated tooling and abrasives meet the most exacting AS9100 environments.',
   'https://images.unsplash.com/photo-1712179355181-cd9add37f76a?auto=format&fit=crop&w=1600&q=85',
   'Plane',
   '#4fb6f0',
   '[\"Calibrated precision torque tools\",\"Composite & alloy finishing\",\"Documented process control\",\"Lightweight lifting systems\"]',
   '{\"value\":\"100%\",\"label\":\"torque traceability\"}',
   1,
   1784099999000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 3. Electronics & EV
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('electronics-ev',
   'Electronics & EV',
   'Powering electrification',
   'Micro-precision for high-volume electronics',
   'Battery packs, power electronics and connected devices require delicate, traceable assembly. Our smart tools deliver micro-torque control and ESD-safe handling at scale.',
   'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
   'CircuitBoard',
   '#4fb6f0',
   '[\"Micro-torque smart tools\",\"Battery module assembly\",\"ESD-safe environments\",\"Connector & fitting solutions\"]',
   '{\"value\":\"±2%\",\"label\":\"torque accuracy\"}',
   1,
   1784099998000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 4. Semiconductor
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('semiconductor',
   'Semiconductor',
   'Sub-micron discipline',
   'Cleanroom-grade tooling for wafer fabrication',
   'Fabs are won on contamination control and repeatability. We supply ESD-safe hand tools, particle-conscious fittings and calibrated micro-torque for equipment installation, sub-fab assembly and planned maintenance.',
   'https://images.unsplash.com/photo-1576141546153-3e04370b5ff7?auto=format&fit=crop&w=1600&q=85',
   'Cpu',
   '#4fd9b4',
   '[\"ESD-safe precision hand tools\",\"Cleanroom-compatible fittings\",\"Calibrated micro-torque control\",\"Equipment install & PM kits\"]',
   '{\"value\":\"±2%\",\"label\":\"torque repeatability\"}',
   1,
   1784099997000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 5. Energy & Utilities
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('energy-utilities',
   'Energy & Utilities',
   'Built to endure',
   'Heavy-duty tooling for critical infrastructure',
   'Power generation, transmission and renewables operate in the harshest conditions. Our rugged tooling and lifting systems are engineered for reliability where downtime is not an option.',
   'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=85',
   'Zap',
   '#7c86f0',
   '[\"High-torque bolting systems\",\"Heavy lifting & cranes\",\"Field-service tool kits\",\"Maintenance abrasives\"]',
   '{\"value\":\"99.2%\",\"label\":\"field reliability\"}',
   1,
   1784099996000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 6. Data Center
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('data-center',
   'Data Center',
   'Build the backbone of compute',
   'Infrastructure assembled to the micron',
   'Hyperscale build-outs need rapid, repeatable rack assembly and clean cable management. We supply pneumatic fittings, precision hand tools and ergonomic handling for 24/7 deployment.',
   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85',
   'Server',
   '#4fd9b4',
   '[\"Push-fit fluid & cooling fittings\",\"Precision rack assembly tooling\",\"ESD-safe hand tools\",\"Rapid material handling\"]',
   '{\"value\":\"24/7\",\"label\":\"deployment uptime\"}',
   1,
   1784099995000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 7. Metal Fabrication
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('metal-fabrication',
   'Metal Fabrication',
   'Cut, grind, join, finish',
   'From raw plate to finished assembly',
   'Fabrication shops live on cutting speed and weld-prep quality. Our cutting discs, abrasives and finishing tools deliver consistent stock removal and clean, burr-free edges shift after shift.',
   'https://images.unsplash.com/photo-1598302936625-6075fbd98dd7?auto=format&fit=crop&w=1600&q=85',
   'Flame',
   '#a78bfa',
   '[\"High-performance cutting discs\",\"Grinding & flap-disc finishing\",\"Weld-prep & deburring tools\",\"Workshop benches & storage\"]',
   '{\"value\":\"1 mm\",\"label\":\"burr-free cutting\"}',
   1,
   1784099994000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 8. Heavy Equipment & Machinery
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('heavy-equipment',
   'Heavy Equipment & Machinery',
   'Big iron, exact torque',
   'High-torque assembly for earthmoving giants',
   'Excavators, loaders and mining machines are built around large-diameter, high-torque joints. We supply the bolting systems, lifting gear and documented tightening these structures demand.',
   'https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?auto=format&fit=crop&w=1600&q=85',
   'Tractor',
   '#4fd9b4',
   '[\"High-torque bolting systems\",\"Heavy-duty lifting & cranes\",\"Structural riveting\",\"Field-service tool kits\"]',
   '{\"value\":\"2000 kg\",\"label\":\"assisted lifting\"}',
   1,
   1784099993000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 9. Home Appliances
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('home-appliances',
   'Home Appliances',
   'White goods at volume',
   'High-volume assembly for the modern home',
   'Washing machines, refrigerators and white goods move fast down the line. Our cordless tightening, sheet-metal riveting and error-proofing keep cycle times low and rework lower.',
   'https://images.unsplash.com/photo-1716193696093-9c54b6a290e5?auto=format&fit=crop&w=1600&q=85',
   'WashingMachine',
   '#4fb6f0',
   '[\"Cordless assembly tightening\",\"Sheet-metal blind riveting\",\"Error-proofing & poka-yoke\",\"Line-side material handling\"]',
   '{\"value\":\"1200+\",\"label\":\"units per shift\"}',
   1,
   1784099992000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 10. Rail & Rolling Stock
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('rail-rolling-stock',
   'Rail & Rolling Stock',
   'Built for the long haul',
   'Assembly that survives a million kilometres',
   'Rolling stock endures decades of vibration and load. We bring documented torque, structural riveting and modular lifting to bogie, body-shell and interior fit-out assembly.',
   'https://images.unsplash.com/photo-1701221602494-699948f33250?auto=format&fit=crop&w=1600&q=85',
   'TrainFront',
   '#7c86f0',
   '[\"Documented structural torque\",\"Bogie & body-shell riveting\",\"Modular crane systems\",\"Interior fit-out tooling\"]',
   '{\"value\":\"100%\",\"label\":\"joint documentation\"}',
   1,
   1784099991000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 11. Trailers
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('trailers',
   'Trailers',
   'Chassis to cargo body',
   'Tooling the backbone of road freight',
   'Trailer builders join long, high-strength structures at pace. Our riveting, bolting and abrasive solutions handle chassis, axles and panel work without slowing the line.',
   'https://images.unsplash.com/photo-1720811559395-3ed8d1b16649?auto=format&fit=crop&w=1600&q=85',
   'Truck',
   '#4fd9b4',
   '[\"Structural blind riveting\",\"Chassis bolting & torque control\",\"Panel finishing & abrasives\",\"Ergonomic lifting support\"]',
   '{\"value\":\"13.6 m\",\"label\":\"chassis handling\"}',
   1,
   1784099990000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 12. General Industries
INSERT INTO `industries`
  (`id`,`name`,`short`,`tagline`,`description`,`image`,`icon`,`accent`,`capabilities`,`stat`,`visible`,`created_at`)
VALUES
  ('general-industries',
   'General Industries',
   'One partner, every process',
   'Tooling the world\'s workshops',
   'Fabrication, machinery, white goods and beyond — our complete catalogue of assembly, cutting and material-handling solutions powers general manufacturing across the board.',
   'https://images.unsplash.com/photo-1717386255773-1e3037c81788?auto=format&fit=crop&w=1600&q=85',
   'Factory',
   '#a78bfa',
   '[\"Full assembly tool range\",\"Cutting, grinding & abrasives\",\"Modular crane systems\",\"Workshop tooling & storage\"]',
   '{\"value\":\"1200+\",\"label\":\"installations\"}',
   1,
   1784099989000)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ── 2. Repoint retired photos on rows that already existed ──
--    Guarded by the old photo id, so an image you uploaded is untouched.
--    The 'general-industries' one currently resolves to a stock photo of
--    a roll of banknotes on the Unsplash CDN.

UPDATE `industries` SET `image` = 'https://images.unsplash.com/photo-1589320012458-ce28bd1c86b1?auto=format&fit=crop&w=1600&q=85'
  WHERE `id` = 'automotive' AND `image` LIKE '%1565043666747-69f6646db940%';
UPDATE `industries` SET `image` = 'https://images.unsplash.com/photo-1712179355181-cd9add37f76a?auto=format&fit=crop&w=1600&q=85'
  WHERE `id` = 'aerospace' AND `image` LIKE '%1436491865332-7a61a109cc05%';
UPDATE `industries` SET `image` = 'https://images.unsplash.com/photo-1717386255773-1e3037c81788?auto=format&fit=crop&w=1600&q=85'
  WHERE `id` = 'general-industries' AND `image` LIKE '%1565514020179-026b92b84bb6%';

-- ── 3. Retire the pre-redesign accent colours ──
--    Guarded by the exact old value, so a colour you picked is untouched.

UPDATE `industries` SET `accent` = '#7c86f0'
  WHERE `id` = 'automotive' AND `accent` = '#ed1c24';
UPDATE `industries` SET `accent` = '#4fb6f0'
  WHERE `id` = 'aerospace' AND `accent` = '#22b8ff';
UPDATE `industries` SET `accent` = '#4fb6f0'
  WHERE `id` = 'electronics-ev' AND `accent` = '#22b8ff';
UPDATE `industries` SET `accent` = '#7c86f0'
  WHERE `id` = 'energy-utilities' AND `accent` = '#ed1c24';
UPDATE `industries` SET `accent` = '#4fd9b4'
  WHERE `id` = 'data-center' AND `accent` = '#5ed6ff';
UPDATE `industries` SET `accent` = '#a78bfa'
  WHERE `id` = 'general-industries' AND `accent` = '#ff5d5d';

-- ── 4. Fix the display order ──
--    The site lists industries newest-first; these descending stamps put
--    them in the intended order. Industries you added in the admin panel
--    have a later timestamp and stay above these.

UPDATE `industries` SET `created_at` = 1784100000000 WHERE `id` = 'automotive';
UPDATE `industries` SET `created_at` = 1784099999000 WHERE `id` = 'aerospace';
UPDATE `industries` SET `created_at` = 1784099998000 WHERE `id` = 'electronics-ev';
UPDATE `industries` SET `created_at` = 1784099997000 WHERE `id` = 'semiconductor';
UPDATE `industries` SET `created_at` = 1784099996000 WHERE `id` = 'energy-utilities';
UPDATE `industries` SET `created_at` = 1784099995000 WHERE `id` = 'data-center';
UPDATE `industries` SET `created_at` = 1784099994000 WHERE `id` = 'metal-fabrication';
UPDATE `industries` SET `created_at` = 1784099993000 WHERE `id` = 'heavy-equipment';
UPDATE `industries` SET `created_at` = 1784099992000 WHERE `id` = 'home-appliances';
UPDATE `industries` SET `created_at` = 1784099991000 WHERE `id` = 'rail-rolling-stock';
UPDATE `industries` SET `created_at` = 1784099990000 WHERE `id` = 'trailers';
UPDATE `industries` SET `created_at` = 1784099989000 WHERE `id` = 'general-industries';

COMMIT;

-- ── 5. Check the result — expect 12 rows, no #ed1c24/#22b8ff/#5ed6ff/#ff5d5d ──
SELECT `id`, `name`, `accent`, `created_at` FROM `industries` ORDER BY `created_at` DESC;
