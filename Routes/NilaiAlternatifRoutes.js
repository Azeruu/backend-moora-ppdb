import express from "express";
import {
  getNilaiAlternatif,
  getNilaiAlternatifById,
  createNilaiAlternatif,
  updateNilaiAlternatif,
  deleteNilaiAlternatif,
} from "../Controller/NilaiAlternatifController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/nilai_alternatif", getNilaiAlternatif);
router.get("/nilai_alternatif/:id", verifyUser, getNilaiAlternatifById);
router.post("/nilai_alternatif", verifyUser, createNilaiAlternatif);
router.patch("/nilai_alternatif/:id", verifyUser, updateNilaiAlternatif);
router.delete("/nilai_alternatif/:id", verifyUser, deleteNilaiAlternatif);

export default router;
