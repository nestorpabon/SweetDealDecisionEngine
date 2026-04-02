// Express API server for Sweet Deal Decision Engine
// All routes handle JSONB storage — the frontend doesn't need to change

import express from 'express';
import cors from 'cors';
import pool from './db.js';

// Import route handlers
import userProfileRouter from './routes/userProfile.js';
import settingsRouter from './routes/settings.js';
import dealsRouter from './routes/deals.js';
import marketsRouter from './routes/markets.js';
import propertyListsRouter from './routes/propertyLists.js';
import rawDataRouter from './routes/rawData.js';
import filteredListsRouter from './routes/filteredLists.js';
import lettersRouter from './routes/letters.js';
import calculationsRouter from './routes/calculations.js';
import backupRouter from './routes/backup.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Large CSVs can be 50MB+

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: 'Database unavailable' });
  }
});

// API Routes
app.use('/api/user-profile', userProfileRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/markets', marketsRouter);
app.use('/api/property-lists', propertyListsRouter);
app.use('/api/raw-data', rawDataRouter);
app.use('/api/filtered-lists', filteredListsRouter);
app.use('/api/letters', lettersRouter);
app.use('/api/calculations', calculationsRouter);
app.use('/api/backup', backupRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 SDDE API server running on http://localhost:${PORT}`);
    console.log(`📊 Frontend should connect to http://localhost:${PORT}/api/*`);
  });
}

// Export for Vercel
export default app;
