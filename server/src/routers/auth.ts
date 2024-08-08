import express from "express";
import { login, register } from "../controllers/auth";
import upload from "../configs/multer.config";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("picture"), register);

export default router;