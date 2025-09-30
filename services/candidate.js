import pool from "../db.js";
import { generateEmbedding } from "./ai.js";

// simpan kandidat + embedding
export async function saveCandidate(id, cv, report) {
  const textData = cv + "\n" + report;
  const embedding = await generateEmbedding(textData);
  const embeddingForPG = `[${embedding.join(",")}]`;

  await pool.query(
    "INSERT INTO candidates (id, cv, report, embedding) VALUES ($1, $2, $3, $4::vector)",
    [id, cv, report, embeddingForPG]
  );
}

// cari kandidat cocok
export async function searchCandidates(jobDesc, limit = 3) {
  const embedding = await generateEmbedding(jobDesc);
  const embeddingForPG = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `SELECT id, cv, report,
      embedding <-> $1::vector AS distance
     FROM candidates
     ORDER BY embedding <-> $1::vector
     LIMIT $2`,
    [embeddingForPG, limit]
  );

  return result.rows;
}
