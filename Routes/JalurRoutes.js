import express from "express";
import {
  getJalur,
  getJalurById,
  createJalur,
  updateJalur,
  deleteJalur,
} from "../Controller/JalurController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/jalur", getJalur);
router.get("/jalur/:id", verifyUser, getJalurById);
router.post("/jalur", verifyUser, createJalur);
router.patch("/jalur/:id", verifyUser, updateJalur);
router.delete("/jalur/:id", verifyUser, deleteJalur);

export default router;
