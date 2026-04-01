// Filtered Lists Routes
// No index — only loadable/saveable by ID

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/filtered-lists/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT data FROM filtered_lists WHERE id = $1', [id]);
    const data = result.rows[0]?.data || null;
    res.json({ data });
  } catch (err) {
    console.error('❌ Failed to load filtered list:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/filtered-lists/:id (upsert)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filtered = req.body;

    const result = await pool.query(
      `INSERT INTO filtered_lists (id, data)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = $2
       RETURNING data`,
      [id, JSON.stringify(filtered)]
    );

    res.json({ data: result.rows[0].data });
  } catch (err) {
    console.error('❌ Failed to save filtered list:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
