// Deals Routes
// CRUD operations: GET all, POST (upsert), GET one, DELETE

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/deals (all deals)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, data FROM deals ORDER BY created_at DESC');
    const deals = result.rows.map((row) => ({ id: row.id, ...row.data }));
    res.json({ data: deals });
  } catch (err) {
    console.error('❌ Failed to load deals:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/deals/:id (single deal)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT data FROM deals WHERE id = $1', [id]);
    const data = result.rows[0]?.data || null;
    res.json({ data });
  } catch (err) {
    console.error('❌ Failed to load deal:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/deals (upsert)
router.post('/', async (req, res) => {
  try {
    const deal = req.body; // Full deal object with id
    const { id } = deal;

    if (!id) {
      return res.status(400).json({ error: 'Deal must have an id' });
    }

    const result = await pool.query(
      `INSERT INTO deals (id, data)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW()
       RETURNING data`,
      [id, JSON.stringify(deal)]
    );

    res.json({ data: { id, ...result.rows[0].data } });
  } catch (err) {
    console.error('❌ Failed to save deal:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/deals/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM deals WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to delete deal:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
