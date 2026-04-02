import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : undefined,
  max: 10
});

sql`select 1`
  .then(() => {
    console.log('Connected to Supabase PostgreSQL');
  })
  .catch((err) => {
    console.error('Supabase PostgreSQL connection error:', err);
  });

export default sql;
