import { neon } from '@neondatabase/serverless';

// Singleton Neon SQL client — reuse across requests to avoid connection exhaustion
let sqlClient = null;

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }

  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }

  return sqlClient;
}

// Main API handler - routes all /api/* requests to Neon PostgreSQL
export default async function handler(request) {
  // CORS headers used on all responses
  const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Helper to return JSON responses
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: CORS });

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  try {
    // Parse pathname from request
    // request.url might be relative (/api/health) or absolute
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const method = request.method;

    // ==================== Test Endpoints ====================
    if (pathname === '/api/health') {
      // Health check - just verify API is up, no DB
      return json({ status: 'healthy', timestamp: new Date().toISOString() });
    }

    if (pathname === '/api/test') {
      // Test endpoint - verify DB connection works
      try {
        const sql = getSql();
        const result = await sql`SELECT 1 as test`;
        return json({ ok: true, message: 'API and database working!', dbTest: result });
      } catch (err) {
        console.error('❌ DB test failed:', err.message);
        return json({ ok: false, message: 'Database connection failed', error: err.message }, 500);
      }
    }

    // Get the singleton Neon connection
    let sql;
    try {
      sql = getSql();
    } catch (err) {
      console.error('❌ Neon connection failed:', err.message);
      return json({ error: 'Database connection failed: ' + err.message }, 500);
    }

    // ==================== Singleton Routes: User Profile ====================
    if (pathname === '/api/user-profile') {
      if (method === 'GET') {
        const rows = await sql`SELECT data FROM user_profiles WHERE id = 1`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'PUT') {
        const body = await request.json();
        await sql`
          INSERT INTO user_profiles (id, data, updated_at)
          VALUES (1, ${body.data}, NOW())
          ON CONFLICT (id) DO UPDATE
            SET data = EXCLUDED.data, updated_at = NOW()
        `;
        return json({ ok: true });
      }
    }

    // ==================== Singleton Routes: Settings ====================
    if (pathname === '/api/settings') {
      if (method === 'GET') {
        const rows = await sql`SELECT data FROM settings WHERE id = 1`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'PUT') {
        const body = await request.json();
        await sql`
          INSERT INTO settings (id, data, updated_at)
          VALUES (1, ${body.data}, NOW())
          ON CONFLICT (id) DO UPDATE
            SET data = EXCLUDED.data, updated_at = NOW()
        `;
        return json({ ok: true });
      }
    }

    // ==================== Backup Routes ====================
    if (pathname === '/api/backup/export') {
      if (method === 'GET') {
        // Collect all data in parallel
        const [
          profiles,
          settings_,
          deals,
          markets,
          propertyLists,
          propertyRows,
          filteredLists,
          letters,
          calculations,
        ] = await Promise.all([
          sql`SELECT data FROM user_profiles WHERE id = 1`,
          sql`SELECT data FROM settings WHERE id = 1`,
          sql`SELECT data FROM deals`,
          sql`SELECT data FROM markets`,
          sql`SELECT data FROM property_lists`,
          sql`SELECT list_id, rows FROM property_rows`,
          sql`SELECT data FROM filtered_lists`,
          sql`SELECT data FROM letters`,
          sql`SELECT data FROM calculations`,
        ]);

        return json({
          data: {
            userProfile: profiles[0]?.data ?? null,
            settings: settings_[0]?.data ?? null,
            deals: deals.map((r) => r.data),
            markets: markets.map((r) => r.data),
            propertyLists: propertyLists.map((r) => r.data),
            propertyRows: propertyRows.map((r) => ({
              listId: r.list_id,
              rows: r.rows,
            })),
            filteredLists: filteredLists.map((r) => r.data),
            letters: letters.map((r) => r.data),
            calculations: calculations.map((r) => r.data),
          },
        });
      }
    }

    if (pathname === '/api/backup/import') {
      if (method === 'POST') {
        const backup = await request.json();
        let count = 0;

        // Upsert user profile (singleton)
        if (backup.userProfile) {
          await sql`
            INSERT INTO user_profiles (id, data, updated_at)
            VALUES (1, ${backup.userProfile}, NOW())
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
          `;
          count++;
        }

        // Upsert settings (singleton)
        if (backup.settings) {
          await sql`
            INSERT INTO settings (id, data, updated_at)
            VALUES (1, ${backup.settings}, NOW())
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
          `;
          count++;
        }

        // Insert deals (sequential to avoid FK issues)
        for (const deal of backup.deals ?? []) {
          await sql`
            INSERT INTO deals (id, data, updated_at)
            VALUES (${deal.id}, ${deal}, NOW())
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
          `;
          count++;
        }

        // Insert markets
        for (const market of backup.markets ?? []) {
          await sql`
            INSERT INTO markets (id, data)
            VALUES (${market.id}, ${market})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
          `;
          count++;
        }

        // Insert property lists
        for (const plist of backup.propertyLists ?? []) {
          await sql`
            INSERT INTO property_lists (id, data)
            VALUES (${plist.id}, ${plist})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
          `;
          count++;
        }

        // Insert property rows (FK dependency on property_lists - must come after)
        for (const pr of backup.propertyRows ?? []) {
          await sql`
            INSERT INTO property_rows (list_id, rows, updated_at)
            VALUES (${pr.listId}, ${pr.rows}, NOW())
            ON CONFLICT (list_id) DO UPDATE SET rows = EXCLUDED.rows, updated_at = NOW()
          `;
          count++;
        }

        // Insert filtered lists
        for (const fl of backup.filteredLists ?? []) {
          await sql`
            INSERT INTO filtered_lists (id, data)
            VALUES (${fl.id}, ${fl})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
          `;
          count++;
        }

        // Insert letters
        for (const letter of backup.letters ?? []) {
          await sql`
            INSERT INTO letters (id, data)
            VALUES (${letter.id}, ${letter})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
          `;
          count++;
        }

        // Insert calculations
        for (const calc of backup.calculations ?? []) {
          await sql`
            INSERT INTO calculations (id, data)
            VALUES (${calc.id}, ${calc})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
          `;
          count++;
        }

        return json({ count });
      }
    }

    // ==================== Deals Routes ====================
    const dealsMatch = pathname.match(/^\/api\/deals(?:\/(.+))?$/);
    if (dealsMatch) {
      const dealId = dealsMatch[1];

      if (method === 'GET' && !dealId) {
        // List all deals
        const rows = await sql`SELECT data FROM deals ORDER BY created_at DESC`;
        return json({ data: rows.map((r) => r.data) });
      }

      if (method === 'POST' && !dealId) {
        // Create/update deal
        const deal = await request.json();
        await sql`
          INSERT INTO deals (id, data, updated_at)
          VALUES (${deal.id}, ${deal}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
        `;
        return json({ ok: true });
      }

      if (method === 'GET' && dealId) {
        // Get single deal
        const rows = await sql`SELECT data FROM deals WHERE id = ${dealId}`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'DELETE' && dealId) {
        // Delete deal
        await sql`DELETE FROM deals WHERE id = ${dealId}`;
        return json({ ok: true });
      }
    }

    // ==================== Markets Routes ====================
    const marketsMatch = pathname.match(/^\/api\/markets(?:\/(.+))?$/);
    if (marketsMatch) {
      const marketId = marketsMatch[1];

      if (method === 'GET' && !marketId) {
        // List all markets
        const rows = await sql`SELECT data FROM markets ORDER BY created_at DESC`;
        return json({ data: rows.map((r) => r.data) });
      }

      if (method === 'POST' && !marketId) {
        // Create/update market
        const market = await request.json();
        await sql`
          INSERT INTO markets (id, data)
          VALUES (${market.id}, ${market})
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `;
        return json({ ok: true });
      }

      if (method === 'GET' && marketId) {
        // Get single market
        const rows = await sql`SELECT data FROM markets WHERE id = ${marketId}`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'DELETE' && marketId) {
        // Delete market
        await sql`DELETE FROM markets WHERE id = ${marketId}`;
        return json({ ok: true });
      }
    }

    // ==================== Property Lists Routes ====================
    const propListsMatch = pathname.match(/^\/api\/property-lists(?:\/(.+))?$/);
    if (propListsMatch) {
      const listId = propListsMatch[1];

      if (method === 'GET' && !listId) {
        // List all property lists
        const rows = await sql`SELECT data FROM property_lists ORDER BY created_at DESC`;
        return json({ data: rows.map((r) => r.data) });
      }

      if (method === 'POST' && !listId) {
        // Create/update property list
        const list = await request.json();
        await sql`
          INSERT INTO property_lists (id, data)
          VALUES (${list.id}, ${list})
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `;
        return json({ ok: true });
      }

      if (method === 'DELETE' && listId) {
        // Delete property list (cascade deletes property_rows via FK)
        await sql`DELETE FROM property_lists WHERE id = ${listId}`;
        return json({ ok: true });
      }
    }

    // ==================== Raw CSV Data Routes ====================
    const rawDataMatch = pathname.match(/^\/api\/raw-data\/(.+)$/);
    if (rawDataMatch) {
      const listId = rawDataMatch[1];

      if (method === 'GET') {
        // Get raw CSV rows for a list
        const rows = await sql`SELECT rows FROM property_rows WHERE list_id = ${listId}`;
        return json({ data: rows[0]?.rows ?? [] });
      }

      if (method === 'PUT') {
        // Save raw CSV rows for a list
        const body = await request.json();
        await sql`
          INSERT INTO property_rows (list_id, rows, updated_at)
          VALUES (${listId}, ${body.rows}, NOW())
          ON CONFLICT (list_id) DO UPDATE SET rows = EXCLUDED.rows, updated_at = NOW()
        `;
        return json({ ok: true });
      }
    }

    // ==================== Filtered Lists Routes ====================
    const flMatch = pathname.match(/^\/api\/filtered-lists\/(.+)$/);
    if (flMatch) {
      const id = flMatch[1];

      if (method === 'GET') {
        const rows = await sql`SELECT data FROM filtered_lists WHERE id = ${id}`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'PUT') {
        const body = await request.json();
        await sql`
          INSERT INTO filtered_lists (id, data)
          VALUES (${id}, ${body})
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `;
        return json({ ok: true });
      }
    }

    // ==================== Letters Routes ====================
    const lettersMatch = pathname.match(/^\/api\/letters\/(.+)$/);
    if (lettersMatch) {
      const id = lettersMatch[1];

      if (method === 'GET') {
        const rows = await sql`SELECT data FROM letters WHERE id = ${id}`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'PUT') {
        const body = await request.json();
        await sql`
          INSERT INTO letters (id, data)
          VALUES (${id}, ${body})
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `;
        return json({ ok: true });
      }
    }

    // ==================== Calculations Routes ====================
    const calcMatch = pathname.match(/^\/api\/calculations\/(.+)$/);
    if (calcMatch) {
      const id = calcMatch[1];

      if (method === 'GET') {
        const rows = await sql`SELECT data FROM calculations WHERE id = ${id}`;
        return json({ data: rows[0]?.data ?? null });
      }

      if (method === 'PUT') {
        const body = await request.json();
        await sql`
          INSERT INTO calculations (id, data)
          VALUES (${id}, ${body})
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `;
        return json({ ok: true });
      }
    }

    // ==================== Fallthrough - 404 ====================
    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('API Error:', err);
    return json({ error: err.message }, 500);
  }
}
