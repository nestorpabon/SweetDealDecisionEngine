// Raw CSV data API — stores property rows in Neon PostgreSQL
// Only handles /api/raw-data/:listId and /api/health routes
import { neon } from '@neondatabase/serverless';

export default async function handler(request) {
  const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: CORS });

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const pathname = new URL(request.url, 'http://localhost').pathname;
  const method = request.method;

  // Health check — tests DB connection
  if (pathname === '/api/health') {
    if (!process.env.DATABASE_URL) {
      return json({ status: 'error', message: 'DATABASE_URL not set' }, 500);
    }
    try {
      const sql = neon(process.env.DATABASE_URL);
      await sql`SELECT 1`;
      return json({ status: 'ok', timestamp: new Date().toISOString() });
    } catch (err) {
      return json({ status: 'error', message: err.message }, 500);
    }
  }

  // All data routes need DB
  if (!process.env.DATABASE_URL) {
    return json({ error: 'DATABASE_URL not set' }, 500);
  }

  const sql = neon(process.env.DATABASE_URL);

  // Raw data routes: /api/raw-data/:listId
  // Table property_rows already exists in Neon (created via schema.sql)
  const match = pathname.match(/^\/api\/raw-data\/(.+)$/);
  if (match) {
    const listId = match[1];

    // GET — load all rows for a list
    if (method === 'GET') {
      try {
        const result = await sql`SELECT rows FROM property_rows WHERE list_id = ${listId}`;
        return json({ data: result[0]?.rows ?? [] });
      } catch (err) {
        console.error('[GET] error:', err.message);
        return json({ error: 'Failed to load data' }, 500);
      }
    }

    // PUT — save rows (with optional append mode for chunked uploads)
    if (method === 'PUT') {
      try {
        const body = await request.json();
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
        return json({ ok: true });
      } catch (err) {
        console.error('[PUT] error:', err.message);
        return json({ error: 'Failed to save data' }, 500);
      }
    }

    // DELETE — remove all rows for a list
    if (method === 'DELETE') {
      try {
        await sql`DELETE FROM property_rows WHERE list_id = ${listId}`;
        return json({ ok: true });
      } catch (err) {
        console.error('[DELETE] error:', err.message);
        return json({ error: 'Failed to delete data' }, 500);
      }
    }
  }

  return json({ error: 'Not found' }, 404);
}
