import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_dNrF2lL0nIAK@ep-steep-wave-anjjdf6s-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
});

async function createSchema() {
  const schema = fs.readFileSync('./server/schema.sql', 'utf8');
  
  try {
    const result = await pool.query(schema);
    console.log('✅ Schema created successfully');
    
    // Verify tables
    const tableCheck = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Created ${tableCheck.rows.length} tables:`);
    tableCheck.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (err) {
    console.error('❌ Failed to create schema:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createSchema();
