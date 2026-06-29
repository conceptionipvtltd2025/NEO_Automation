import mysql, { type Pool, type PoolConnection } from "mysql2/promise";

let pool: Pool | null = null;

function dbConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "neo_automation",
  };
}

/**
 * Creates the database if it doesn't exist yet, so a fresh MySQL install works
 * with zero manual SQL. Runs once on boot before the pool is created.
 */
export async function ensureDatabase() {
  const cfg = dbConfig();
  const conn = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();
}

export function getPool(): Pool {
  if (!pool) {
    const cfg = dbConfig();
    pool = mysql.createPool({
      ...cfg,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // data-URL images can be large — allow big payloads
      maxPreparedStatements: 100,
      dateStrings: false,
    });
  }
  return pool;
}

/** Convenience: run a query and get back rows. */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}

export async function withConnection<T>(fn: (c: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    return await fn(conn);
  } finally {
    conn.release();
  }
}
