import dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'NOT FOUND');

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

try {
  const result = await sql`SELECT NOW()`;
  console.log('✅ DB Connected! Server time:', result[0].now);

  // Check if users table exists
  const tables = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log('Tables found:', tables.map(t => t.table_name));
} catch (err) {
  console.error('❌ DB Connection Error:', err.message);
  console.error('Full error:', err);
} finally {
  await sql.end();
  process.exit(0);
}
