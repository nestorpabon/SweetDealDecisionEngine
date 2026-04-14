// Raw CSV data API — stores property rows in Neon PostgreSQL
// Vercel file-based route: /api/raw-data/:listId
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { listId } = req.query;

  if (!listId) {
    return res.status(400).json({ error: 'Missing listId parameter' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL not set' });
  }

  const sql = neon(process.env.DATABASE_URL);

  // GET — load all rows for a list
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT rows FROM property_rows WHERE list_id = ${listId}`;
      return res.json({ data: result[0]?.rows ?? [] });
    } catch (err) {
      console.error('[GET] error:', err.message);
      return res.status(500).json({ error: 'Failed to load data' });
    }
  }

  // PUT — save rows (with optional append mode for chunked uploads)
  if (req.method === 'PUT') {
    try {
      const body = req.body;
      const append = body.append === true;

      if (append) {
        // Append rows to existing record
        await sql`
          UPDATE property_rows
          SET rows = rows || ${JSON.stringify(body.rows)}::jsonb,
              updated_at = NOW()
          WHERE list_id = ${listId}
        `;
      } else {
        // Create or replace the record
        await sql`
          INSERT INTO property_rows (list_id, rows, updated_at)
          VALUES (${listId}, ${JSON.stringify(body.rows)}, NOW())
          ON CONFLICT (list_id) DO UPDATE
            SET rows = EXCLUDED.rows, updated_at = NOW()
        `;
      }
      return res.json({ ok: true });
    } catch (err) {
      console.error('[PUT] error:', err.message);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  }

  // DELETE — remove all rows for a list
  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM property_rows WHERE list_id = ${listId}`;
      return res.json({ ok: true });
    } catch (err) {
      console.error('[DELETE] error:', err.message);
      return res.status(500).json({ error: 'Failed to delete data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
