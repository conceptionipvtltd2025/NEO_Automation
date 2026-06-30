-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2026 at 09:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `neo_automation`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2a$10$CuEBtsBb7jCmPAxcLD31X.3Xm2/1lYcBnrgmqQ1FDIW8KmhoFYLHC', 1782739280716);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `color` varchar(16) DEFAULT NULL,
  `category` varchar(128) DEFAULT NULL,
  `blurb` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `color`, `category`, `blurb`, `logo`) VALUES
('atlas-copco', 'Atlas Copco', '#0033A0', 'Assembly & Tightening', 'Industrial power tools, smart tightening systems and the Smart Workflow Feature (SWF) for error-proof assembly lines.', '/images/brands/atlas-copco.png'),
('cejn', 'CEJN', '#ee7203', 'Pneumatics & Connectors', 'Swedish-engineered quick-connect couplings, high-pressure connectors and safety air guns for fast, leak-free pneumatic and hydraulic connections.', '/images/brands/cejn.png'),
('eepos', 'eepos', '#1b9bd7', 'Crane Systems', 'Modular aluminium crane systems and ergonomic lifting solutions for flexible, lightweight material handling.', '/images/brands/eepos.png'),
('gedore', 'GEDORE', '#0b63b2', 'Hand Tools', 'Premium hand tools, torque wrenches and workshop trolleys trusted across global manufacturing floors.', '/images/brands/gedore.png'),
('gesipa', 'GESIPA', '#0a4ea2', 'Riveting Technology', 'Blind rivets, blind rivet nuts and battery-powered setting tools engineered in Germany for high-volume joining.', '/images/brands/gesipa.png'),
('hoffmann-group', 'Hoffmann Group', '#ff7300', 'Tooling & MRO', 'Europe\'s system partner for quality tools — GARANT and HOLEX precision tools, measuring equipment and workstation solutions for industrial MRO.', '/images/brands/hoffmann-group.png'),
('john-guest', 'John Guest', '#0e7ec4', 'Fluid Fittings', 'Push-fit connectors and pneumatic fittings delivering leak-free fluid and air transfer at scale.', '/images/brands/john-guest.png'),
('legris', 'Legris', '#0a3d91', 'Fluid & Pneumatic Fittings', 'Precision push-in fittings, connectors and tubing engineered in France for reliable compressed-air and fluid control.', '/images/brands/legris.png'),
('pferd', 'PFERD', '#1f6fb2', 'Abrasives & Cutting', 'High-performance cutting discs, grinding wheels and surface finishing tools for metalworking precision.', '/images/brands/pferd.png');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `icon`) VALUES
('abrasives-cutting', 'Abrasives & Cutting', 'Cutting discs, grinding wheels and surface finishing.', 'Disc3'),
('assembly-tools', 'Assembly & Tightening', 'Smart cordless and electric tightening systems with traceability.', 'Wrench'),
('crane-systems', 'Crane Systems', 'Modular aluminium cranes and ergonomic lifting solutions.', 'MoveVertical'),
('fluid-fittings', 'Fluid & Pneumatic Fittings', 'Push-fit connectors for leak-free fluid and air transfer.', 'Pipette'),
('hand-tools', 'Hand Tools & Storage', 'Premium hand tools, torque wrenches and workshop trolleys.', 'Wrench'),
('riveting-systems', 'Riveting Systems', 'Blind rivet & rivet-nut setting tools for structural joining.', 'Hammer');

-- --------------------------------------------------------

--
-- Table structure for table `industries`
--

