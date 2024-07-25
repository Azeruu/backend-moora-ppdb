import express from "express";
import {getQuota, getQuotaById, addQuota,updateQuota,deleteQuota} from "../Controller/QuotaController.js";
import { verifyUser, adminOnly} from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/quota", getQuota);
router.get("/quota/:id", verifyUser, adminOnly,getQuotaById);
router.post("/quota", verifyUser, adminOnly, addQuota);
router.patch("/quota/:id", verifyUser, adminOnly, updateQuota);
router.delete("/quota/:id", verifyUser, adminOnly,deleteQuota);

export default router;