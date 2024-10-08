import express from "express";
import {
  getHasil,
  getHasilById,
  createHasil,
  updateHasil,
  deleteHasil,
} from "../Controller/HasilController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/hasil", getHasil);
router.get("/hasil/:id", verifyUser, getHasilById);
router.post("/hasil", verifyUser, createHasil);
// router.patch("/hasil/:id", verifyUser, updateHasil);
router.patch("/hasil", verifyUser, updateHasil);
router.delete("/hasil/:id", verifyUser, deleteHasil);

export default router;
