// Raw Data Routes
// Stores raw CSV rows separately (can be 50MB+)
// One row per property list with full array of properties

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/raw-data/:listId
router.get('/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await pool.query(
      'SELECT rows FROM property_rows WHERE list_id = $1',
      [listId]
    );
    const rows = result.rows[0]?.rows || [];
    res.json({ data: rows });
  } catch (err) {
    console.error('❌ Failed to load raw data:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/raw-data/:listId (upsert)
router.put('/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const { rows } = req.body;

    if (!Array.isArray(rows)) {
      return res.status(400).json({ error: 'rows must be an array' });
    }

    const result = await pool.query(
      `INSERT INTO property_rows (list_id, rows)
       VALUES ($1, $2)
       ON CONFLICT (list_id) DO UPDATE SET rows = $2, updated_at = NOW()
       RETURNING rows`,
      [listId, JSON.stringify(rows)]
    );

    res.json({ data: result.rows[0].rows });
  } catch (err) {
    console.error('❌ Failed to save raw data:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
