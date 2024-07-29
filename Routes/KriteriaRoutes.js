import express from "express";
import {
  getKriteria,
  getKriteriaById,
  createKriteria,
  updateKriteria,
  deleteKriteria,
} from "../Controller/KriteriaController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/kriteria", getKriteria);
router.get("/kriteria/:id", verifyUser, getKriteriaById);
router.post("/kriteria", verifyUser, createKriteria);
router.patch("/kriteria/:id", verifyUser, updateKriteria);
router.delete("/kriteria/:id", verifyUser, deleteKriteria);

export default router;
