import express from "express";
import { searchCandidates } from "../services/candidate.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { jobDesc } = req.body;
  if (!jobDesc) return res.status(400).json({ error: "jobDesc required" });

  try {
    const candidates = await searchCandidates(jobDesc);
    res.json({ candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as searchRouter };
