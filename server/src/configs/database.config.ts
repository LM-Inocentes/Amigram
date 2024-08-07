import { Pool } from 'pg';

const pool = () => {
  return new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'lminocentes',
    port: 5432, // Default PostgreSQL port
  });
};

export default pool;