import pool from './db.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test if tables exist
    const tables = ['supplies', 'tickets', 'trips', 'pilgrims', 'staff', 'loyalty_clients'];
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ Table ${table} exists with ${result.rows[0].count} rows`);
      } catch (err) {
        console.log(`❌ Table ${table} does not exist or has issues:`, err.message);
      }
    }
    
    // Test specific queries that are failing
    console.log('\nTesting specific queries...');
    
    try {
      const result = await client.query('SELECT COUNT(*) FROM loyalty_clients');
      console.log('✅ loyalty_clients query works');
    } catch (err) {
      console.log('❌ loyalty_clients query failed:', err.message);
    }
    
    try {
      const result = await client.query('SELECT COUNT(*) FROM staff');
      console.log('✅ staff query works');
    } catch (err) {
      console.log('❌ staff query failed:', err.message);
    }
    
    try {
      const result = await client.query('SELECT COUNT(*) FROM tickets');
      console.log('✅ tickets query works');
    } catch (err) {
      console.log('❌ tickets query failed:', err.message);
    }
    
    client.release();
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection(); 