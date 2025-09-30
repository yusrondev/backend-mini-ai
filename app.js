import express from "express";
import dotenv from "dotenv";
import pool, { migrate } from "./db.js";

import { uploadRouter } from "./routes/upload.js";
import { searchRouter } from "./routes/search.js";
import { evaluateRouter } from "./routes/evaluate.js";
import { resultRouter } from "./routes/result.js";

dotenv.config();

const app = express();
app.use(express.json());

// routes
app.use("/upload", uploadRouter);
app.use("/search", searchRouter);
app.use("/evaluate", evaluateRouter);
app.use("/result", resultRouter);

(async () => {
  await migrate();
  app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
})();
