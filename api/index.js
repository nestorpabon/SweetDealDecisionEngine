// Module-level schema flag — persists across warm Lambda invocations
let initialized = false;

async function ensureSchema(sql) {
  if (initialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS property_rows (
        list_id    TEXT PRIMARY KEY,
        rows       JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    initialized = true;
    console.log('[schema] property_rows table ready');
  } catch (err) {
    console.error('[schema] failed:', err.message);
    throw err;
  }
}

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

  // Health check — no DB needed
  if (pathname === '/api/health') {
    return json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // All other routes need DB
  if (!process.env.DATABASE_URL) {
    return json({ error: 'DATABASE_URL not set' }, 500);
  }

  // Lazy-load neon only when needed (not on every cold start)
  let sql;
  try {
    const { neon } = await import('@neondatabase/serverless');
    sql = neon(process.env.DATABASE_URL);
    await ensureSchema(sql);
  } catch (err) {
    console.error('[db] connection/schema failed:', err.message);
    return json({ error: 'Database unavailable', detail: err.message }, 503);
  }

  // Raw data routes: /api/raw-data/:listId
  const match = pathname.match(/^\/api\/raw-data\/(.+)$/);
  if (match) {
    const listId = match[1];

    if (method === 'GET') {
      try {
        const rows = await sql`SELECT rows FROM property_rows WHERE list_id = ${listId}`;
        return json({ data: rows[0]?.rows ?? [] });
      } catch (err) {
        console.error('[GET /raw-data/:id] error:', err.message);
        return json({ error: 'Failed to load data' }, 500);
      }
    }

    if (method === 'PUT') {
      try {
        const body = await request.json();
        await sql`
          INSERT INTO property_rows (list_id, rows, updated_at)
          VALUES (${listId}, ${JSON.stringify(body.rows)}, NOW())
          ON CONFLICT (list_id) DO UPDATE
            SET rows = EXCLUDED.rows, updated_at = NOW()
        `;
        return json({ ok: true });
      } catch (err) {
        console.error('[PUT /raw-data/:id] error:', err.message);
        return json({ error: 'Failed to save data' }, 500);
      }
    }

    if (method === 'DELETE') {
      try {
        await sql`DELETE FROM property_rows WHERE list_id = ${listId}`;
        return json({ ok: true });
      } catch (err) {
        console.error('[DELETE /raw-data/:id] error:', err.message);
        return json({ error: 'Failed to delete data' }, 500);
      }
    }
  }

  return json({ error: 'Not found' }, 404);
}
