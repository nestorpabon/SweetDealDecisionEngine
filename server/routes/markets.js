// Markets Routes
// CRUD operations: GET all, POST (upsert), GET one, DELETE

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/markets (all markets)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, data FROM markets ORDER BY created_at DESC');
    const markets = result.rows.map((row) => ({ id: row.id, ...row.data }));
    res.json({ data: markets });
  } catch (err) {
    console.error('❌ Failed to load markets:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/markets/:id (single market)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT data FROM markets WHERE id = $1', [id]);
    const data = result.rows[0]?.data || null;
    res.json({ data });
  } catch (err) {
    console.error('❌ Failed to load market:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/markets (upsert)
router.post('/', async (req, res) => {
  try {
    const market = req.body; // Full market object with id
    const { id } = market;

    if (!id) {
      return res.status(400).json({ error: 'Market must have an id' });
    }

    const result = await pool.query(
      `INSERT INTO markets (id, data)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = $2
       RETURNING data`,
      [id, JSON.stringify(market)]
    );

    res.json({ data: { id, ...result.rows[0].data } });
  } catch (err) {
    console.error('❌ Failed to save market:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/markets/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM markets WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to delete market:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
