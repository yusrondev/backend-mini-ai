import express from "express";
import { results } from "./evaluate.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!results[id]) return res.status(404).json({ error: "Result not found" });
  res.json({ id, ...results[id] });
});

export { router as resultRouter };
