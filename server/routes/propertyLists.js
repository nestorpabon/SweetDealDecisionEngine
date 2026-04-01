// Property Lists Routes
// Stores list metadata and cascades delete to property_rows

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/property-lists (all lists)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, data FROM property_lists ORDER BY created_at DESC'
    );
    const lists = result.rows.map((row) => ({ id: row.id, ...row.data }));
    res.json({ data: lists });
  } catch (err) {
    console.error('❌ Failed to load property lists:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/property-lists (upsert list metadata)
router.post('/', async (req, res) => {
  try {
    const list = req.body; // Full list metadata object with id
    const { id } = list;

    if (!id) {
      return res.status(400).json({ error: 'Property list must have an id' });
    }

    const result = await pool.query(
      `INSERT INTO property_lists (id, data)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = $2
       RETURNING data`,
      [id, JSON.stringify(list)]
    );

    res.json({ data: { id, ...result.rows[0].data } });
  } catch (err) {
    console.error('❌ Failed to save property list:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/property-lists/:id (cascades to property_rows)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM property_lists WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to delete property list:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
