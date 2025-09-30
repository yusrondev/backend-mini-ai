import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { saveCandidate } from "../services/candidate.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const uploads = {}; // sementara

router.post(
  "/",
  upload.fields([{ name: "cv" }, { name: "report" }]),
  async (req, res) => {
    try {
      const id = uuidv4();
      const cv = req.files?.cv?.[0]?.buffer?.toString("utf-8") || "";
      const report = req.files?.report?.[0]?.buffer?.toString("utf-8") || "";

      // ✅ validasi jika file kosong
      if (!cv || !report) {
        return res.status(400).json({
          status: "error",
          message: "CV dan Report wajib diupload.",
        });
      }

      uploads[id] = { cv, report };
      await saveCandidate(id, cv, report);

      return res.json({ id, status: "uploaded" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server.",
      });
    }
  }
);

export { router as uploadRouter, uploads };
