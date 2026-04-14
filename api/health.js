// Minimal health check — /api/health returns status, /api/health?db=1 tests DB
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Basic health (no DB) — verifies function is running
  if (!req.query.db) {
    return res.json({
      status: 'ok',
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
  }

  // DB health — tests actual connection
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ status: 'error', message: 'DATABASE_URL not set' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const start = Date.now();
    await sql`SELECT 1`;
    return res.json({ status: 'ok', dbMs: Date.now() - start, timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
