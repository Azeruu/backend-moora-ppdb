import express from "express";
import {
  getAlternatif,
  getAlternatifById,
  createAlternatif,
  updateAlternatif,
  deleteAlternatif,
} from "../Controller/AlternatifController.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/alternatif", getAlternatif);
router.get("/alternatif/:id", verifyUser,getAlternatifById);
router.post("/alternatif", verifyUser,createAlternatif);
router.patch("/alternatif/:id", verifyUser,updateAlternatif);
router.delete("/alternatif/:id", verifyUser, deleteAlternatif);

export default router;