CREATE TABLE `industries` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `short` varchar(255) DEFAULT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `accent` varchar(16) DEFAULT NULL,
  `capabilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`capabilities`)),
  `stat` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`stat`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `industries`
--

INSERT INTO `industries` (`id`, `name`, `short`, `tagline`, `description`, `image`, `icon`, `accent`, `capabilities`, `stat`) VALUES
('aerospace', 'Aerospace', 'Aviation-grade joining', 'Where every fastener is mission-critical', 'Aerospace assembly demands certified torque, documented processes and flawless surface integrity. Our calibrated tooling and abrasives meet the most exacting AS9100 environments.', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', 'Plane', '#22b8ff', '[\"Calibrated precision torque tools\",\"Composite & alloy finishing\",\"Documented process control\",\"Lightweight lifting systems\"]', '{\"value\":\"100%\",\"label\":\"torque traceability\"}'),
('automotive', 'Automotive', 'Precision at line speed', 'Zero-defect assembly for the mobility era', 'From body-in-white to final assembly, we deploy smart tightening, riveting and error-proofing systems that keep automotive lines moving at takt time with full traceability.', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80', 'Car', '#ed1c24', '[\"Smart tightening & torque traceability\",\"Structural blind riveting (BIW)\",\"Ergonomic crane-assisted handling\",\"Line-side surface finishing\"]', '{\"value\":\"40%\",\"label\":\"faster takt cycles\"}'),
('data-center', 'Data Center', 'Build the backbone of compute', 'Infrastructure assembled to the micron', 'Hyperscale build-outs need rapid, repeatable rack assembly and clean cable management. We supply pneumatic fittings, precision hand tools and ergonomic handling for 24/7 deployment.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', 'Server', '#5ed6ff', '[\"Push-fit fluid & cooling fittings\",\"Precision rack assembly tooling\",\"ESD-safe hand tools\",\"Rapid material handling\"]', '{\"value\":\"24/7\",\"label\":\"deployment uptime\"}'),
('electronics-ev', 'Electronics & EV', 'Powering electrification', 'Micro-precision for high-volume electronics', 'Battery packs, power electronics and connected devices require delicate, traceable assembly. Our smart tools deliver micro-torque control and ESD-safe handling at scale.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 'CircuitBoard', '#22b8ff', '[\"Micro-torque smart tools\",\"Battery module assembly\",\"ESD-safe environments\",\"Connector & fitting solutions\"]', '{\"value\":\"±2%\",\"label\":\"torque accuracy\"}'),
('energy-utilities', 'Energy & Utilities', 'Built to endure', 'Heavy-duty tooling for critical infrastructure', 'Power generation, transmission and renewables operate in the harshest conditions. Our rugged tooling and lifting systems are engineered for reliability where downtime is not an option.', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80', 'Zap', '#ed1c24', '[\"High-torque bolting systems\",\"Heavy lifting & cranes\",\"Field-service tool kits\",\"Maintenance abrasives\"]', '{\"value\":\"99.2%\",\"label\":\"field reliability\"}'),
('general-industries', 'General Industries', 'One partner, every process', 'Tooling the world\'s workshops', 'Fabrication, machinery, white goods and beyond — our complete catalogue of assembly, cutting and material-handling solutions powers general manufacturing across the board.', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=80', 'Factory', '#ff5d5d', '[\"Full assembly tool range\",\"Cutting, grinding & abrasives\",\"Modular crane systems\",\"Workshop tooling & storage\"]', '{\"value\":\"1200+\",\"label\":\"installations\"}');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` varchar(96) NOT NULL,
  `name` varchar(160) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `product_id` varchar(96) DEFAULT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `status` enum('new','read','responded','closed') NOT NULL DEFAULT 'new',
  `created_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `email`, `phone`, `address`, `message`, `product_id`, `product_name`, `status`, `created_at`) VALUES
('seed-1', 'Rohan Mehta', 'rohan@tatamotors.example', '+91 98250 11223', 'Sanand, Gujarat', 'Interested in Tensor ES cordless nutrunners for our BIW line. Please share a quote for 12 units with SWF integration.', 'ac-tensor-es', 'Tensor ES Cordless Nutrunner', 'new', 1782721280764),
('seed-2', 'Anita Sharma', 'anita@hyperscale.example', '+91 99099 44556', 'Mumbai DC Campus', 'Need John Guest Speedfit connectors for a liquid-cooling retrofit. Bulk pricing required.', 'jg-speedfit', 'Speedfit Push-Fit Connector Set', 'read', 1782631280764),
('seed-3', 'Vikram Patel', 'vikram@aeroworks.example', '+91 90000 77889', NULL, 'Looking for calibrated torque wrenches, AS9100 documentation.', 'gedore-torque', 'DREMASTER Torque Wrench', 'responded', 1782523280764);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(96) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `name` varchar(200) NOT NULL,
  `brand_id` varchar(64) DEFAULT NULL,
  `brand` varchar(128) DEFAULT NULL,
  `category_id` varchar(64) DEFAULT NULL,
  `industries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`industries`)),
  `price` bigint(20) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 0.0,
  `short_desc` text DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `featured` tinyint(1) DEFAULT 0,
  `special` tinyint(1) DEFAULT 0,
  `badge` varchar(96) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `slug`, `name`, `brand_id`, `brand`, `category_id`, `industries`, `price`, `rating`, `short_desc`, `description`, `features`, `specs`, `images`, `featured`, `special`, `badge`, `visible`) VALUES
