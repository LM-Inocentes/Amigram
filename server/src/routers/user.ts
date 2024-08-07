import express from "express";
import {
  getUser
} from "../controllers/user";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);

/* UPDATE */

export default router;