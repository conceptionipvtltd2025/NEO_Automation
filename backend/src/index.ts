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
import uploadRoutes, { UPLOADS_DIR } from "./routes/uploads";

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

// Some shared hosts (cPanel/LiteSpeed, mod_security) block or redirect
// PUT/PATCH/DELETE. Let the frontend tunnel them over POST by sending the real
// method in the X-HTTP-Method-Override header; we restore it before routing.
app.use((req, _res, next) => {
  const override = req.headers["x-http-method-override"];
  if (typeof override === "string" && override) {
    req.method = override.toUpperCase();
  }
  next();
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "neo-automation-api" }));

// Serve uploaded product images as static files. Long cache — filenames are unique.
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    maxAge: "30d",
    fallthrough: true,
    index: false,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/uploads", uploadRoutes);

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
    // These two failures look alike in the stack but have opposite fixes, so
    // spell them out separately — "check MySQL is running" is actively
    // misleading when MySQL *is* running and only the password is wrong.
    if (e?.code === "ECONNREFUSED") {
      console.error(
        `    Nothing is listening on ${process.env.DB_HOST || "localhost"}:${
          process.env.DB_PORT || 3306
        } — MySQL is not running.\n` +
          "    Windows:  net start MySQL80   (in an Administrator terminal)\n" +
          "    Then check DB_HOST / DB_PORT in backend/.env."
      );
    } else if (e?.code === "ER_ACCESS_DENIED_ERROR") {
      const withPassword = process.env.DB_PASSWORD ? "the password given" : "no password";
      console.error(
        `    MySQL is running and reachable, but rejected user "${
          process.env.DB_USER || "root"
        }" with ${withPassword}.\n` +
          "    Set DB_USER / DB_PASSWORD in backend/.env to your MySQL credentials.\n" +
          '    Verify them first with:  mysql -u root -p -e "SELECT 1"'
      );
    }
    console.error(e);
    process.exit(1);
  }
}

start();
