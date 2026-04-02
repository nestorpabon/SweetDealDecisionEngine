// Sweet Deal Decision Engine — Vercel API Routes
// Using Neon serverless HTTP driver for fast cold starts
// Using Vercel Functions Web Request/Response API

import { neon } from '@neondatabase/serverless';

// Create SQL client (lazy-loaded on first request)
let sql = null;

function getSql() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL || 'postgresql://localhost/sdde');
  }
  return sql;
}

// Helper: Parse JSON body from request
async function parseBody(req) {
  try {
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// Helper: Send JSON response with CORS headers
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Main handler
export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // CORS pre-flight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Health check (no DB query)
  if (path === '/api/health' || path === '/health') {
    return jsonResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
      hasDatabase: !!process.env.DATABASE_URL
    });
  }

  // Debug endpoint
  if (path === '/api/debug') {
    return jsonResponse({
      nodeVersion: process.version,
      hasDatabase: !!process.env.DATABASE_URL,
      dbURL: process.env.DATABASE_URL ? '***hidden***' : 'NOT SET'
    });
  }

  try {
    const sql_client = getSql();

    // === USER PROFILE ===
    if (path === '/api/user-profile') {
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM user_profiles WHERE id = 1');
        const data = result[0]?.data || {};
        return jsonResponse({ data });
      }
      if (method === 'PUT') {
        const body = await parseBody(req);
        const result = await sql_client(
          'INSERT INTO user_profiles (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW() RETURNING data',
          [JSON.stringify(body.data)]
        );
        return jsonResponse({ data: result[0].data });
      }
    }

    // === SETTINGS ===
    if (path === '/api/settings') {
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM settings WHERE id = 1');
        const data = result[0]?.data || {};
        return jsonResponse({ data });
      }
      if (method === 'PUT') {
        const body = await parseBody(req);
        const result = await sql_client(
          'INSERT INTO settings (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW() RETURNING data',
          [JSON.stringify(body.data)]
        );
        return jsonResponse({ data: result[0].data });
      }
    }

    // === DEALS ===
    if (path === '/api/deals') {
      if (method === 'GET') {
        const result = await sql_client('SELECT id, data FROM deals ORDER BY created_at DESC');
        const deals = result.map((row) => ({ id: row.id, ...row.data }));
        return jsonResponse({ data: deals });
      }
      if (method === 'POST') {
        const deal = await parseBody(req);
        if (!deal.id) {
          return jsonResponse({ error: 'Deal must have an id' }, 400);
        }
        const result = await sql_client(
          'INSERT INTO deals (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW() RETURNING data',
          [deal.id, JSON.stringify(deal)]
        );
        return jsonResponse({ data: { id: deal.id, ...result[0].data } });
      }
    }

    // Deal by ID
    const dealMatch = path.match(/^\/api\/deals\/([^/]+)$/);
    if (dealMatch) {
      const id = dealMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM deals WHERE id = $1', [id]);
        const data = result[0]?.data || null;
        return jsonResponse({ data });
      }
      if (method === 'DELETE') {
        await sql_client('DELETE FROM deals WHERE id = $1', [id]);
        return jsonResponse({ success: true });
      }
    }

    // === MARKETS ===
    if (path === '/api/markets') {
      if (method === 'GET') {
        const result = await sql_client('SELECT id, data FROM markets ORDER BY created_at DESC');
        const markets = result.map((row) => ({ id: row.id, ...row.data }));
        return jsonResponse({ data: markets });
      }
      if (method === 'POST') {
        const market = await parseBody(req);
        if (!market.id) {
          return jsonResponse({ error: 'Market must have an id' }, 400);
        }
        const result = await sql_client(
          'INSERT INTO markets (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW() RETURNING data',
          [market.id, JSON.stringify(market)]
        );
        return jsonResponse({ data: { id: market.id, ...result[0].data } });
      }
    }

    // Market by ID
    const marketMatch = path.match(/^\/api\/markets\/([^/]+)$/);
    if (marketMatch) {
      const id = marketMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM markets WHERE id = $1', [id]);
        const data = result[0]?.data || null;
        return jsonResponse({ data });
      }
      if (method === 'DELETE') {
        await sql_client('DELETE FROM markets WHERE id = $1', [id]);
        return jsonResponse({ success: true });
      }
    }

    // === PROPERTY LISTS ===
    if (path === '/api/property-lists') {
      if (method === 'GET') {
        const result = await sql_client('SELECT id, data FROM property_lists ORDER BY created_at DESC');
        const lists = result.map((row) => ({ id: row.id, ...row.data }));
        return jsonResponse({ data: lists });
      }
      if (method === 'POST') {
        const list = await parseBody(req);
        if (!list.id) {
          return jsonResponse({ error: 'List must have an id' }, 400);
        }
        const result = await sql_client(
          'INSERT INTO property_lists (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2 RETURNING data',
          [list.id, JSON.stringify(list)]
        );
        return jsonResponse({ data: { id: list.id, ...result[0].data } });
      }
    }

    // Property list by ID
    const propMatch = path.match(/^\/api\/property-lists\/([^/]+)$/);
    if (propMatch) {
      const id = propMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM property_lists WHERE id = $1', [id]);
        const data = result[0]?.data || null;
        return jsonResponse({ data });
      }
    }

    // === RAW DATA ===
    const rawMatch = path.match(/^\/api\/raw-data\/([^/]+)$/);
    if (rawMatch) {
      const listId = rawMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT rows FROM property_rows WHERE list_id = $1', [listId]);
        const rows = result[0]?.rows || [];
        return jsonResponse({ data: rows });
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const result = await sql_client(
          'INSERT INTO property_rows (list_id, rows) VALUES ($1, $2) ON CONFLICT (list_id) DO UPDATE SET rows = $2, updated_at = NOW() RETURNING rows',
          [listId, JSON.stringify(body.rows)]
        );
        return jsonResponse({ data: result[0].rows });
      }
    }

    // === FILTERED LISTS ===
    if (path === '/api/filtered-lists') {
      if (method === 'GET') {
        const result = await sql_client('SELECT id, data FROM filtered_lists ORDER BY created_at DESC');
        const lists = result.map((row) => ({ id: row.id, ...row.data }));
        return jsonResponse({ data: lists });
      }
      if (method === 'POST') {
        const list = await parseBody(req);
        if (!list.id) {
          return jsonResponse({ error: 'List must have an id' }, 400);
        }
        const result = await sql_client(
          'INSERT INTO filtered_lists (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2 RETURNING data',
          [list.id, JSON.stringify(list)]
        );
        return jsonResponse({ data: { id: list.id, ...result[0].data } });
      }
    }

    // Filtered list by ID
    const filtMatch = path.match(/^\/api\/filtered-lists\/([^/]+)$/);
    if (filtMatch) {
      const id = filtMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM filtered_lists WHERE id = $1', [id]);
        const data = result[0]?.data || null;
        return jsonResponse({ data });
      }
    }

    // === LETTERS ===
    if (path === '/api/letters') {
      if (method === 'GET') {
        const result = await sql_client('SELECT id, data FROM letters ORDER BY created_at DESC');
        const letters = result.map((row) => ({ id: row.id, ...row.data }));
        return jsonResponse({ data: letters });
      }
      if (method === 'POST') {
        const letter = await parseBody(req);
        if (!letter.id) {
          return jsonResponse({ error: 'Letter must have an id' }, 400);
        }
        const result = await sql_client(
          'INSERT INTO letters (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2 RETURNING data',
          [letter.id, JSON.stringify(letter)]
        );
        return jsonResponse({ data: { id: letter.id, ...result[0].data } });
      }
    }

    // Letter by ID
    const letterMatch = path.match(/^\/api\/letters\/([^/]+)$/);
    if (letterMatch) {
      const id = letterMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM letters WHERE id = $1', [id]);
        const data = result[0]?.data || null;
        return jsonResponse({ data });
      }
    }

    // === CALCULATIONS ===
    if (path === '/api/calculations') {
      if (method === 'GET') {
        const result = await sql_client('SELECT id, data FROM calculations ORDER BY created_at DESC');
        const calcs = result.map((row) => ({ id: row.id, ...row.data }));
        return jsonResponse({ data: calcs });
      }
      if (method === 'POST') {
        const calc = await parseBody(req);
        if (!calc.id) {
          return jsonResponse({ error: 'Calculation must have an id' }, 400);
        }
        const result = await sql_client(
          'INSERT INTO calculations (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2 RETURNING data',
          [calc.id, JSON.stringify(calc)]
        );
        return jsonResponse({ data: { id: calc.id, ...result[0].data } });
      }
    }

    // Calculation by ID
    const calcMatch = path.match(/^\/api\/calculations\/([^/]+)$/);
    if (calcMatch) {
      const id = calcMatch[1];
      if (method === 'GET') {
        const result = await sql_client('SELECT data FROM calculations WHERE id = $1', [id]);
        const data = result[0]?.data || null;
        return jsonResponse({ data });
      }
    }

    // 404
    return jsonResponse({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('❌ API error:', err);
    return jsonResponse({ error: err.message || 'Internal server error' }, 500);
  }
}
