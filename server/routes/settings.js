// Settings Routes
// Single-row table (id=1 always), stores Claude API key and other settings

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM settings WHERE id = 1');
    const data = result.rows[0]?.data || {};
    res.json({ data });
  } catch (err) {
    console.error('❌ Failed to load settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { data } = req.body;

    // Upsert: insert if not exists, update if exists
    const result = await pool.query(
      `INSERT INTO settings (id, data)
       VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()
       RETURNING data`,
      [JSON.stringify(data)]
    );

    res.json({ data: result.rows[0].data });
  } catch (err) {
    console.error('❌ Failed to save settings:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