('ac-power-focus', 'atlas-copco-power-focus-6000', 'Power Focus 6000 Controller', 'atlas-copco', 'Atlas Copco', 'assembly-tools', '[\"automotive\",\"general-industries\"]', 612000, 4.8, 'Modular tightening controller orchestrating multi-tool assembly stations.', 'Power Focus 6000 is the brain of the smart assembly line — a scalable controller that manages tightening strategies, traceability and line integration across multiple tools from a single intuitive interface.', '[\"Multi-tool orchestration\",\"Smart tightening strategies\",\"Open protocol & PLC integration\",\"Touch HMI configuration\"]', '[{\"label\":\"Channels\",\"value\":\"Up to 20 tools\"},{\"label\":\"Protocols\",\"value\":\"Open Protocol, Profinet\"},{\"label\":\"Storage\",\"value\":\"Full result traceability\"},{\"label\":\"Display\",\"value\":\"7\\\" touchscreen\"}]', '[\"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80\"]', 1, 1, 'Smart Line', 1),
('ac-srb-focus', 'atlas-copco-srb-handheld', 'SRB Handheld Battery Nutrunner', 'atlas-copco', 'Atlas Copco', 'assembly-tools', '[\"general-industries\",\"automotive\",\"data-center\"]', 215000, 4.7, 'Versatile battery nutrunner for medium-torque assembly.', 'The SRB series brings reliable, repeatable tightening to general assembly with shut-off control, onboard results and effortless battery operation.', '[\"Shut-off torque control\",\"Onboard result storage\",\"Brushless motor\",\"Lightweight balance\"]', '[{\"label\":\"Torque Range\",\"value\":\"10 – 100 Nm\"},{\"label\":\"Speed\",\"value\":\"Up to 700 rpm\"},{\"label\":\"Battery\",\"value\":\"18V Li-Ion\"},{\"label\":\"Weight\",\"value\":\"1.6 kg\"}]', '[\"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, 'Versatile', 1),
('ac-tensor-es', 'atlas-copco-tensor-es-cordless', 'Tensor ES Cordless Nutrunner', 'atlas-copco', 'Atlas Copco', 'assembly-tools', '[\"automotive\",\"aerospace\",\"electronics-ev\"]', 489000, 4.9, 'Smart cordless tightening tool with full torque & angle traceability.', 'The Tensor ES delivers transducer-controlled accuracy with real-time torque and angle feedback. Integrated with the Smart Workflow Feature (SWF), every result is documented, traced and error-proofed — the benchmark for critical-joint assembly.', '[\"Transducer-controlled ±2% torque accuracy\",\"Wireless SWF connectivity & traceability\",\"Ergonomic, low-reaction grip\",\"OLED display with live results\"]', '[{\"label\":\"Torque Range\",\"value\":\"5 – 50 Nm\"},{\"label\":\"Speed\",\"value\":\"Up to 950 rpm\"},{\"label\":\"Accuracy\",\"value\":\"± 2% Cm/Cmk\"},{\"label\":\"Connectivity\",\"value\":\"Wireless / SWF\"},{\"label\":\"Weight\",\"value\":\"1.1 kg\"}]', '[\"https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80\"]', 1, 1, 'SWF Ready', 1),
('eepos-alu-crane', 'eepos-modular-aluminium-crane', 'Modular Aluminium Crane System', 'eepos', 'eepos', 'crane-systems', '[\"automotive\",\"general-industries\",\"aerospace\"]', 1450000, 4.8, 'Lightweight modular crane for ergonomic, flexible material handling.', 'The eepos aluminium crane combines low dead weight with high rigidity, enabling effortless one-hand movement of loads. Modular profiles configure to any workstation layout.', '[\"Loads up to 2000 kg\",\"Ultra-low rolling resistance\",\"Modular aluminium profiles\",\"Ergonomic single-hand guiding\"]', '[{\"label\":\"Capacity\",\"value\":\"Up to 2000 kg\"},{\"label\":\"Span\",\"value\":\"Up to 8 m\"},{\"label\":\"Material\",\"value\":\"Aircraft-grade aluminium\"},{\"label\":\"Mounting\",\"value\":\"Free-standing / ceiling\"}]', '[\"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80\"]', 1, 1, 'Ergonomic', 1),
('gedore-torque', 'gedore-dremaster-torque-wrench', 'DREMASTER Torque Wrench', 'gedore', 'GEDORE', 'hand-tools', '[\"aerospace\",\"automotive\",\"energy-utilities\"]', 38500, 4.9, 'Precision click-type torque wrench, calibration certified.', 'The DREMASTER delivers ±3% accuracy with a clear mechanical click. Each wrench ships with an individual calibration certificate for documented, audit-ready torque.', '[\"±3% accuracy\",\"Individual calibration certificate\",\"Audible & tactile click\",\"Reversible ratchet head\"]', '[{\"label\":\"Range\",\"value\":\"20 – 200 Nm\"},{\"label\":\"Accuracy\",\"value\":\"± 3%\"},{\"label\":\"Drive\",\"value\":\"1/2\\\"\"},{\"label\":\"Standard\",\"value\":\"ISO 6789\"}]', '[\"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, NULL, 1),
('gedore-trolley', 'gedore-workster-tool-trolley', 'WorkSTER Premium Tool Trolley', 'gedore', 'GEDORE', 'hand-tools', '[\"general-industries\",\"automotive\",\"data-center\"]', 124000, 4.7, '7-drawer workshop trolley with full tool complement.', 'A mobile workshop in steel — the GEDORE WorkSTER trolley offers smooth ball-bearing drawers, central locking and a curated tool set for professional service teams.', '[\"7 ball-bearing drawers\",\"Central key locking\",\"Anti-slip worktop\",\"Optional full tool set\"]', '[{\"label\":\"Drawers\",\"value\":\"7\"},{\"label\":\"Load / Drawer\",\"value\":\"30 kg\"},{\"label\":\"Material\",\"value\":\"Powder-coated steel\"},{\"label\":\"Castors\",\"value\":\"4× heavy-duty\"}]', '[\"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, NULL, 1),
('gesipa-accubird', 'gesipa-accubird-pro-rivet-tool', 'AccuBird Pro Blind Rivet Tool', 'gesipa', 'GESIPA', 'riveting-systems', '[\"automotive\",\"aerospace\",\"general-industries\"]', 78500, 4.7, 'Battery-powered blind rivet setting tool with process monitoring.', 'The AccuBird Pro sets blind rivets up to 4.8 mm in all materials with consistent, monitored force. Lightweight and fast, it brings German riveting precision to high-volume structural joining.', '[\"Sets rivets up to Ø 4.8 mm\",\"Process & setting-force monitoring\",\"Brushless motor, 2.5 kN traction\",\"Quick-change nosepiece system\"]', '[{\"label\":\"Rivet Capacity\",\"value\":\"Ø 2.4 – 4.8 mm\"},{\"label\":\"Traction Force\",\"value\":\"2.5 kN\"},{\"label\":\"Stroke\",\"value\":\"20 mm\"},{\"label\":\"Battery\",\"value\":\"18V Li-Ion\"},{\"label\":\"Weight\",\"value\":\"2.0 kg\"}]', '[\"https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80\"]', 1, 1, 'Best Seller', 1),
('gesipa-firebird', 'gesipa-firebird-pro-rivet-nut', 'FireBird Pro Rivet-Nut Setter', 'gesipa', 'GESIPA', 'riveting-systems', '[\"automotive\",\"general-industries\"]', 89900, 4.6, 'High-speed blind rivet-nut tool for threaded fastening.', 'FireBird Pro sets blind rivet nuts up to M10 with programmable stroke and force control, ideal for adding strong threads to thin-walled structures.', '[\"Sets rivet nuts up to M10\",\"Stroke & force programmable\",\"Fast cycle, low fatigue\",\"Digital setting feedback\"]', '[{\"label\":\"Capacity\",\"value\":\"M3 – M10\"},{\"label\":\"Setting Force\",\"value\":\"20 kN\"},{\"label\":\"Battery\",\"value\":\"18V Li-Ion\"},{\"label\":\"Weight\",\"value\":\"2.2 kg\"}]', '[\"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, NULL, 1),
('jg-pneumatic', 'john-guest-pneumatic-fitting', 'Pneumatic Push-In Fitting Range', 'john-guest', 'John Guest', 'fluid-fittings', '[\"general-industries\",\"automotive\"]', 6500, 4.6, 'Compact push-in fittings for compressed-air automation.', 'A complete range of compact pneumatic fittings engineered for fast assembly and reliable, vibration-resistant air connections on automated equipment.', '[\"Compact footprint\",\"Vibration resistant\",\"360° swivel elbows\",\"Nickel-plated brass thread\"]', '[{\"label\":\"Tube OD\",\"value\":\"4 – 16 mm\"},{\"label\":\"Pressure\",\"value\":\"Up to 16 bar\"},{\"label\":\"Thread\",\"value\":\"BSPT / NPT\"},{\"label\":\"Body\",\"value\":\"Acetal / brass\"}]', '[\"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, NULL, 1),
('jg-speedfit', 'john-guest-speedfit-connector', 'Speedfit Push-Fit Connector Set', 'john-guest', 'John Guest', 'fluid-fittings', '[\"data-center\",\"general-industries\"]', 8900, 4.8, 'Tool-free push-fit fittings for leak-free fluid & air lines.', 'John Guest Speedfit connectors create instant, secure, leak-free joints with a simple push. Ideal for liquid cooling, pneumatics and rapid data-center fluid routing.', '[\"Tool-free push-to-connect\",\"Leak-free O-ring seal\",\"Reusable & demountable\",\"WRAS / NSF approved\"]', '[{\"label\":\"Tube OD\",\"value\":\"4 – 22 mm\"},{\"label\":\"Pressure\",\"value\":\"Up to 20 bar\"},{\"label\":\"Temp\",\"value\":\"-20 to 65 °C\"},{\"label\":\"Material\",\"value\":\"Acetal copolymer\"}]', '[\"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, 'Liquid Cooling', 1),
('pferd-cut-disc', 'pferd-sg-steelox-cutting-disc', 'SG STEELOX Cutting Disc', 'pferd', 'PFERD', 'abrasives-cutting', '[\"general-industries\",\"automotive\",\"energy-utilities\"]', 4200, 4.6, 'Ultra-thin high-performance cutting disc for steel & stainless.', 'PFERD SG STEELOX discs cut steel and stainless with minimal burr and maximum life. The 1 mm profile delivers fast, cool, precise cuts with low material loss.', '[\"1 mm ultra-thin profile\",\"Steel & stainless (INOX)\",\"Cool, burr-free cutting\",\"Long service life\"]', '[{\"label\":\"Diameter\",\"value\":\"125 mm\"},{\"label\":\"Thickness\",\"value\":\"1.0 mm\"},{\"label\":\"Max RPM\",\"value\":\"12,200 rpm\"},{\"label\":\"Material\",\"value\":\"Aluminium oxide\"}]', '[\"https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, 'Pack of 25', 1),
('pferd-flap-disc', 'pferd-polifan-flap-disc', 'POLIFAN Flap Disc', 'pferd', 'PFERD', 'abrasives-cutting', '[\"aerospace\",\"general-industries\"]', 5600, 4.7, 'Zirconia flap disc for aggressive grinding and finishing.', 'POLIFAN combines high stock removal with a fine finish, letting you grind and finish in a single step on steel, stainless and alloys.', '[\"Zirconia alumina grain\",\"Grind & finish in one step\",\"Cool operation\",\"Consistent performance\"]', '[{\"label\":\"Diameter\",\"value\":\"115 mm\"},{\"label\":\"Grit\",\"value\":\"Z40 / Z60 / Z80\"},{\"label\":\"Max RPM\",\"value\":\"13,300 rpm\"},{\"label\":\"Backing\",\"value\":\"Fibreglass\"}]', '[\"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80\",\"https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80\"]', 0, 0, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `industries`
--
ALTER TABLE `industries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inquiries_status` (`status`),
  ADD KEY `idx_inquiries_created` (`created_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_slug` (`slug`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_brand` (`brand_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
