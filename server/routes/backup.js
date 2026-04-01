// Backup Routes
// Export all data, import data, clear all data

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/backup/export (dump all data)
router.get('/export', async (req, res) => {
  try {
    const backup = {};

    // User profile (single row)
    const upRes = await pool.query('SELECT data FROM user_profiles WHERE id = 1');
    if (upRes.rows[0]) {
      backup.lpg_user_profile = upRes.rows[0].data;
    }

    // Settings (single row)
    const setRes = await pool.query('SELECT data FROM settings WHERE id = 1');
    if (setRes.rows[0]) {
      backup.lpg_settings = setRes.rows[0].data;
    }

    // Deals
    const dealsRes = await pool.query('SELECT id, data FROM deals');
    dealsRes.rows.forEach((row) => {
      backup[`lpg_deal_${row.id}`] = row.data;
    });
    if (dealsRes.rows.length > 0) {
      backup.lpg_deals_index = dealsRes.rows.map((row) => row.id);
    }

    // Markets
    const marketsRes = await pool.query('SELECT id, data FROM markets');
    marketsRes.rows.forEach((row) => {
      backup[`lpg_market_${row.id}`] = row.data;
    });
    if (marketsRes.rows.length > 0) {
      backup.lpg_markets_index = marketsRes.rows.map((row) => row.id);
    }

    // Property lists
    const plRes = await pool.query('SELECT id, data FROM property_lists');
    plRes.rows.forEach((row) => {
      backup[`lpg_list_${row.id}`] = row.data;
    });
    if (plRes.rows.length > 0) {
      backup.lpg_lists_index = plRes.rows.map((row) => row.id);
    }

    // Raw data
    const rdRes = await pool.query('SELECT list_id, rows FROM property_rows');
    rdRes.rows.forEach((row) => {
      backup[`lpg_rawdata_${row.list_id}`] = row.rows;
    });

    // Filtered lists
    const flRes = await pool.query('SELECT id, data FROM filtered_lists');
    flRes.rows.forEach((row) => {
      backup[`lpg_filtered_${row.id}`] = row.data;
    });

    // Letters
    const lettersRes = await pool.query('SELECT id, data FROM letters');
    lettersRes.rows.forEach((row) => {
      backup[`lpg_letter_${row.id}`] = row.data;
    });

    // Calculations
    const calcsRes = await pool.query('SELECT id, data FROM calculations');
    calcsRes.rows.forEach((row) => {
      backup[`lpg_calc_${row.id}`] = row.data;
    });

    res.json({ data: backup });
  } catch (err) {
    console.error('❌ Failed to export backup:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/backup/import (bulk upsert all data)
router.post('/import', async (req, res) => {
  try {
    const backup = req.body;
    let count = 0;

    // Import user profile
    if (backup.lpg_user_profile) {
      await pool.query(
        `INSERT INTO user_profiles (id, data) VALUES (1, $1)
         ON CONFLICT (id) DO UPDATE SET data = $1`,
        [JSON.stringify(backup.lpg_user_profile)]
      );
      count++;
    }

    // Import settings
    if (backup.lpg_settings) {
      await pool.query(
        `INSERT INTO settings (id, data) VALUES (1, $1)
         ON CONFLICT (id) DO UPDATE SET data = $1`,
        [JSON.stringify(backup.lpg_settings)]
      );
      count++;
    }

    // Import deals
    const dealIds = backup.lpg_deals_index || [];
    for (const id of dealIds) {
      const dealData = backup[`lpg_deal_${id}`];
      if (dealData) {
        await pool.query(
          `INSERT INTO deals (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [id, JSON.stringify(dealData)]
        );
        count++;
      }
    }

    // Import markets
    const marketIds = backup.lpg_markets_index || [];
    for (const id of marketIds) {
      const marketData = backup[`lpg_market_${id}`];
      if (marketData) {
        await pool.query(
          `INSERT INTO markets (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [id, JSON.stringify(marketData)]
        );
        count++;
      }
    }

    // Import property lists
    const listIds = backup.lpg_lists_index || [];
    for (const id of listIds) {
      const listData = backup[`lpg_list_${id}`];
      if (listData) {
        await pool.query(
          `INSERT INTO property_lists (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [id, JSON.stringify(listData)]
        );

        // Import raw data for this list
        const rawData = backup[`lpg_rawdata_${id}`];
        if (rawData) {
          await pool.query(
            `INSERT INTO property_rows (list_id, rows) VALUES ($1, $2)
             ON CONFLICT (list_id) DO UPDATE SET rows = $2`,
            [id, JSON.stringify(rawData)]
          );
        }
        count++;
      }
    }

    // Import filtered lists
    for (const key in backup) {
      if (key.startsWith('lpg_filtered_')) {
        const id = key.replace('lpg_filtered_', '');
        await pool.query(
          `INSERT INTO filtered_lists (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [id, JSON.stringify(backup[key])]
        );
        count++;
      }
    }

    // Import letters
    for (const key in backup) {
      if (key.startsWith('lpg_letter_')) {
        const id = key.replace('lpg_letter_', '');
        await pool.query(
          `INSERT INTO letters (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [id, JSON.stringify(backup[key])]
        );
        count++;
      }
    }

    // Import calculations
    for (const key in backup) {
      if (key.startsWith('lpg_calc_')) {
        const id = key.replace('lpg_calc_', '');
        await pool.query(
          `INSERT INTO calculations (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [id, JSON.stringify(backup[key])]
        );
        count++;
      }
    }

    res.json({ success: true, count });
  } catch (err) {
    console.error('❌ Failed to import backup:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/backup/clear (clear all data except settings)
router.delete('/clear', async (req, res) => {
  try {
    // Delete all tables except settings (preserve Claude API key)
    await Promise.all([
      pool.query('DELETE FROM deals'),
      pool.query('DELETE FROM markets'),
      pool.query('DELETE FROM property_lists'), // cascades to property_rows
      pool.query('DELETE FROM filtered_lists'),
      pool.query('DELETE FROM letters'),
      pool.query('DELETE FROM calculations'),
      pool.query('DELETE FROM user_profiles'),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to clear data:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
