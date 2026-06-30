import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { ensureDatabase } from "./db";
import { migrate } from "./schema";
import { seed } from "./seed";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import industryRoutes from "./routes/industries";
import brandRoutes from "./routes/brands";
import inquiryRoutes from "./routes/inquiries";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const BASE = process.env.PASSENGER_BASE_URI; // cPanel sets this to "/neo_website_backend"
if (BASE) {
  app.use((req, _res, next) => {
    if (req.url.startsWith(BASE)) req.url = req.url.slice(BASE.length) || "/";
    next();
  });
}
// CORS — allow the configured origin(s), or any in dev.
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((o) => o.trim()),
  })
);

// data-URL images can be large — raise the JSON body limit.
app.use(express.json({ limit: "25mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "neo-automation-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/inquiries", inquiryRoutes);

// 404 for unknown API routes
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Central error handler
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[api error]", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

async function start() {
  try {
    console.log("Neo Automation API — starting up…");
    await ensureDatabase();
    console.log("  ✓ database ready");
    await migrate();
    console.log("  ✓ tables migrated");
    await seed();
    console.log("  ✓ seed checked");
    app.listen(PORT, () => {
      console.log(`\n🚀  API listening on http://localhost:${PORT}/api`);
      console.log(`    health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (e: any) {
    console.error("\n❌  Failed to start server.");
    if (e?.code === "ECONNREFUSED" || e?.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        "    Could not connect to MySQL. Check that MySQL is running and that\n" +
          "    DB_HOST / DB_PORT / DB_USER / DB_PASSWORD in backend/.env are correct."
      );
    }
    console.error(e);
    process.exit(1);
  }
}

start();
