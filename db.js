import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// bikin tabel candidates kalau belum ada
export async function migrate() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS candidates (
      id UUID PRIMARY KEY,
      cv TEXT,
      report TEXT,
      embedding vector(768)  -- embedding Gemini 768 dimensi
    );
  `);

  console.log("✅ Migration success: candidates table ready.");
}

export default pool;
