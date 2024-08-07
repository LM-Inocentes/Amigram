import express from "express";
import { login, register } from "../controllers/auth";
import upload from "../configs/multer.config";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("picture"), register);

export default router;