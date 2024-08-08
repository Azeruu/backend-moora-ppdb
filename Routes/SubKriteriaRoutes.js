import express from "express";
import {
    getSubKriteria,
    getSubKriteriaById,
    AddSubKriteria,
    updateSubKriteria,
    deleteSubKriteria,
} from "../Controller/SubKriteriaController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/subkriteria", getSubKriteria);
router.get("/subkriteria/:id", verifyUser, getSubKriteriaById);
router.post("/subkriteria", verifyUser, AddSubKriteria);
router.patch("/subkriteria/:id", verifyUser, updateSubKriteria);
router.delete("/subkriteria/:id", verifyUser, deleteSubKriteria);

export default router;
