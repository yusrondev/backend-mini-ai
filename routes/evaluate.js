import express from "express";
import { model } from "../services/ai.js";
import { safeGenerate } from "../utils/safeGenerate.js";
import { uploads } from "./upload.js";
import { jobVacancy } from "../data/jobVacancy.js"; // ✅ import

const router = express.Router();
const results = {};

router.post("/", async (req, res) => {
  const { id } = req.body;
  if (!uploads[id]) return res.status(404).json({ error: "Upload not found" });

  results[id] = { status: "queued" };
  res.json({ id, status: "queued" });

  setTimeout(async () => {
    try {
      results[id].status = "processing";
      const { cv, report } = uploads[id];

      const cvAnalysis = await safeGenerate(model, `Extract skills from CV:\n${cv}`);
      const comparison = await safeGenerate(
        model,
        `Compare CV with job:\n${JSON.stringify(jobVacancy, null, 2)}\n\n${cvAnalysis.response.text()}`
      );
      const projectEval = await safeGenerate(model, `Evaluate project:\n${report}`);

      results[id] = {
        status: "completed",
        result: {
          cv_feedback: cvAnalysis.response.text(),
          job_comparison: comparison.response.text(),
          project_feedback: projectEval.response.text(),
        }
      };
    } catch (err) {
      results[id] = { status: "failed", error: err.message };
    }
  }, 5000);
});

export { router as evaluateRouter, results };
